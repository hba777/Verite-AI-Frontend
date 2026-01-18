import React from "react";
import { FrameData, HeatmapConfig } from "@/types";

interface HeatmapViewerProps {
  frame: FrameData;
  config: HeatmapConfig;
}

const HeatmapViewer: React.FC<HeatmapViewerProps> = ({ frame, config }) => {
  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-white/10 group">
      {/* Base Image */}
      <img
        src={frame.thumbnailUrl}
        alt={`Frame ${frame.id}`}
        className="w-full h-full object-cover"
      />

      {/* Heatmap Overlay */}
      {/* 
        In a real app, this would be a canvas or an image layer returned by the backend.
        Here we simulate it with CSS radial gradients positioned over "suspicious" areas (mouth/eyes).
      */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: config.show ? config.opacity / 100 : 0,
          background: `
            radial-gradient(circle at 45% 40%, rgba(255, 45, 85, 0.8) 0%, rgba(255, 255, 0, 0.4) 30%, transparent 60%),
            radial-gradient(circle at 55% 40%, rgba(255, 45, 85, 0.8) 0%, rgba(255, 255, 0, 0.4) 30%, transparent 60%),
            radial-gradient(circle at 50% 70%, rgba(255, 45, 85, 0.9) 0%, rgba(255, 255, 0, 0.5) 40%, transparent 70%)
          `,
          mixBlendMode: "hard-light",
        }}
      />

      {/* Scanline Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20"></div>

      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded border border-white/10">
        <span className="text-xs font-mono text-electric-teal">
          SOURCE: {frame.timestamp}
        </span>
      </div>
    </div>
  );
};

export default HeatmapViewer;
