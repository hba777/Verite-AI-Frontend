import React, { useState, useEffect } from "react";
import { FrameData } from "@/types";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Download,
  Share2,
  FileDown,
} from "lucide-react";
import ForensicAnalysisSection from "./ForensicAnalysisSection";

interface ImageResultProps {
  frame: FrameData | null;
  detectionResult: any;
  taskId: string;
}

const ImageResult: React.FC<ImageResultProps> = ({
  frame,
  detectionResult,
  taskId,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showForensic, setShowForensic] = useState(true); // Auto-open for images
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const colors = {
    deepVoid: "#08090A",
    surface: "#121416",
    electricTeal: "#00E5FF",
    neuralGreen: "#00E676",
    hyperRed: "#FF2D55",
    warningOrange: "#FF9500",
    textHigh: "#F5F5F5",
    textMed: "#A0A0A0",
    borderWhite: "rgba(255,255,255,0.1)",
  };

  // Determine if image is real or fake based on detection result
  const isAnomaly =
    detectionResult?.is_anomaly === true ||
    detectionResult?.anomaly_count > 0 ||
    detectionResult?.is_fake === true;
  // Calculate confidence from real_prob (higher = more likely real/healthy)
  const confidenceScore =
    detectionResult?.confidence ??
    (detectionResult?.real_prob
      ? Math.round(detectionResult.real_prob * 100)
      : detectionResult?.fake_prob
        ? Math.round((1 - detectionResult.fake_prob) * 100)
        : 0);
  const anomalyType =
    detectionResult?.anomaly_type ||
    detectionResult?.predicted_class ||
    (isAnomaly ? "GenD Deepfake" : "Authentic");
  const processingStatus =
    detectionResult?.status || (isLoading ? "processing" : "complete");

  useEffect(() => {
    // Set loading to false when we receive detection results
    if (detectionResult) {
      setIsLoading(false);
    }
  }, [detectionResult]);

  const handleDownloadReport = async () => {
    setIsGeneratingReport(true);
    try {
      const isFk = detectionResult?.is_anomaly || detectionResult?.is_fake || false;
      const summary = isFk
        ? `GenD deepfake detection identified this image as synthetic with ${confidenceScore.toFixed(1)}% confidence. Fake probability: ${((detectionResult?.fake_prob ?? 0) * 100).toFixed(1)}%.`
        : `GenD deepfake detection classified this image as authentic with ${confidenceScore.toFixed(1)}% confidence. Real probability: ${((detectionResult?.real_prob ?? 1) * 100).toFixed(1)}%.`;

      // Strip data URI prefix if present
      const stripDataUri = (s?: string | null) =>
        s?.startsWith("data:") ? s.split(",")[1] : (s ?? null);

      const body = {
        case_id:           `CASE-${Date.now()}`,
        module_type:       "image",
        executive_summary: summary,
        image_data: {
          file_name:    "Image Analysis",
          is_fake:      isFk,
          confidence:   confidenceScore,
          fake_prob:    detectionResult?.fake_prob  ?? 0,
          real_prob:    detectionResult?.real_prob  ?? 1,
          anomaly_type: detectionResult?.anomaly_type ?? detectionResult?.predicted_class ?? null,
          thumbnail_b64: stripDataUri(frame?.thumbnailUrl),
          gradcam_b64:  stripDataUri(detectionResult?.gradcam_b64 ?? frame?.gradcam_b64),
          ela_b64:      stripDataUri(detectionResult?.ela_b64     ?? frame?.ela_b64),
          fft_data:     detectionResult?.fft_data  ?? frame?.fft_data  ?? null,
          lime_data:    detectionResult?.lime_data ?? frame?.lime_data ?? null,
        },
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/report/generate`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
      );

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Report generation failed (${response.status}): ${err}`);
      }

      const data = await response.json();
      if (!data.file_path) throw new Error("No file_path in response");

      const filename    = data.file_path.split(/[\\/]/).pop()!;
      const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL}/report/download/${filename}`;

      const dlRes = await fetch(downloadUrl);
      if (!dlRes.ok) throw new Error(`Download failed (${dlRes.status})`);

      const blob = await dlRes.blob();
      const url  = window.URL.createObjectURL(blob);
      const a    = Object.assign(document.createElement("a"), { href: url, download: filename });
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("[ImageReport] Error:", error);
      alert(`Failed to generate report: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const getStatusIcon = () => {
    if (isLoading) {
      return (
        <RefreshCw
          className="w-8 h-8 animate-spin"
          style={{ color: colors.electricTeal }}
        />
      );
    }
    if (isAnomaly) {
      return (
        <AlertTriangle className="w-8 h-8" style={{ color: colors.hyperRed }} />
      );
    }
    return (
      <CheckCircle className="w-8 h-8" style={{ color: colors.neuralGreen }} />
    );
  };

  const getStatusText = () => {
    if (detectionResult && !isLoading) {
      return isAnomaly ? "ANOMALY DETECTED" : "AUTHENTIC";
    }
    return "ANALYZING...";
  };

  const getStatusBg = () => {
    if (isLoading) return colors.surface;
    if (isAnomaly) return `${colors.hyperRed}20`;
    return `${colors.neuralGreen}20`;
  };

  return (
    <div
      className="bg-black min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8"
      style={{ backgroundColor: colors.deepVoid }}
    >
      {/* Header */}
      <div
        className="w-full max-w-[90vw] sm:max-w-[600px] lg:max-w-[800px] mb-6 sm:mb-8"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1
            className="text-xl sm:text-2xl lg:text-[2.25rem] font-bold text-text-high"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              color: colors.textHigh,
            }}
          >
            Image Analysis Result
          </h1>
        </div>
        {/* PDF Download Button */}
        <button
          onClick={handleDownloadReport}
          disabled={isGeneratingReport || isLoading}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            backgroundColor: `${colors.electricTeal}1A`,
            border: `1px solid ${colors.electricTeal}80`,
            borderRadius: "8px",
            color: colors.electricTeal,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "12px",
            cursor: isGeneratingReport || isLoading ? "not-allowed" : "pointer",
            opacity: isGeneratingReport || isLoading ? 0.5 : 1,
            transition: "all 0.2s",
          }}
        >
          <FileDown style={{ width: 16, height: 16 }} />
          {isGeneratingReport ? "Generating..." : "Download PDF"}
        </button>
      </div>

      {/* Main Result Card */}
      <div
        className="w-full max-w-[90vw] sm:max-w-[600px] lg:max-w-[800px] rounded-xl sm:rounded-2xl lg:rounded-[24px] overflow-hidden"
        style={{
          backgroundColor: colors.surface,
          border: `1px solid ${colors.borderWhite}`,
        }}
      >
        {/* Image Display */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16/9",
            backgroundColor: colors.deepVoid,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {frame?.thumbnailUrl ? (
            <img
              src={frame.thumbnailUrl}
              alt="Analyzed image"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: colors.textMed,
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  border: `2px solid ${colors.electricTeal}`,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <RefreshCw
                  className="w-8 h-8 animate-spin"
                  style={{ color: colors.electricTeal }}
                />
              </div>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "14px",
                }}
              >
                PROCESSING IMAGE...
              </span>
            </div>
          )}

          {/* Status Badge Overlay */}
          <div
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              backgroundColor: getStatusBg(),
              border: `1px solid ${isAnomaly ? colors.hyperRed : isLoading ? colors.borderWhite : colors.neuralGreen}`,
              borderRadius: "9999px",
            }}
          >
            {getStatusIcon()}
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "12px",
                fontWeight: 600,
                color: isAnomaly
                  ? colors.hyperRed
                  : isLoading
                    ? colors.textMed
                    : colors.neuralGreen,
                letterSpacing: "1px",
              }}
            >
              {getStatusText()}
            </span>
          </div>
        </div>

      </div>

      {/* Forensic Analysis Section */}
      {showForensic && frame && (
        <ForensicAnalysisSection
          frame={frame}
          onClose={() => setShowForensic(false)}
          taskId={taskId}
        />
      )}

      {/* Back Button */}
      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: "24px",
          padding: "12px 32px",
          backgroundColor: "transparent",
          color: colors.textMed,
          border: `1px solid ${colors.borderWhite}`,
          borderRadius: "8px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "12px",
          cursor: "pointer",
          textTransform: "uppercase",
          letterSpacing: "1px",
          transition: "all 0.3s ease",
        }}
      >
        Analyze Another Image
      </button>
    </div>
  );
};

export default ImageResult;
