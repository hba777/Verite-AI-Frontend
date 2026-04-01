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
  // Only show Grad-CAM for frames that are anomalies
  const gradcamUrl =
    frame.gradcam_b64 && frame.isAnomaly
      ? `data:image/jpeg;base64,${frame.gradcam_b64}`
      : null;

  // Show loading when Grad-CAM data hasn't arrived yet but frame is an anomaly
  const showLoading = frame.isAnomaly && !gradcamUrl && config.show;

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-white/10 group">
      {/* Base Image - show placeholder if no thumbnail */}
      {frame.thumbnailUrl ? (
        <img
          src={frame.thumbnailUrl}
          alt={`Frame ${frame.id}`}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-deep-void">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-electric-teal/30 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono text-text-med">
              Loading frame...
            </span>
          </div>
        </div>
      )}

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
      {showLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-electric-teal border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono text-electric-teal">
              Generating Heatmap...
            </span>
          </div>
        </div>
      )}

      {/* Show a waiting message for anomaly frames without Grad-CAM yet */}
      {frame.isAnomaly && !gradcamUrl && config.show && !showLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <span className="text-xs font-mono text-text-med">
            Heatmap generating...
          </span>
        </div>
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
