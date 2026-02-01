import React, { useRef, useEffect } from "react";
import { FrameData } from "@/types";
import { Eye } from "lucide-react";

interface TimelineProps {
  frames: FrameData[];
  onSelectAnomaly: (frame: FrameData) => void;
}

const Timeline: React.FC<TimelineProps> = ({ frames, onSelectAnomaly }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to end while processing (optional, disabled here for user control)

  return (
    <div className="w-full h-full flex flex-col bg-black">
      <div className="flex items-center justify-between px-6 py-2 border-b border-white/5 bg-surface">
        <h3 className="font-mono text-xs text-text-med uppercase tracking-widest">
          Timeline Sequence
        </h3>
        <span className="font-mono text-xs text-electric-teal animate-pulse">
          {frames.filter((f) => f.isProcessed).length} FRAMES PROCESSED
        </span>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-x-auto flex items-center px-6 gap-2 py-4 relative scrollbar-thin"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#3b6bff #060606',
        }}
      >
        {frames.map((frame) => {
          if (!frame.isProcessed) return null;

          return (
            <div
              key={frame.id}
              className="flex flex-col items-center gap-2 flex-shrink-0 group relative"
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
              >
                <img
                  src={frame.thumbnailUrl}
                  alt={`Frame ${frame.id}`}
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    frame.isAnomaly ? "blur-[4px] group-hover:blur-[1px]" : ""
                  }`}
                  loading="lazy"
                />

                {/* Anomaly Overlay */}
                {frame.isAnomaly && (
                  <div className="absolute inset-0 bg-hyper-red/10 group-hover:bg-hyper-red/5 transition-colors" />
                )}
              </div>

              {/* Metadata / Action */}
              <div className="h-8 flex items-center justify-center">
                {frame.isAnomaly ? (
                  <button
                    onClick={() => onSelectAnomaly(frame)}
                    className="
                      flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF2D55]/20 border border-[#FF2D55]
                      text-[#FF2D55] text-[10px] font-bold tracking-wider uppercase hover:bg-[#FF2D55] hover:text-white transition-all
                      scale-90 group-hover:scale-100 opacity-100
                    "
                  >
                    <Eye className="w-3 h-3" />
                    View Anomaly
                  </button>
                ) : (
                  <span className="text-[10px] font-mono text-text-med opacity-50">
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
