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
    deepVoid: "#08090A",
    surface: "#121416",
    electricTeal: "#00E5FF",
    textHigh: "#F5F5F5",
    textMed: "#A0A0A0",
    borderWhite: "rgba(255,255,255,0.1)",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100%",
        backgroundColor: colors.deepVoid,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Ambient Glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "800px",
          height: "800px",
          borderRadius: "50%",
          backgroundColor: `${colors.electricTeal}0D`, // /5 opacity ≈ 0.05
          filter: "blur(120px)",
          pointerEvents: "none",
        }}
      />

      {/* Dropzone */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "800px",
          height: "500px",
          borderRadius: "24px",
          border: `2px dashed ${
            isDragOver ? colors.electricTeal : colors.borderWhite
          }`,
          backgroundColor: isDragOver
            ? `${colors.electricTeal}0D`
            : colors.surface,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.5s ease-out",
          transform: isDragOver ? "scale(1.05)" : "scale(1)",
          boxShadow: isDragOver ? `0 0 50px rgba(0,229,255,0.2)` : "none",
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          style={{ display: "none" }}
          onChange={handleInputChange}
          accept="video/*,image/*,audio/*"
        />

        <div
          style={{
            marginBottom: "32px",
            position: "relative",
            width: "fit-content",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: colors.electricTeal,
              filter: "blur(20px)",
              opacity: isDragOver ? 0.5 : 0.2,
              borderRadius: "50%",
              transition: "opacity 0.3s",
            }}
          />
          <Upload
            style={{
              width: "80px",
              height: "80px",
              color: isDragOver ? colors.electricTeal : colors.textMed,
              transition: "color 0.3s",
              position: "relative",
              zIndex: 10,
            }}
          />
        </div>

        <h1
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "2.25rem",
            fontWeight: 700,
            color: colors.textHigh,
            marginBottom: "16px",
            letterSpacing: "-0.5px",
            textAlign: "center",
          }}
        >
          Initiate Forensic Analysis
        </h1>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "1.125rem",
            color: colors.textMed,
            marginBottom: "48px",
            maxWidth: "384px",
            textAlign: "center",
          }}
        >
          Drag & Drop source material or{" "}
          <label
            htmlFor="file-upload"
            style={{
              color: colors.electricTeal,
              cursor: "pointer",
              textDecoration: "underline",
              textDecorationThickness: "2px",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = colors.electricTeal)
            }
          >
            browse files
          </label>
        </p>

        {/* File Type Options */}
        <div style={{ display: "flex", gap: "24px" }}>
          {[
            { icon: Video, label: "Video" },
            { icon: ImageIcon, label: "Image" },
            { icon: Mic, label: "Audio" },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 24px",
                borderRadius: "16px",
                backgroundColor: "rgba(255,255,255,0.05)",
                border: `1px solid ${colors.borderWhite}`,
                backdropFilter: "blur(8px)",
              }}
            >
              <item.icon
                style={{ width: "20px", height: "20px", color: colors.textMed }}
              />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.875rem",
                  color: colors.textMed,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
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
