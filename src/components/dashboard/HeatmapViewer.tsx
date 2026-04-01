import React, { useState } from "react";
import { FrameData, HeatmapConfig } from "@/types";

interface HeatmapViewerProps {
  frame: FrameData;
  config: HeatmapConfig;
}

const HeatmapViewer: React.FC<HeatmapViewerProps> = ({ frame, config }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Build the Grad-CAM image URL if available
  const gradcamUrl = frame.gradcam_b64
    ? `data:image/jpeg;base64,${frame.gradcam_b64}`
    : null;

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-white/10 group">
      {/* Base Image */}
      <img
        src={frame.thumbnailUrl}
        alt={`Frame ${frame.id}`}
        className="w-full h-full object-cover"
      />

      {/* Grad-CAM Heatmap Overlay */}
      {gradcamUrl && config.show && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{ opacity: config.opacity / 100 }}
        >
          <img
            src={gradcamUrl}
            alt="Grad-CAM Heatmap"
            className="w-full h-full object-cover"
            style={{ mixBlendMode: "overlay" }}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setError(true);
              setIsLoading(false);
            }}
          />
        </div>
      )}

      {/* Loading state when Grad-CAM is being generated */}
      {gradcamUrl && isLoading && config.show && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-electric-teal border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono text-electric-teal">
              Generating Heatmap...
            </span>
          </div>
        </div>
      )}

      {/* Fallback simulated heatmap if no Grad-CAM available */}
      {!gradcamUrl && config.show && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: config.opacity / 100,
            background: `
              radial-gradient(circle at 45% 40%, rgba(255, 45, 85, 0.8) 0%, rgba(255, 255, 0, 0.4) 30%, transparent 60%),
              radial-gradient(circle at 55% 40%, rgba(255, 45, 85, 0.8) 0%, rgba(255, 255, 0, 0.4) 30%, transparent 60%),
              radial-gradient(circle at 50% 70%, rgba(255, 45, 85, 0.9) 0%, rgba(255, 255, 0, 0.5) 40%, transparent 70%)
            `,
            mixBlendMode: "hard-light",
          }}
        />
      )}

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
