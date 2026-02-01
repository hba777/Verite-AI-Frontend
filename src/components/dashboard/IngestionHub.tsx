import React, { useState, useCallback } from "react";
import { Upload, Video, Image as ImageIcon, Mic } from "lucide-react";

interface IngestionHubProps {
  onFileSelect: (file: File) => void;
}

const IngestionHub: React.FC<IngestionHubProps> = ({ onFileSelect }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        onFileSelect(e.dataTransfer.files[0]);
      }
    },
    [onFileSelect]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        onFileSelect(e.target.files[0]);
      }
    },
    [onFileSelect]
  );

  const colors = {
    deepVoid: "#000000",
    surface: "#141414",
    electricTeal: "#00E5FF",
    textHigh: "#F5F5F5",
    textMed: "#A0A0A0",
    borderWhite: "rgba(255,255,255,0.1)",
  };

  return (
    <div
      className="bg-black flex flex-col items-center justify-center min-h-screen w-full relative overflow-hidden p-4 sm:p-6 lg:p-8"
      style={{
        backgroundColor: colors.deepVoid,
      }}
    >

      {/* Dropzone */}
      <div
        className="relative z-10 w-full max-w-[90vw] sm:max-w-[600px] lg:max-w-[800px] rounded-xl sm:rounded-2xl lg:rounded-[24px] border-2 transition-all duration-500 ease-out flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12"
        style={{
          borderStyle: "dashed",
          borderColor: isDragOver ? colors.electricTeal : colors.borderWhite,
          backgroundColor: isDragOver
            ? `${colors.electricTeal}0D`
            : colors.surface,
          transform: isDragOver ? "scale(1.02)" : "scale(1)",
          boxShadow: isDragOver ? `0 0 50px rgba(0,229,255,0.2)` : "none",
          minHeight: isDragOver ? "auto" : "400px",
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleInputChange}
          accept="video/*,image/*,audio/*"
        />

        <div className="mb-6 sm:mb-8 relative w-fit">
          <div
            className="absolute inset-0 rounded-full transition-opacity duration-300"
            style={{
              backgroundColor: colors.electricTeal,
              filter: "blur(20px)",
              opacity: isDragOver ? 0.5 : 0.2,
            }}
          />
          <Upload
            className={`w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 transition-colors duration-300 relative z-10 ${
              isDragOver ? "text-electric-teal" : "text-text-med"
            }`}
            style={{
              color: isDragOver ? colors.electricTeal : colors.textMed,
            }}
          />
        </div>

        <h1
          className="text-xl sm:text-2xl lg:text-[2.25rem] font-bold text-text-high mb-3 sm:mb-4 lg:mb-6 text-center"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700,
            letterSpacing: "-0.5px",
          }}
        >
          Initiate Forensic Analysis
        </h1>
        <p
          className="text-sm sm:text-base text-text-med mb-6 sm:mb-8 lg:mb-12 text-center max-w-[90%] sm:max-w-[384px]"
          style={{
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Drag & Drop source material or{" "}
          <label
            htmlFor="file-upload"
            className="text-blue-300 hover:text-blue-200 transition-colors cursor-pointer underline decoration-2"
          >
            browse files
          </label>
        </p>

        {/* File Type Options */}
        <div className="flex flex-wrap gap-3 sm:gap-4 lg:gap-6 justify-center w-full">
          {[
            { icon: Video, label: "Video" },
            { icon: ImageIcon, label: "Image" },
            { icon: Mic, label: "Audio" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center rounded-full py-2 px-4 sm:py-3 sm:px-6 lg:px-8 font-normal text-white transition-all duration-300 cursor-pointer min-w-[100px]"
              style={{
                backgroundImage:
                  "linear-gradient(#060606, #060606), linear-gradient(90deg, #3b6bff, #2e96ff 65%, #acb7ff)",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
                border: "2px solid transparent",
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
              <item.icon
                className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                style={{ color: "white" }}
              />
              <span
                className="text-xs sm:text-sm uppercase tracking-wide"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IngestionHub;
