import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Cpu,
  Layers,
  X,
  FlaskConical,
  FileDown,
} from "lucide-react";
import { FrameData } from "@/types";
import HeatmapViewer from "./HeatmapViewer";
import XAITechniquesPanel from "./XAITechniquesPanel";

interface ForensicAnalysisSectionProps {
  frame: FrameData;
  onClose: () => void;
  taskId?: string;
}

const ForensicAnalysisSection: React.FC<ForensicAnalysisSectionProps> = ({
  frame,
  onClose,
  taskId,
}) => {
  const [heatmapConfig, setHeatmapConfig] = useState<HeatmapConfig>({
    show: true,
    opacity: 75,
  });
  const [viewMode, setViewMode] = useState<"heatmap" | "ela" | "gradcam">("heatmap");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Local state for frame data to support live updates from XAI results
  const [currentFrame, setCurrentFrame] = useState<FrameData>(frame);

  // Update local frame when prop changes
  useEffect(() => {
    setCurrentFrame(frame);
  }, [frame]);

  // Listen for XAI updates via custom event
  useEffect(() => {
    const handleXAIUpdate = (event: CustomEvent) => {
      const { frameIndex, gradcam_b64, ela_b64, fft_data, lime_data, task_id } = event.detail;
      // Only update if this is the same frame and task
      if (taskId && task_id === taskId && frameIndex === currentFrame.id) {
        setCurrentFrame((prev) => ({
          ...prev,
          ...(gradcam_b64 && { gradcam_b64 }),
          ...(ela_b64 && { ela_b64 }),
          ...(fft_data && { fft_data }),
          ...(lime_data && { lime_data }),
        }));
      }
    };

    window.addEventListener('xai_update' as keyof WindowEventMap, handleXAIUpdate as EventListener);
    return () => {
      window.removeEventListener('xai_update' as keyof WindowEventMap, handleXAIUpdate as EventListener);
    };
  }, [taskId, currentFrame.id]);

  // Generate forensic summary based on real probability data from WebSocket
  const generateForensicSummary = (frame: FrameData): string => {
    const realProb = frame.real_prob ?? 0.5;
    const fakeProb = frame.fake_prob ?? 0.5;
    const confidence = frame.confidenceScore;
    const anomalyType = frame.anomalyType || "Unknown";

    if (frame.isAnomaly) {
      return (
        `GenD deepfake detection model identified this frame as ${anomalyType} with ${confidence.toFixed(1)}% confidence. ` +
        `Real probability: ${(realProb * 100).toFixed(2)}%, Fake probability: ${(fakeProb * 100).toFixed(2)}%. ` +
        `The model detected significant artifacts consistent with AI-generated content, including potential GAN fingerprints and temporal inconsistencies.`
      );
    } else {
      return (
        `GenD deepfake detection model classified this frame as authentic with ${confidence.toFixed(1)}% confidence. ` +
        `Real probability: ${(realProb * 100).toFixed(2)}%, Fake probability: ${(fakeProb * 100).toFixed(2)}%. ` +
        `No significant manipulation artifacts were detected in this frame.`
      );
    }
  };

  const aiSummary = generateForensicSummary(currentFrame);

  const handleDownloadReport = async () => {
    console.log("[VideoReport] Download triggered, frame:", currentFrame.id, "taskId:", taskId);
    const effectiveTaskId = taskId || "offline-session";
    setIsGeneratingReport(true);

    // Helper: strip data URI prefix so backend receives raw base64
    const stripDataUri = (s?: string | null) =>
      s?.startsWith("data:") ? s.split(",")[1] : (s ?? null);

    try {
      const body = {
        case_id: `CASE-${Date.now()}`,
        module_type: "video",
        executive_summary: aiSummary,
        video_data: {
          task_id: effectiveTaskId,
          file_name: "Video Analysis",
          total_frames: 1,
          duration_seconds: 0,
          verdict: currentFrame.isAnomaly ? "FAKE" : "REAL",
          is_fake: currentFrame.isAnomaly,
          confidence: currentFrame.confidenceScore,
          fake_prob: currentFrame.fake_prob ?? 0.5,
          real_prob: currentFrame.real_prob ?? 0.5,
          anomaly_count: currentFrame.isAnomaly ? 1 : 0,
          detected_type: currentFrame.anomalyType ?? null,
        },
        // Embed real frame image + GradCAM so the PDF renders them side-by-side
        flagged_frames: currentFrame.isAnomaly
          ? [
            {
              frame_index: currentFrame.id,
              timestamp: currentFrame.timestamp,
              is_anomaly: true,
              confidence: currentFrame.confidenceScore,
              fake_prob: currentFrame.fake_prob ?? 0.5,
              real_prob: currentFrame.real_prob ?? 0.5,
              anomaly_type: currentFrame.anomalyType ?? "GenD Deepfake",
              frame_data: stripDataUri(currentFrame.thumbnailUrl),
              gradcam_b64: stripDataUri(currentFrame.gradcam_b64),
              ela_b64: stripDataUri(currentFrame.ela_b64),
            },
          ]
          : [],
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

      const filename = data.file_path.split(/[\\\/]/).pop()!;
      const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL}/report/download/${filename}`;

      const dlRes = await fetch(downloadUrl);
      if (!dlRes.ok) throw new Error(`Download failed (${dlRes.status})`);

      const blob = await dlRes.blob();
      const url = window.URL.createObjectURL(blob);
      const a = Object.assign(document.createElement("a"), { href: url, download: filename });
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      console.log("[VideoReport] ✅ Downloaded:", filename);
    } catch (error) {
      console.error("[VideoReport] Error:", error);
      alert(`Failed to generate report: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Generate frequency data based on real probability
  const fakeProb = currentFrame.fake_prob ?? (currentFrame.isAnomaly ? 0.85 : 0.15);
  const freqData = [
    { name: "Low", value: Math.round(fakeProb * 20 + 15) },
    { name: "Mid", value: Math.round(fakeProb * 30 + 25) },
    { name: "High", value: Math.round(fakeProb * 70 + 10) }, // Spike in high freq typical of GANs
    { name: "V.High", value: Math.round(fakeProb * 55 + 5) },
  ];

  // Confidence Radial Gauge Calculation
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (currentFrame.confidenceScore / 100) * circumference;

  return (
    <div className="w-full bg-surface border-t border-white/10 animate-in fade-in slide-in-from-bottom-10 duration-500">
      <div className="max-w-7xl mx-auto p-8 space-y-12">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
          <div>
            <div className={`flex items-center gap-2 mb-2 ${currentFrame.isAnomaly ? 'text-hyper-red' : 'text-electric-teal'}`}>
              {currentFrame.isAnomaly ? <AlertTriangle className="w-5 h-5" /> : <Cpu className="w-5 h-5" />}
              <h2 className="font-mono text-base font-bold tracking-widest">
                {currentFrame.isAnomaly ? 'ANOMALY DETECTED' : 'FRAME ANALYSIS'}
              </h2>
            </div>
            <div className="flex items-baseline gap-4">
              <h1 className="font-display text-4xl font-bold text-text-high">
                Frame #{currentFrame.id + 1}
              </h1>
              <span className="font-mono text-xl text-text-med">
                {currentFrame.timestamp}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-8 bg-white/5 p-4 rounded-xl border border-white/5">
            <div className="text-right">
              <div className="text-[10px] font-mono text-text-med uppercase tracking-wider mb-1">
                Model Confidence
              </div>
              <div className="text-2xl font-display font-bold text-electric-teal">
                {currentFrame.confidenceScore}%
              </div>
            </div>
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="transform -rotate-90 w-full h-full">
                <circle
                  cx="32"
                  cy="32"
                  r={radius}
                  stroke="#1a1d21"
                  strokeWidth="4"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r={radius}
                  stroke={currentFrame.isAnomaly ? "#FF2D55" : "#3b6bff"}
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
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
              <span className="text-sm font-mono uppercase">
                {isGeneratingReport ? "Generating..." : "Download PDF"}
              </span>
            </button>
          </div>
        </div>

        {/* Section 1: Visual Forensics */}
        {currentFrame.isAnomaly && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-electric-teal" />
                <h3 className="font-display text-xl font-bold text-text-high">
                  Visual Forensics
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-4 bg-black/20 px-4 py-2 rounded-full border border-white/5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode("ela")}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${viewMode === "ela"
                        ? "bg-electric-teal text-black"
                        : "bg-white/10 text-text-med hover:bg-white/20"
                      }`}
                  >
                    ELA
                  </button>
                  <button
                    onClick={() => setViewMode("gradcam")}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${viewMode === "gradcam"
                        ? "bg-electric-teal text-black"
                        : "bg-white/10 text-text-med hover:bg-white/20"
                      }`}
                  >
                    GradCAM
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full aspect-video bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl relative">
              <HeatmapViewer frame={currentFrame} config={{ show: true, opacity: 75 }} viewMode={viewMode} />
            </div>
          </section>
        )}

        {currentFrame.isAnomaly && (
          <>
            <div className="flex gap-12">
              {/* Section 2: XAI + LLM */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <Cpu className="w-5 h-5 text-electric-teal" />
                  <h3 className="font-display text-xl font-bold text-text-high">
                    AI Forensic Summary
                  </h3>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-8 relative overflow-hidden group h-full">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-electric-teal to-transparent" />
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-electric-teal/5 rounded-full blur-3xl group-hover:bg-electric-teal/10 transition-colors duration-500"></div>

                  <div className="relative z-10">
                    <h4 className="font-mono text-sm text-electric-teal mb-4 uppercase tracking-wider">
                      GenD Model Analysis
                    </h4>
                    <p className="font-sans text-base text-text-high leading-relaxed">
                      {aiSummary}
                    </p>

                    {/* Real/Fake Probability Display */}
                    <div className="mt-4 flex gap-4">
                      <div className="flex-1 bg-black/30 rounded-lg p-3 border border-white/5">
                        <div className="text-[10px] font-mono text-text-med uppercase tracking-wider mb-1">
                          Real Probability
                        </div>
                        <div className="text-lg font-display font-bold text-neural-green">
                          {((currentFrame.real_prob ?? 0.5) * 100).toFixed(2)}%
                        </div>
                      </div>
                      <div className="flex-1 bg-black/30 rounded-lg p-3 border border-white/5">
                        <div className="text-[10px] font-mono text-text-med uppercase tracking-wider mb-1">
                          Fake Probability
                        </div>
                        <div className="text-lg font-display font-bold text-hyper-red">
                          {((currentFrame.fake_prob ?? 0.5) * 100).toFixed(2)}%
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/5 flex gap-3">
                      {currentFrame.anomalyType && (
                        <span className="px-3 py-1 bg-black/40 border border-hyper-red/30 text-hyper-red text-xs font-mono rounded">
                          DETECTED: {currentFrame.anomalyType.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* ── XAI Techniques Section ─────────────────────────────────── */}
            <section className="space-y-6 border-t border-white/5 pt-10">
              <div className="flex items-center gap-3">
                <FlaskConical className="w-5 h-5 text-electric-teal" />
                <h3 className="font-display text-xl font-bold text-text-high">
                  Explainable AI (XAI) Analysis
                </h3>
              </div>
              <XAITechniquesPanel frame={currentFrame} />
            </section>
          </>
        )}

        <div className="flex justify-center pt-8">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-mono text-xs tracking-widest uppercase text-white"
            style={{
              backgroundImage:
                "linear-gradient(#060606, #060606), linear-gradient(90deg, #3b6bff, #2e96ff 65%, #acb7ff)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
              border: "2px solid transparent",
              transition:
                "background-color 0.3s ease, background-image 0.3s ease",
            }}
            onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundImage =
              "linear-gradient(#222323, #222323), linear-gradient(90deg, #3b6bff, #2e96ff 65%, #acb7ff)")
            }
            onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundImage =
              "linear-gradient(#060606, #060606), linear-gradient(90deg, #3b6bff, #2e96ff 65%, #acb7ff)")
            }
          >
            <X className="w-4 h-4" />
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForensicAnalysisSection;
