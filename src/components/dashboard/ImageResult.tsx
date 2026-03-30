import React, { useState, useEffect } from "react";
import { FrameData } from "@/types";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Download,
  Share2,
} from "lucide-react";

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
          <p
            className="text-sm sm:text-base text-text-med mt-1"
            style={{
              fontFamily: "'Inter', sans-serif",
              color: colors.textMed,
            }}
          >
            Task ID: {taskId}
          </p>
        </div>
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

        {/* Analysis Details */}
        <div style={{ padding: "24px" }}>
          {/* Confidence Score */}
          <div
            style={{
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "12px",
                  color: colors.textMed,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Confidence Score
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: colors.textHigh,
                }}
              >
                {confidenceScore.toFixed(1)}%
              </span>
            </div>
            <div
              style={{
                height: "8px",
                backgroundColor: colors.deepVoid,
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${confidenceScore}%`,
                  background: isAnomaly
                    ? `linear-gradient(to right, ${colors.hyperRed}, ${colors.warningOrange})`
                    : `linear-gradient(to right, ${colors.neuralGreen}, ${colors.electricTeal})`,
                  borderRadius: "4px",
                  transition: "width 0.5s ease-out",
                }}
              />
            </div>
          </div>

          {/* Detection Details Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
            }}
          >
            {/* Anomaly Type */}
            <div
              style={{
                padding: "16px",
                backgroundColor: colors.deepVoid,
                borderRadius: "12px",
                border: `1px solid ${colors.borderWhite}`,
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px",
                  color: colors.textMed,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Detection Type
              </span>
              <span
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: isAnomaly ? colors.hyperRed : colors.neuralGreen,
                }}
              >
                {anomalyType}
              </span>
            </div>

            {/* Processing Status */}
            <div
              style={{
                padding: "16px",
                backgroundColor: colors.deepVoid,
                borderRadius: "12px",
                border: `1px solid ${colors.borderWhite}`,
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px",
                  color: colors.textMed,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Status
              </span>
              <span
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: colors.textHigh,
                }}
              >
                {processingStatus}
              </span>
            </div>

            {/* ELA Score */}
            {detectionResult?.ela_score !== undefined && (
              <div
                style={{
                  padding: "16px",
                  backgroundColor: colors.deepVoid,
                  borderRadius: "12px",
                  border: `1px solid ${colors.borderWhite}`,
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "10px",
                    color: colors.textMed,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  ELA Score
                </span>
                <span
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "16px",
                    fontWeight: 600,
                    color: colors.textHigh,
                  }}
                >
                  {detectionResult.ela_score.toFixed(3)}
                </span>
              </div>
            )}

            {/* Frequency Spike */}
            {detectionResult?.frequency_spike !== undefined && (
              <div
                style={{
                  padding: "16px",
                  backgroundColor: colors.deepVoid,
                  borderRadius: "12px",
                  border: `1px solid ${colors.borderWhite}`,
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "10px",
                    color: colors.textMed,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  Frequency Spike
                </span>
                <span
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "16px",
                    fontWeight: 600,
                    color: colors.textHigh,
                  }}
                >
                  {detectionResult.frequency_spike}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "24px",
              flexWrap: "wrap",
            }}
          >
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                backgroundColor: colors.electricTeal,
                color: colors.deepVoid,
                border: "none",
                borderRadius: "8px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              <Download className="w-4 h-4" />
              Download Report
            </button>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                backgroundColor: "transparent",
                color: colors.textHigh,
                border: `1px solid ${colors.borderWhite}`,
                borderRadius: "8px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              <Share2 className="w-4 h-4" />
              Share Results
            </button>
          </div>
        </div>
      </div>

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
