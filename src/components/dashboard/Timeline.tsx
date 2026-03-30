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
    <div className="w-full h-full flex flex-col bg-black">
      <div className="flex items-center justify-between px-6 py-2 border-b border-white/5 bg-surface">
        <h3 className="font-mono text-xs text-text-med uppercase tracking-widest">
          Timeline Sequence
        </h3>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "12px",
            color: colors.electricTeal,
            animation: "pulse 2s infinite",
          }}
        >
          {frames.filter((f) => f.isProcessed).length} FRAMES PROCESSED
        </span>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-x-auto flex items-center px-6 gap-2 py-4 relative scrollbar-thin"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#3b6bff #060606",
        }}
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
                className={`
                  relative w-40 aspect-video rounded bg-gray-900 overflow-hidden transition-all duration-300
                  ${
                    frame.isAnomaly
                      ? "border-2 border-[#FF2D55] shadow-[0_0_20px_rgba(255,45,85,0.5)]"
                      : "border border-white/10 opacity-60 hover:opacity-100"
                  }
                `}
                onClick={() => onSelectAnomaly(frame)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  if (!frame.isAnomaly) {
                    e.currentTarget.style.boxShadow = `0 0 20px ${colors.electricTeal}40`;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = frame.isAnomaly
                    ? "0 0 20px rgba(255,45,85,0.5)"
                    : "none";
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

                {/* Probability Indicator */}
                {frame.isProcessed && frame.fake_prob !== undefined && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "8px",
                      right: "8px",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "9px",
                      color: frame.isAnomaly
                        ? colors.hyperRed
                        : colors.electricTeal,
                      backgroundColor: "rgba(0,0,0,0.7)",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      border: `1px solid ${frame.isAnomaly ? colors.hyperRed : colors.electricTeal}`,
                    }}
                  >
                    {(frame.fake_prob * 100).toFixed(1)}%
                  </div>
                )}
              </div>

              {/* Metadata / Action */}
              <div
                style={{
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {frame.isAnomaly ? (
                  <button
                    onClick={() => onSelectAnomaly(frame)}
                    className="
                      flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF2D55]/20 border border-[#FF2D55]
                      text-[#FF2D55] text-[10px] font-bold tracking-wider uppercase hover:bg-[#FF2D55] hover:text-white transition-all
                      scale-90 group-hover:scale-100 opacity-100
                    "
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
        <div className="bg-black w-20 flex-shrink-0"></div>
      </div>
    </div>
  );
};

export default Timeline;
