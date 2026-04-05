import React, { useState } from "react";
import { FrameData, HeatmapConfig } from "@/types";

interface HeatmapViewerProps {
  frame: FrameData;
  config: HeatmapConfig;
  viewMode?: "ela" | "gradcam";
}

const HeatmapViewer: React.FC<HeatmapViewerProps> = ({ frame, config, viewMode = "gradcam" }) => {
  const [elaLoading, setElaLoading] = useState(true);
  const [gradcamLoading, setGradcamLoading] = useState(true);

  // Build the Grad-CAM image URL if available
  // Only show Grad-CAM for frames that are anomalies
  const gradcamUrl =
    frame.gradcam_b64 && frame.isAnomaly
      ? `data:image/jpeg;base64,${frame.gradcam_b64}`
      : null;

  // Build the ELA image URL if available
  const elaUrl =
    frame.ela_b64 && frame.isAnomaly
      ? `data:image/jpeg;base64,${frame.ela_b64}`
      : null;

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-white/10 group">
      {/* For full ELA/GradCAM view, show black background */}
      {!elaUrl && !gradcamUrl && (
        <div className="w-full h-full flex items-center justify-center bg-deep-void">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-electric-teal/30 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono text-text-med">
              Loading {viewMode}...
            </span>
          </div>
        </div>
      )}

      {/* ELA Full Image View */}
      {elaUrl && viewMode === "ela" && (
        <div className="absolute inset-0">
          {elaLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-2 border-electric-teal border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-mono text-electric-teal">Loading ELA...</span>
              </div>
            </div>
          )}
          <img
            src={elaUrl}
            alt="ELA Error Level Analysis"
            className="w-full h-full object-contain"
            onLoad={() => setElaLoading(false)}
            onError={() => setElaLoading(false)}
          />
        </div>
      )}

      {/* GradCAM Full Image View */}
      {gradcamUrl && viewMode === "gradcam" && (
        <div className="absolute inset-0">
          {gradcamLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-2 border-electric-teal border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-mono text-electric-teal">Loading GradCAM...</span>
              </div>
            </div>
          )}
          <img
            src={gradcamUrl!}
            alt="Grad-CAM Attribution"
            className="w-full h-full object-contain "
            onLoad={() => setGradcamLoading(false)}
            onError={() => setGradcamLoading(false)}
          />
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
