import React, { useRef } from "react";
import { FrameData } from "@/types";
import { Eye } from "lucide-react";

interface TimelineProps {
  frames: FrameData[];
  onSelectAnomaly: (frame: FrameData) => void;
}

const Timeline: React.FC<TimelineProps> = ({ frames, onSelectAnomaly }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Theme colors
  const colors = {
    surface: "#121416",
    electricTeal: "#00E5FF",
    hyperRed: "#FF2D55",
    textHigh: "#F5F5F5",
    textMed: "#A0A0A0",
    borderWhite: "rgba(255,255,255,0.1)",
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between", 
        padding: "8px 24px", 
        borderBottom: `1px solid ${colors.borderWhite}`,
        backgroundColor: colors.surface,
      }}>
        <h3 style={{ 
          fontFamily: "'JetBrains Mono', monospace", 
          fontSize: "12px", 
          color: colors.textMed, 
          textTransform: "uppercase", 
          letterSpacing: "2px",
        }}>
          Timeline Sequence
        </h3>
        <span style={{ 
          fontFamily: "'JetBrains Mono', monospace", 
          fontSize: "12px", 
          color: colors.electricTeal,
          animation: "pulse 2s infinite",
        }}>
          {frames.filter((f) => f.isProcessed).length} FRAMES PROCESSED
        </span>
      </div>

      <div
        ref={scrollContainerRef}
        style={{
          flex: 1,
          overflowX: "auto",
          display: "flex",
          alignItems: "center",
          padding: "16px 24px",
          gap: "8px",
          position: "relative",
        }}
        className="hide-scrollbar"
      >
        {frames.map((frame) => {
          if (!frame.isProcessed) return null;

          return (
            <div
              key={frame.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                flexShrink: 0,
                position: "relative",
              }}
            >
              <div
                onClick={() => onSelectAnomaly(frame)}
                style={{
                  position: "relative",
                  width: "160px",
                  aspectRatio: "16/9",
                  borderRadius: "8px",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  transform: "scale(1)",
                }}
                className="frame-item"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = `0 0 20px ${colors.electricTeal}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Frame Image */}
                <img
                  src={frame.thumbnailUrl}
                  alt={`Frame ${frame.id}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "all 0.5s ease",
                    filter: frame.isAnomaly ? "blur(4px)" : "none",
                  }}
                  loading="lazy"
                />

                {/* Hover reveal effect */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: frame.isAnomaly 
                      ? `${colors.hyperRed}10` 
                      : `${colors.electricTeal}05`,
                    opacity: 0,
                    transition: "opacity 0.3s",
                  }}
                  className="frame-overlay"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "0";
                  }}
                />

                {/* Anomaly Indicator */}
                {frame.isAnomaly && (
                  <div
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      backgroundColor: colors.hyperRed,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: `0 0 10px ${colors.hyperRed}`,
                    }}
                  >
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: "#fff",
                      }}
                    />
                  </div>
                )}

                {/* Frame Number */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "8px",
                    left: "8px",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "10px",
                    color: colors.textHigh,
                    backgroundColor: "rgba(0,0,0,0.6)",
                    padding: "2px 6px",
                    borderRadius: "4px",
                  }}
                >
                  #{frame.id}
                </div>
              </div>

              {/* Metadata / Action */}
              <div style={{ height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {frame.isAnomaly ? (
                  <button
                    onClick={() => onSelectAnomaly(frame)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 12px",
                      borderRadius: "9999px",
                      backgroundColor: `${colors.hyperRed}20`,
                      border: `1px solid ${colors.hyperRed}50`,
                      color: colors.hyperRed,
                      fontSize: "10px",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.hyperRed;
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = `${colors.hyperRed}20`;
                      e.currentTarget.style.color = colors.hyperRed;
                    }}
                  >
                    <Eye style={{ width: "12px", height: "12px" }} />
                    View
                  </button>
                ) : (
                  <span
                    style={{
                      fontSize: "10px",
                      fontFamily: "'JetBrains Mono', monospace",
                      color: colors.textMed,
                      opacity: 0.5,
                      cursor: "pointer",
                    }}
                    onClick={() => onSelectAnomaly(frame)}
                    title="Click to jump to timestamp"
                  >
                    {frame.timestamp}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Spacer for end of list */}
        <div style={{ width: "80px", flexShrink: 0 }}></div>
      </div>
    </div>
  );
};

export default Timeline;
