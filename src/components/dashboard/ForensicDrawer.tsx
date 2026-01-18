import React, { useState, useEffect } from "react";
import { X, AlertTriangle, Cpu, Activity, Layers } from "lucide-react";
import { FrameData, HeatmapConfig } from "@/types";
import HeatmapViewer from "./HeatmapViewer";
import { generateForensicInsight } from "../../services/geminiService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ForensicDrawerProps {
  isOpen: boolean;
  frame: FrameData | null;
  onClose: () => void;
}

const ForensicDrawer: React.FC<ForensicDrawerProps> = ({
  isOpen,
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
    if (isOpen && frame) {
      setLoadingAi(true);
      generateForensicInsight(frame)
        .then((text) => setAiSummary(text))
        .finally(() => setLoadingAi(false));
    } else {
      setAiSummary("");
    }
  }, [isOpen, frame]);

  if (!frame) return null;

  return (
    <div
      className={`
        fixed top-[4px] right-0 bottom-0 w-[450px] bg-surface border-l border-white/10 shadow-2xl
        transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-40
        flex flex-col
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10 bg-deep-void flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-hyper-red mb-1">
            <AlertTriangle className="w-4 h-4" />
            <h2 className="font-mono text-sm font-bold tracking-wider">
              ANOMALY DETECTED
            </h2>
          </div>
          <h1 className="font-display text-2xl font-bold text-text-high">
            Frame #{frame.id}
          </h1>
          <div className="flex items-center gap-4 mt-2 font-mono text-xs text-text-med">
            <span>TS: {frame.timestamp}</span>
            <span className="text-electric-teal">
              CONFIDENCE: {frame.confidenceScore}%
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-text-med" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Section 1: Visual Forensics */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-electric-teal">
              <Layers className="w-4 h-4" />
              <h3 className="font-display font-semibold text-sm">
                VISUAL FORENSICS
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-mono text-text-med">
                HEATMAP
              </label>
              <input
                type="checkbox"
                checked={heatmapConfig.show}
                onChange={(e) =>
                  setHeatmapConfig((p) => ({ ...p, show: e.target.checked }))
                }
                className="toggle-checkbox accent-electric-teal"
              />
            </div>
          </div>

          <HeatmapViewer frame={frame} config={heatmapConfig} />

          <div className="mt-4 px-2">
            <div className="flex justify-between text-[10px] font-mono text-text-med mb-2">
              <span>OPACITY</span>
              <span>{heatmapConfig.opacity}%</span>
            </div>
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
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-electric-teal"
            />
          </div>
        </section>

        {/* Section 2: AI Analysis */}
        <section className="bg-white/5 rounded-xl p-5 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-electric-teal to-transparent" />
          <div className="flex items-center gap-2 text-text-high mb-4">
            <Cpu className="w-4 h-4" />
            <h3 className="font-display font-semibold text-sm">
              AI FORENSIC SUMMARY
            </h3>
          </div>

          {loadingAi ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-3 bg-white/10 rounded w-3/4"></div>
              <div className="h-3 bg-white/10 rounded w-full"></div>
              <div className="h-3 bg-white/10 rounded w-5/6"></div>
            </div>
          ) : (
            <p className="font-sans text-sm text-text-med leading-relaxed">
              {aiSummary}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {frame.anomalyType && (
              <span className="px-2 py-1 rounded bg-deep-void border border-white/10 text-[10px] font-mono text-text-med">
                METHOD: {frame.anomalyType}
              </span>
            )}
            <span className="px-2 py-1 rounded bg-deep-void border border-white/10 text-[10px] font-mono text-text-med">
              MODEL: GEMINI-2.5-FLASH
            </span>
          </div>
        </section>

        {/* Section 3: Metrics */}
        <section>
          <div className="flex items-center gap-2 text-text-high mb-4">
            <Activity className="w-4 h-4" />
            <h3 className="font-display font-semibold text-sm">
              FREQUENCY SPECTRUM
            </h3>
          </div>
          <div className="h-40 w-full bg-deep-void rounded-lg border border-white/5 p-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={freqData}>
                <XAxis
                  dataKey="name"
                  stroke="#666"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#121416",
                    borderColor: "#333",
                    fontSize: "12px",
                  }}
                  itemStyle={{ color: "#F5F5F5" }}
                  cursor={{ fill: "transparent" }}
                />
                <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                  {freqData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 2 ? "#FF2D55" : "#00E5FF"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-[10px] font-mono text-text-med text-center">
            High-frequency noise detected in 85Hz band (GAN artifact signature).
          </p>
        </section>
      </div>
    </div>
  );
};

export default ForensicDrawer;
