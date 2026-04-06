import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Cpu,
  Layers,
  X,
  FlaskConical,
  Loader2,
  FileDown,
} from "lucide-react";
import { FrameData } from "@/types";
import HeatmapViewer from "./HeatmapViewer";
import XAITechniquesPanel from "./XAITechniquesPanel";
import LLMCard from "./LLMCard";

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
  const [viewMode, setViewMode] = useState<"ela" | "gradcam">("gradcam");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const [currentFrame, setCurrentFrame] = useState<FrameData>(frame);
  const [isXaiLoading, setIsXaiLoading] = useState(true);
 const colors = {
    deepVoid: "#08090A",
    surface: "#121416",
    electricTeal: "#00E5FF",
    neuralGreen: "#00E676",
    hyperRed: "#FF2D55",
    warningOrange: "#FF9500",
    textHigh: "#F5F5F5",
    textMed: "#A0A0A0",
    borderWhite: "rgba(255,255,255,0.1)",
  };

  // Update local frame when prop changes
  useEffect(() => {
    setCurrentFrame(frame);
    // Set loading based on data availability
    if (frame.isAnomaly && taskId) {
      setIsXaiLoading(!(frame.gradcam_b64 || frame.ela_b64 || frame.fft_data));
    }
  }, [frame, taskId]);

  // Listen for XAI updates via custom event
  useEffect(() => {
    if (!taskId) return;

    const handleXaiUpdate = (event: CustomEvent) => {
      const { frameIndex, gradcam_b64, ela_b64, fft_data, lime_data, llm_analysis, task_id } = event.detail;
      if (String(task_id) === String(taskId) && frameIndex === currentFrame.id) {
        setCurrentFrame((prev) => ({
          ...prev,
          gradcam_b64: gradcam_b64 || prev.gradcam_b64,
          ela_b64: ela_b64 || prev.ela_b64,
          fft_data: fft_data || prev.fft_data,
          lime_data: lime_data || prev.lime_data,
          llm_analysis: llm_analysis || prev.llm_analysis,
        }));
        setIsXaiLoading(!(gradcam_b64 || ela_b64 || fft_data));
      }
    };

    window.addEventListener('xai_update', handleXaiUpdate as EventListener);
    return () => {
      window.removeEventListener('xai_update', handleXaiUpdate as EventListener);
    };
  }, [taskId, currentFrame.id]);
  
  

  // Check if XAI data is available (for showing XAI content or loading)
  const hasXaiData = currentFrame.gradcam_b64 || currentFrame.ela_b64 || currentFrame.fft_data;
  
  const handleDownloadReport = async () => {
    console.log("[VideoReport] Download triggered, frame:", currentFrame.id, "taskId:", taskId);
    const effectiveTaskId = taskId || "offline-session";
    setIsGeneratingReport(true);

    // Helper: strip data URI prefix so backend receives raw base64
    const stripDataUri = (s?: string | null) =>
      s?.startsWith("data:") ? s.split(",")[1] : (s ?? null);

    // Helper: convert blob URL to data URL
    const blobToDataUrl = async (blobUrl: string): Promise<string | null> => {
      try {
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error("Failed to convert blob to data URL:", error);
        return null;
      }
    };

    // Convert thumbnailUrl if it's a blob URL
    let frameData = currentFrame.thumbnailUrl;
    if (frameData?.startsWith("blob:")) {
      frameData = await blobToDataUrl(frameData) || "";
    }

    try {
      const body = {
        case_id: `CASE-${Date.now()}`,
        module_type: "video",
        executive_summary: currentFrame.llm_analysis,
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
              is_anomaly: currentFrame.isAnomaly,
              confidence: currentFrame.confidenceScore,
              fake_prob: currentFrame.fake_prob ?? 0.5,
              real_prob: currentFrame.real_prob ?? 0.5,
              anomaly_type: currentFrame.anomalyType ?? "GenD Deepfake",
              frame_data: frameData,
              gradcam_b64: stripDataUri(currentFrame.gradcam_b64),
              ela_b64: stripDataUri(currentFrame.ela_b64),
            },
          ]
          : [],
      };
      console.log("Thumbnail", currentFrame.thumbnailUrl)
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
            {currentFrame.isAnomaly && (
              isXaiLoading ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 20px",
                    backgroundColor: `${colors.electricTeal}1A`,
                    border: `1px solid ${colors.electricTeal}80`,
                    borderRadius: "8px",
                    color: colors.electricTeal,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "12px",
                  }}
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Preparing Report...
                </div>
              ) : (
                <button
                  onClick={handleDownloadReport}
                  disabled={isGeneratingReport}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 20px",
                    backgroundColor: `${colors.electricTeal}1A`,
                    border: `1px solid ${colors.electricTeal}80`,
                    borderRadius: "8px",
                    color: colors.electricTeal,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "12px",
                    cursor: isGeneratingReport ? "not-allowed" : "pointer",
                    opacity: isGeneratingReport ? 0.5 : 1,
                    transition: "all 0.2s",
                  }}
                >
                  <FileDown style={{ width: 16, height: 16 }} />
                  {isGeneratingReport ? "Generating..." : "Download PDF"}
                </button>
              )
            )}
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
            <div className="w-full">
              {/* Section 2: XAI + LLM */}
              <section className="space-y-6 w-full">
                <div className="flex items-center gap-3">
                  <Cpu className="w-5 h-5 text-electric-teal" />
                  <h3 className="font-display text-xl font-bold text-text-high">
                    AI Forensic Summary
                  </h3>
                </div>

                <LLMCard frame={currentFrame} />
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
              {isXaiLoading || !hasXaiData ? (
                <div className="flex items-center justify-center py-12 bg-white/5 border border-white/10 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-6 h-6 text-electric-teal animate-spin" />
                    <span className="text-sm font-mono text-text-med">Generating XAI Analysis...</span>
                  </div>
                </div>
              ) : (
                <XAITechniquesPanel frame={currentFrame} />
              )}
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
