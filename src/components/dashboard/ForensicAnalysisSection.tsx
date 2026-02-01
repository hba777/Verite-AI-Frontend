import React, { useState, useEffect } from "react";
import { AlertTriangle, Cpu, Activity, Layers, X } from "lucide-react";
import { FrameData, HeatmapConfig } from "@/types";
import HeatmapViewer from "./HeatmapViewer";
import { generateForensicInsight } from "../../services/geminiService";
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
  const [aiSummary, setAiSummary] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState(false);

  // Mock frequency data
  const freqData = [
    { name: "Low", value: 20 },
    { name: "Mid", value: 35 },
    { name: "High", value: 85 }, // Spike in high freq typical of GANs
    { name: "V.High", value: 60 },
  ];

  useEffect(() => {
    setLoadingAi(true);
    generateForensicInsight(frame)
      .then((text) => setAiSummary(text))
      .finally(() => setLoadingAi(false));
  }, [frame]);

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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
                  Generated Insight
                </h4>
                {loadingAi ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-2 bg-white/10 rounded w-full"></div>
                    <div className="h-2 bg-white/10 rounded w-5/6"></div>
                    <div className="h-2 bg-white/10 rounded w-4/6"></div>
                  </div>
                ) : (
                  <p className="font-sans text-base text-text-high leading-relaxed">
                    {aiSummary}
                  </p>
                )}

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

          {/* Section 3: Metrics */}
          <section className="pt-10 sm:pt-0 space-y-6">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-electric-teal" />
              <h3 className="font-display text-xl font-bold text-text-high">
                Signal Metrics
              </h3>
            </div>

            <div className="space-y-4">
              {/* Freq Spectrum */}
              <div className="h-48 w-full bg-deep-void rounded-xl border border-white/10 p-4 relative">
                <div className="absolute top-2 right-2 text-[10px] font-mono text-text-med">
                  FREQUENCY SPECTRUM (Hz)
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={freqData}>
                    <XAxis
                      dataKey="name"
                      stroke="#666"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#121416",
                        borderColor: "#333",
                        fontSize: "12px",
                      }}
                      itemStyle={{ color: "#F5F5F5" }}
                      cursor={{ fill: "rgba(255,255,255,0.05)" }}
                    />
                    <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                      {freqData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === 2 ? "#FF2D55" : "#3b6bff"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* ELA Mock */}
              <div className="h-24 w-full bg-deep-void rounded-xl border border-white/10 p-4 flex items-center gap-6 overflow-hidden relative">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.5%22/%3E%3C/svg%3E")',
                  }}
                ></div>
                <div className="relative z-10 flex-1">
                  <div className="text-[10px] font-mono text-text-med mb-1">
                    ERROR LEVEL ANALYSIS (ELA)
                  </div>
                  <div className="text-sm text-text-high">
                    High variance detected in periocular region.
                  </div>
                </div>
                <div className="relative z-10">
                  <div className="w-2 h-2 rounded-full bg-hyper-red animate-pulse"></div>
                </div>
              </div>
            </div>
          </section>
        </div>

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
