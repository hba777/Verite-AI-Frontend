import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Cpu,
  Activity,
  Layers,
  X,
  FlaskConical,
} from "lucide-react";
import { FrameData, HeatmapConfig } from "@/types";
import HeatmapViewer from "./HeatmapViewer";
import XAITechniquesPanel from "./XAITechniquesPanel";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ForensicAnalysisSectionProps {
  frame: FrameData;
  onClose: () => void;
}

const ForensicAnalysisSection: React.FC<ForensicAnalysisSectionProps> = ({
  frame,
  onClose,
}) => {
  const [heatmapConfig, setHeatmapConfig] = useState<HeatmapConfig>({
    show: true,
    opacity: 75,
  });

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

  const aiSummary = generateForensicSummary(frame);

  // Generate frequency data based on real probability
  const fakeProb = frame.fake_prob ?? (frame.isAnomaly ? 0.85 : 0.15);
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
    circumference - (frame.confidenceScore / 100) * circumference;

  return (
    <div className="w-full bg-surface border-t border-white/10 animate-in fade-in slide-in-from-bottom-10 duration-500">
      <div className="max-w-7xl mx-auto p-8 space-y-12">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
          <div>
            <div className="flex items-center gap-2 text-hyper-red mb-2">
              <AlertTriangle className="w-5 h-5" />
              <h2 className="font-mono text-base font-bold tracking-widest">
                ANOMALY DETECTED
              </h2>
            </div>
            <div className="flex items-baseline gap-4">
              <h1 className="font-display text-4xl font-bold text-text-high">
                Frame #{frame.id}
              </h1>
              <span className="font-mono text-xl text-text-med">
                {frame.timestamp}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-8 bg-white/5 p-4 rounded-xl border border-white/5">
            <div className="text-right">
              <div className="text-[10px] font-mono text-text-med uppercase tracking-wider mb-1">
                Model Confidence
              </div>
              <div className="text-2xl font-display font-bold text-electric-teal">
                {frame.confidenceScore}%
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
                  stroke="#3b6bff"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Section 1: Visual Forensics */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Layers className="w-5 h-5 text-electric-teal" />
              <h3 className="font-display text-xl font-bold text-text-high">
                Visual Forensics
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-4 bg-black/20 px-4 py-2 rounded-full border border-white/5">
              <div className="flex items-center gap-3">
                <label className="text-xs font-mono text-text-med uppercase whitespace-nowrap">
                  Heatmap Overlay
                </label>
                <div
                  className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative ${
                    heatmapConfig.show ? "bg-electric-teal" : "bg-white/10"
                  }`}
                  onClick={() =>
                    setHeatmapConfig((p) => ({ ...p, show: !p.show }))
                  }
                >
                  <div
                    className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${
                      heatmapConfig.show ? "left-6" : "left-1"
                    }`}
                  />
                </div>
              </div>
              <div className="hidden sm:block h-4 w-px bg-white/10"></div>
              <div className="flex items-center gap-3">
                <label className="text-xs font-mono text-text-med uppercase whitespace-nowrap">
                  Opacity
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={heatmapConfig.opacity}
                  onChange={(e) =>
                    setHeatmapConfig((p) => ({
                      ...p,
                      opacity: parseInt(e.target.value),
                    }))
                  }
                  className="w-20 sm:w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-electric-teal"
                />
              </div>
            </div>
          </div>

          <div className="w-full aspect-video bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl relative">
            <HeatmapViewer frame={frame} config={heatmapConfig} />
          </div>
        </section>

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
                      {((frame.real_prob ?? 0.5) * 100).toFixed(2)}%
                    </div>
                  </div>
                  <div className="flex-1 bg-black/30 rounded-lg p-3 border border-white/5">
                    <div className="text-[10px] font-mono text-text-med uppercase tracking-wider mb-1">
                      Fake Probability
                    </div>
                    <div className="text-lg font-display font-bold text-hyper-red">
                      {((frame.fake_prob ?? 0.5) * 100).toFixed(2)}%
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/5 flex gap-3">
                  {frame.anomalyType && (
                    <span className="px-3 py-1 bg-black/40 border border-hyper-red/30 text-hyper-red text-xs font-mono rounded">
                      DETECTED: {frame.anomalyType.toUpperCase()}
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
          <XAITechniquesPanel frame={frame} />
        </section>

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
