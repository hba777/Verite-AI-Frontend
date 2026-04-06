import React, { useRef, useState, useCallback } from "react";
import { AudioAnalysisResult } from "@/types";
import AudioSpectrogramCanvas from "./AudioSpectrogramCanvas";
import {
  ShieldCheck, AlertTriangle, Activity,
  Wand2, BarChart2, Play, Pause, Layers, CircleDot, FileDown
} from "lucide-react";

interface AudioResultProps {
  result: AudioAnalysisResult;
  fileName: string;
  audioObjectUrl?: string;
}

// ─── Theme Colors ────────────────────────────────────────────────────────
const colors = {
  deepVoid: "#08090A",
  surface: "#121416",
  electricTeal: "#00E5FF",
  neuralGreen: "#00E676",
  hyperRed: "#FF2D55",
  textHigh: "#F5F5F5",
  textMed: "#A0A0A0",
  borderWhite: "rgba(255,255,255,0.1)",
};

type XaiTab = "ig" | "shap" | "none";
const TAB_DEFS: { id: XaiTab; label: string; icon: React.ReactNode }[] = [
  { id: "none", label: "Off", icon: <CircleDot style={{ width: 13, height: 13 }} /> },
  { id: "ig", label: "Integrated Gradients", icon: <Wand2 style={{ width: 13, height: 13 }} /> },
  { id: "shap", label: "SHAP", icon: <BarChart2 style={{ width: 13, height: 13 }} /> },
];

const AudioResult: React.FC<AudioResultProps> = ({ result, fileName, audioObjectUrl }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [activeXai, setActiveXai] = useState<XaiTab>("ig");
  const [currentTime, setCurrentTime] = useState(0);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const togglePlay = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    setCurrentTime(audioRef.current?.currentTime ?? 0);
  }, []);

  const handleEnded = useCallback(() => setPlaying(false), []);

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    const ms  = Math.floor((s % 1) * 100).toString().padStart(2, "0");
    return `${min}:${sec}:${ms}`;
  };

  const handleDownloadReport = async () => {
    setIsGeneratingReport(true);
    try {
      const summary = isFake
        ? `WavLM feature extractor detected significant acoustic artifacts consistent with AI-generated audio or voice cloning. The classifier output indicates a ${(result.fake_prob * 100).toFixed(1)}% probability of synthetic generation.`
        : `WavLM analysis found the acoustic profile to be consistent with natural human speech recordings. The classifier output indicates a ${(result.real_prob * 100).toFixed(1)}% probability of authentic audio.`;

      const body = {
        case_id:           `CASE-${Date.now()}`,
        module_type:       "audio",
        executive_summary: summary,
        audio_data: {
          file_name:        fileName,
          duration_seconds: result.duration_seconds,
          verdict:          isFake ? "FAKE" : "REAL",
          is_fake:          isFake,
          confidence:       result.confidence,
          fake_prob:        result.fake_prob,
          real_prob:        result.real_prob,
        },
        // Forward STFT spectrogram matrix so the PDF can render it
        stft:        result.stft        ?? null,
        // Forward XAI score vectors for the attribution charts
        ig_scores:   result.ig_scores   ?? null,
        shap_scores: result.shap_scores ?? null,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/report/generate`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
      );

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Report generation failed (${response.status}): ${err}`);
      }

      const data = await response.json();
      if (!data.file_path) throw new Error("No file_path in response");

      const filename    = data.file_path.split(/[\\/]/).pop()!;
      const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL}/report/download/${filename}`;

      const dlRes = await fetch(downloadUrl);
      if (!dlRes.ok) throw new Error(`Download failed (${dlRes.status})`);

      const blob = await dlRes.blob();
      const url  = window.URL.createObjectURL(blob);
      const a    = Object.assign(document.createElement("a"), { href: url, download: filename });
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report. Please try again.");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const isFake = result.is_fake;
  const confidence = result.confidence;
  const statusColor = isFake ? colors.hyperRed : colors.neuralGreen;

  // Confidence Gauge
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (confidence / 100) * circumference;

  return (
    <div className="w-full bg-black border-t border-white/10 animate-in fade-in pb-16">
      {audioObjectUrl && (
        <audio
          ref={audioRef}
          src={audioObjectUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          preload="metadata"
          style={{ display: "none" }}
        />
      )}

      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 md:space-y-12">
        {/* ─── 1. Status & Verdict Header ───────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-start lg:items-center justify-between gap-6 border-b border-white/5 pb-8">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2" style={{ color: statusColor }}>
              {isFake ? <AlertTriangle className="w-5 h-5 flex-shrink-0" /> : <ShieldCheck className="w-5 h-5 flex-shrink-0" />}
              <h2 className="font-mono text-sm md:text-base font-bold tracking-widest uppercase truncate">
                {isFake ? "ANOMALY DETECTED" : "AUTHENTIC AUDIO"}
              </h2>
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="font-sans text-2xl md:text-3xl lg:text-4xl font-bold text-gray-100 break-words">
                {fileName}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] md:text-xs font-mono text-gray-500 mt-2">
                <span>16 kHz</span>
                <span className="hidden sm:inline w-1 h-1 rounded-full bg-gray-600"></span>
                <span>Mono</span>
                <span className="hidden sm:inline w-1 h-1 rounded-full bg-gray-600"></span>
                <span>{result.duration_seconds.toFixed(2)}s Duration</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-8 bg-white/5 p-4 rounded-xl border border-white/5 self-start md:self-auto">
            <div className="text-right">
              <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">
                Model Confidence
              </div>
              <div className="text-xl md:text-2xl font-sans font-bold" style={{ color: colors.electricTeal }}>
                {confidence.toFixed(1)}%
              </div>
            </div>
            <div className="relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
              <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r={radius} stroke="#1a1d21" strokeWidth="4" fill="transparent" />
                <circle
                  cx="32" cy="32" r={radius} stroke={colors.electricTeal} strokeWidth="4" fill="transparent"
                  strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
            </div>
            <button
              onClick={handleDownloadReport}
              disabled={isGeneratingReport}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-electric-teal/20 border border-electric-teal/50 text-electric-teal hover:bg-electric-teal/30 transition-colors disabled:opacity-50"
            >
              <FileDown className="w-4 h-4" />
              <span className="text-sm font-mono uppercase whitespace-nowrap">
                {isGeneratingReport ? "Generating..." : "PDF"}
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* ─── AI Forensic Summary ────────────────────────────────────────── */}
          <section className="lg:col-span-1 space-y-4 md:space-y-6">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 flex-shrink-0" style={{ color: colors.electricTeal }} />
              <h3 className="font-sans text-lg md:text-xl font-bold text-gray-100">AI Forensic Summary</h3>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-5 md:p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#00E5FF] to-transparent" />
              <div className="relative z-10 flex flex-col gap-4">
                <h4 className="font-mono text-xs md:text-sm uppercase tracking-wider" style={{ color: colors.electricTeal }}>
                  ASVspoof WavLM Analysis
                </h4>
                <p className="font-sans text-sm text-gray-300 leading-relaxed">
                  {isFake
                    ? `WavLM feature extractor detected significant acoustic artifacts consistent with AI-generated audio or voice cloning.`
                    : `WavLM analysis found the acoustic profile to be consistent with natural human speech recordings.`
                  }
                  {" "} The classifier output indicates a {(result.fake_prob * 100).toFixed(1)}% probability of synthetic generation.
                </p>

                <div className="mt-2 flex flex-col gap-3">
                  <div className="bg-black/30 rounded-lg p-3 border border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Real Prob</span>
                    <span className="text-base md:text-lg font-sans font-bold" style={{ color: colors.neuralGreen }}>
                      {(result.real_prob * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="bg-black/30 rounded-lg p-3 border border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Fake Prob</span>
                    <span className="text-base md:text-lg font-sans font-bold" style={{ color: colors.hyperRed }}>
                      {(result.fake_prob * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ─── Inspector & XAI ────────────────────────────────────────────── */}
          <section className="lg:col-span-2 space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 flex-shrink-0" style={{ color: colors.electricTeal }} />
                <h3 className="font-sans text-lg md:text-xl font-bold text-gray-100">Dual-Layer Audio Inspector</h3>
              </div>
              <div className="flex flex-wrap gap-2 bg-black/20 p-1 rounded-xl sm:rounded-full border border-white/5">
                {TAB_DEFS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveXai(tab.id)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-[9px] md:text-[10px] uppercase tracking-wider transition-all whitespace-nowrap"
                    style={{
                      background: activeXai === tab.id ? `${colors.electricTeal}1A` : "transparent",
                      color: activeXai === tab.id ? colors.electricTeal : colors.textMed,
                      border: `1px solid ${activeXai === tab.id ? `${colors.electricTeal}40` : "transparent"}`,
                    }}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full bg-[#08090A] border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col">
              {/* Canvas Renderer */}
              <div className="relative w-full border-b border-white/5 bg-[#121416]">
                <AudioSpectrogramCanvas
                  waveformSamples={result.waveform_samples}
                  stft={result.stft}
                  igScores={result.ig_scores}
                  shapScores={result.shap_scores}
                  activeXai={activeXai}
                  audioRef={audioRef}
                  durationSeconds={result.duration_seconds}
                />
              </div>

              {/* Playback Controller */}
              <div className="bg-[#121416] p-4 flex flex-col gap-4">
                <div className="flex items-center gap-4 md:gap-6">
                  <button
                    onClick={togglePlay}
                    className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-full flex items-center justify-center transition-all disabled:opacity-50"
                    style={{ backgroundColor: colors.electricTeal, color: colors.deepVoid }}
                    disabled={!audioObjectUrl}
                  >
                    {playing ? <Pause className="fill-current w-4 h-4 md:w-5 md:h-5" /> : <Play className="fill-current w-4 h-4 md:w-5 md:h-5 ml-1" />}
                  </button>
                  
                  <div className="flex flex-col flex-1 gap-2 min-w-0">
                    <div className="flex justify-between items-center text-[10px] md:text-xs font-mono text-gray-400">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(result.duration_seconds)}</span>
                    </div>
                    {/* Scrub Bar */}
                    <div
                      className="w-full h-1.5 md:h-2 bg-[#222323] rounded-full cursor-pointer relative overflow-hidden group"
                      onClick={(e) => {
                        if (audioRef.current && result.duration_seconds > 0) {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const percent = (e.clientX - rect.left) / rect.width;
                          audioRef.current.currentTime = percent * result.duration_seconds;
                        }
                      }}
                    >
                      <div
                        className="absolute h-full left-0 top-0 transition-all duration-75"
                        style={{
                          width: `${result.duration_seconds > 0 ? (currentTime / result.duration_seconds) * 100 : 0}%`,
                          backgroundColor: colors.electricTeal,
                          boxShadow: `0 0 8px ${colors.electricTeal}`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 border-t border-white/5 text-[9px] md:text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full" style={{ backgroundColor: "#FF9A00" }}></div>
                    <span>XAI Hotspot (Fake Evidence)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-gradient-to-t from-black to-yellow-500"></div>
                    <span>STFT Spectrogram Energy</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AudioResult;
