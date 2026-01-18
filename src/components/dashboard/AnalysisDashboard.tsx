import React, { useEffect, useState, useRef } from "react";
import Timeline from "./Timeline";
import ForensicAnalysisSection from "./ForensicAnalysisSection";
import { FrameData, AppState } from "@/types";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

interface AnalysisDashboardProps {
  appState: AppState;
  frames: FrameData[];
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
  appState,
  frames,
}) => {
  const [progress, setProgress] = useState(0);
  const [selectedFrame, setSelectedFrame] = useState<FrameData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const analysisRef = useRef<HTMLDivElement>(null);

  // Simulate analysis progress
  useEffect(() => {
    if (appState === AppState.ANALYZING) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 0.5;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [appState]);

  // Scroll to analysis when frame selected
  useEffect(() => {
    if (selectedFrame && analysisRef.current) {
      setTimeout(() => {
        analysisRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [selectedFrame]);

  const handleSelectAnomaly = (frame: FrameData) => {
    setSelectedFrame(frame);
    setIsPlaying(false);
  };

  const processedCount = frames.filter((f) => f.isProcessed).length;
  const anomalyCount = frames.filter(
    (f) => f.isProcessed && f.isAnomaly
  ).length;

  // Theme colors from HTML
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

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: colors.deepVoid,
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Top Progress Bar "The Pulse" (Sticky) */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          width: "100%",
          backgroundColor: colors.deepVoid,
        }}
      >
        <div
          style={{
            height: "4px",
            width: "100%",
            backgroundColor: colors.surface,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: `linear-gradient(to right, ${colors.electricTeal}, #3B82F6)`,
              transition: "width 0.1s linear",
              boxShadow: `0 0 10px ${colors.electricTeal}80`,
            }}
          />
        </div>

        {/* Status Pill */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(18,20,22,0.8)",
              backdropFilter: "blur(8px)",
              border: `1px solid ${colors.borderWhite}`,
              borderRadius: "9999px",
              padding: "4px 16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: colors.electricTeal,
                animation: "pulse 2s infinite",
              }}
            ></div>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "12px",
                fontWeight: 500,
                color: colors.textHigh,
                letterSpacing: "1px",
              }}
            >
              {progress < 100
                ? `ANALYZING FRAMES (${Math.floor(progress)}%)`
                : "ANALYSIS COMPLETE"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top Section: Main Video Player (Mock) */}
        <div
          style={{
            height: "60vh",
            width: "100%",
            position: "relative",
            backgroundColor: "black",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: `1px solid ${colors.borderWhite}`,
          }}
        >
          {/* Grid Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              pointerEvents: "none",
            }}
          ></div>

          {selectedFrame ? (
            <img
              src={selectedFrame.thumbnailUrl}
              alt="Main view"
              style={{
                height: "100%",
                width: "100%",
                objectFit: "contain",
                padding: "32px",
              }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: "rgba(245,245,245,0.2)",
              }}
            >
              <div
                style={{
                  width: "96px",
                  height: "96px",
                  border: "2px solid currentColor",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <Play
                  style={{
                    width: "40px",
                    height: "40px",
                    fill: "currentColor",
                    marginLeft: "4px",
                  }}
                />
              </div>
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "14px",
                }}
              >
                SELECT A FRAME TO INSPECT
              </p>
            </div>
          )}

          {/* Player Controls */}
          <div
            style={{
              position: "absolute",
              bottom: "32px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: "24px",
              backgroundColor: "rgba(18,20,22,0.9)",
              backdropFilter: "blur(8px)",
              border: `1px solid ${colors.borderWhite}`,
              padding: "12px 32px",
              borderRadius: "24px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              opacity: 0,
              transition: "opacity 0.3s",
            }}
          >
            <SkipBack
              style={{
                width: "20px",
                height: "20px",
                color: colors.textMed,
                cursor: "pointer",
              }}
            />
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: colors.electricTeal,
                color: colors.deepVoid,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color 0.2s",
              }}
            >
              {isPlaying ? (
                <Pause style={{ fill: "currentColor" }} />
              ) : (
                <Play style={{ fill: "currentColor", marginLeft: "4px" }} />
              )}
            </button>
            <SkipForward
              style={{
                width: "20px",
                height: "20px",
                color: colors.textMed,
                cursor: "pointer",
              }}
            />
          </div>

          {/* Stats Overlay */}
          <div
            style={{
              position: "absolute",
              top: "32px",
              left: "32px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px",
              color: colors.textMed,
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(0,0,0,0.5)",
                padding: "4px 8px",
                borderRadius: "4px",
              }}
            >
              PROCESSED: {processedCount} / {frames.length}
            </div>
            <div
              style={{
                backgroundColor: "rgba(0,0,0,0.5)",
                padding: "4px 8px",
                borderRadius: "4px",
                color: colors.hyperRed,
              }}
            >
              ANOMALIES: {anomalyCount}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div
          style={{
            height: "192px",
            backgroundColor: colors.surface,
            borderTop: `1px solid ${colors.borderWhite}`,
            position: "relative",
            zIndex: 20,
            flexShrink: 0,
          }}
        >
          <Timeline frames={frames} onSelectAnomaly={handleSelectAnomaly} />
        </div>
      </div>

      {/* Expanded Analysis Section */}
      {selectedFrame && (
        <div ref={analysisRef} style={{ width: "100%" }}>
          <ForensicAnalysisSection
            frame={selectedFrame}
            onClose={() => setSelectedFrame(null)}
          />
        </div>
      )}
    </div>
  );
};

export default AnalysisDashboard;
