import React from "react";
import { RefreshCw, Upload } from "lucide-react";

interface ImageLoaderProps {
  status?: string;
}

const ImageLoader: React.FC<ImageLoaderProps> = ({
  status = "Processing image...",
}) => {
  const colors = {
    deepVoid: "#08090A",
    surface: "#121416",
    electricTeal: "#00E5FF",
    textHigh: "#F5F5F5",
    textMed: "#A0A0A0",
    borderWhite: "rgba(255,255,255,0.1)",
  };

  return (
    <div
      className="bg-black min-h-screen w-full flex flex-col items-center justify-center p-4"
      style={{ backgroundColor: colors.deepVoid }}
    >
      {/* Main Card */}
      <div
        className="w-full max-w-[90vw] sm:max-w-[400px] rounded-2xl overflow-hidden"
        style={{
          backgroundColor: colors.surface,
          border: `1px solid ${colors.borderWhite}`,
          padding: "48px 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Animated Icon */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            border: `2px solid ${colors.electricTeal}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "24px",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "-4px",
              borderRadius: "50%",
              border: `2px solid transparent`,
              borderTopColor: colors.electricTeal,
              animation: "spin 1s linear infinite",
            }}
          />
          <RefreshCw
            className="w-10 h-10 animate-spin"
            style={{ color: colors.electricTeal }}
          />
        </div>

        {/* Status Text */}
        <h2
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "20px",
            fontWeight: 600,
            color: colors.textHigh,
            marginBottom: "8px",
            textAlign: "center",
          }}
        >
          Processing Image
        </h2>

        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "12px",
            color: colors.textMed,
            textAlign: "center",
          }}
        >
          {status}
        </p>

        {/* Progress Bar */}
        <div
          style={{
            width: "100%",
            height: "4px",
            backgroundColor: colors.deepVoid,
            borderRadius: "2px",
            marginTop: "24px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: "100%",
              background: `linear-gradient(to right, ${colors.electricTeal}, transparent)`,
              animation: "progress 2s ease-in-out infinite",
              borderRadius: "2px",
            }}
          />
        </div>

        {/* Upload Icon Hint */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "16px",
            color: colors.textMed,
          }}
        >
          <Upload className="w-4 h-4" />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
            }}
          >
            UPLOADING & ANALYZING
          </span>
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default ImageLoader;
