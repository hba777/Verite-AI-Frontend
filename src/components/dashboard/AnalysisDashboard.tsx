import React, { useEffect, useState, useRef } from "react";
import Timeline from "./Timeline";
import ForensicAnalysisSection from "./ForensicAnalysisSection";
import { FrameData, AppState, AnalysisDashboardProps } from "@/types";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
  appState,
  frames,
  uploadProgress = 0,
  status = "Idle",
  isProcessing = false,
  processedFrames = 0,
  videoUrl,
  taskId,
}) => {
  const [progress, setProgress] = useState(0);
  const [selectedFrame, setSelectedFrame] = useState<FrameData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const analysisRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Update progress from upload or processing
  useEffect(() => {
    if (uploadProgress > 0 && uploadProgress < 100) {
      setProgress(uploadProgress);
    } else if (isProcessing && frames.length > 0) {
      // Calculate processing progress
      const processedCount = frames.filter((f) => f.isProcessed).length;
      const processingProgress = (processedCount / frames.length) * 100;
      setProgress(processingProgress);
    } else if (appState === AppState.COMPLETE) {
      setProgress(100);
    }
  }, [uploadProgress, isProcessing, frames.length, appState]);

  // Scroll to analysis when frame selected
  useEffect(() => {
    if (selectedFrame && analysisRef.current) {
      setTimeout(() => {
        analysisRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [selectedFrame]);

  // Video time update
  useEffect(() => {
    if (videoRef.current && videoUrl) {
      const video = videoRef.current;

      const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime);
      };

      const handleLoadedMetadata = () => {
        setDuration(video.duration);
      };

      const handleEnded = () => {
        setIsPlaying(false);
      };

      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("ended", handleEnded);

      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("ended", handleEnded);
      };
    }
  }, [videoUrl]);

  const handleSelectAnomaly = (frame: FrameData) => {
    setSelectedFrame(frame);
    setIsPlaying(false);

    // Jump to frame timestamp if video is available
    if (videoUrl && videoRef.current) {
      // Use timestamp_seconds if available, otherwise parse the timestamp string
      const seekTime =
        frame.timestamp_seconds !== undefined
          ? frame.timestamp_seconds
          : parseTimestampToSeconds(frame.timestamp);
      videoRef.current.currentTime = seekTime;
    }
  };

  // Helper to parse timestamp string to seconds
  const parseTimestampToSeconds = (timestamp: string): number => {
    const parts = timestamp.split(":");
    if (parts.length === 3) {
      return (
        parseInt(parts[0]) * 3600 +
        parseInt(parts[1]) * 60 +
        parseFloat(parts[2])
      );
    }
    return 0;
  };

  const togglePlay = () => {
    if (videoRef.current && videoUrl) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        videoRef.current.currentTime - 5,
      );
    }
  };

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        duration,
        videoRef.current.currentTime + 5,
      );
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const processedCount = frames.filter((f) => f.isProcessed).length;
  const anomalyCount = frames.filter(
    (f) => f.isProcessed && f.isAnomaly,
  ).length;

  // Theme colors from HTML
  const colors = {
    deepVoid: "#08090A",
    surface: "#121416",
    electricTeal: "#00E5FF",
    neuralGreen: "#00E676",
    hyperRed: "#FF2D55",
    textHigh: "#F5F5F5",
    textMed: "#A0A0A0",
    borderWhite: "rgba(255,255,255,0.1)",
  };

  return (
    <div
      className="bg-black"
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Top Progress Bar "The Pulse" (Sticky) */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          width: "100%",
          backgroundColor: colors.deepVoid,
        }}
      >
        <div
          style={{
            height: "4px",
            width: "100%",
            backgroundColor: colors.surface,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: `linear-gradient(to right, ${colors.electricTeal}, #3B82F6)`,
              transition: "width 0.1s linear",
              boxShadow: `0 0 10px ${colors.electricTeal}80`,
            }}
          />
        </div>

        {/* Status Pill */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(18,20,22,0.8)",
              backdropFilter: "blur(8px)",
              border: `1px solid ${colors.borderWhite}`,
              borderRadius: "9999px",
              padding: "4px 16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: isProcessing
                  ? colors.electricTeal
                  : appState === AppState.COMPLETE
                    ? colors.neuralGreen
                    : colors.textMed,
                animation: isProcessing ? "pulse 1s infinite" : "none",
              }}
            ></div>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "12px",
                fontWeight: 500,
                color: colors.textHigh,
                letterSpacing: "1px",
              }}
            >
              {uploadProgress > 0 && uploadProgress < 100
                ? `UPLOADING ${Math.floor(uploadProgress)}%`
                : progress < 100
                  ? `ANALYZING FRAMES ${processedFrames}/${frames.length || "?"}`
                  : "ANALYSIS COMPLETE"}
            </span>
          </div>
        </div>

        {/* Status Message */}
        {status && status !== "Idle" && (
          <div
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                color: colors.textMed,
              }}
            >
              {status}
            </span>
          </div>
        )}
      </div>

      {/* Main Workspace */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top Section: Video Player */}
        <div
          style={{
            height: "60vh",
            width: "100%",
            position: "relative",
            backgroundColor: "black",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: `1px solid ${colors.borderWhite}`,
          }}
          onMouseEnter={() => {
            setControlsVisible(true);
            if (controlsTimeoutRef.current) {
              clearTimeout(controlsTimeoutRef.current);
            }
          }}
          onMouseLeave={() => {
            if (controlsTimeoutRef.current) {
              clearTimeout(controlsTimeoutRef.current);
            }
            controlsTimeoutRef.current = setTimeout(() => {
              setControlsVisible(false);
            }, 500);
          }}
        >
          {/* Grid Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              pointerEvents: "none",
              zIndex: 1,
            }}
          ></div>

          {/* Video Player */}
          {videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              style={{
                height: "100%",
                width: "100%",
                objectFit: "contain",
              }}
              onClick={togglePlay}
            />
          ) : selectedFrame ? (
            selectedFrame.thumbnailUrl ? (
              <img
                src={selectedFrame.thumbnailUrl}
                alt="Main view"
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "contain",
                  padding: "32px",
                }}
              />
            ) : (
              <div
                style={{
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: colors.deepVoid,
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 border-2 border-electric-teal/30 border-t-transparent rounded-full animate-spin" />
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "12px",
                      color: colors.textMed,
                    }}
                  >
                    Loading frame...
                  </span>
                </div>
              </div>
            )
          ) : frames.length > 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: "rgba(245,245,245,0.2)",
              }}
            >
              <div
                style={{
                  width: "96px",
                  height: "96px",
                  border: "2px solid currentColor",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <Play
                  style={{
                    width: "40px",
                    height: "40px",
                    fill: "currentColor",
                    marginLeft: "4px",
                  }}
                />
              </div>
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "14px",
                }}
              >
                SELECT A FRAME TO INSPECT
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: "rgba(245,245,245,0.2)",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  border: `2px solid ${colors.electricTeal}`,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                  animation: "pulse 2s infinite",
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: colors.electricTeal,
                  }}
                />
              </div>
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "14px",
                  color: colors.electricTeal,
                }}
              >
                {status || "PROCESSING..."}
              </p>
            </div>
          )}

          {/* Player Controls */}
          <div
            style={{
              position: "absolute",
              bottom: "32px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              backgroundColor: "rgba(18,20,22,0.9)",
              backdropFilter: "blur(8px)",
              border: `1px solid ${colors.borderWhite}`,
              padding: "16px 32px",
              borderRadius: "24px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              zIndex: 10,
              opacity: controlsVisible ? 1 : 0,
              transition: "opacity 0.3s ease-in-out",
              pointerEvents: controlsVisible ? "auto" : "none",
            }}
          >
            {/* Progress Bar */}
            <div
              style={{
                width: "100%",
                height: "4px",
                backgroundColor: colors.surface,
                borderRadius: "2px",
                cursor: "pointer",
              }}
              onClick={(e) => {
                if (videoRef.current && duration > 0) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const percent = (e.clientX - rect.left) / rect.width;
                  videoRef.current.currentTime = percent * duration;
                }
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                  backgroundColor: colors.electricTeal,
                  borderRadius: "2px",
                  transition: "width 0.1s linear",
                }}
              />
            </div>

            {/* Controls Row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "24px",
              }}
            >
              <SkipBack
                style={{
                  width: "20px",
                  height: "20px",
                  color: colors.textMed,
                  cursor: "pointer",
                }}
                onClick={skipBackward}
              />
              <button
                onClick={togglePlay}
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: colors.electricTeal,
                  color: colors.deepVoid,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background-color 0.2s",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                {isPlaying ? (
                  <Pause style={{ fill: "currentColor" }} />
                ) : (
                  <Play style={{ fill: "currentColor", marginLeft: "4px" }} />
                )}
              </button>
              <SkipForward
                style={{
                  width: "20px",
                  height: "20px",
                  color: colors.textMed,
                  cursor: "pointer",
                }}
                onClick={skipForward}
              />
            </div>

            {/* Time Display */}
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "12px",
                color: colors.textMed,
              }}
            >
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {/* Stats Overlay */}
          {frames.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "32px",
                left: "32px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "12px",
                color: colors.textMed,
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                zIndex: 10,
              }}
            >
              <div
                style={{
                  backgroundColor: "rgba(0,0,0,0.5)",
                  padding: "4px 8px",
                  borderRadius: "4px",
                }}
              >
                PROCESSED: {processedCount} / {frames.length}
              </div>
              <div
                style={{
                  backgroundColor: "rgba(0,0,0,0.5)",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  color: colors.hyperRed,
                }}
              >
                ANOMALIES: {anomalyCount}
              </div>
            </div>
          )}

          {/* Selected Frame Info */}
          {selectedFrame && (
            <div
              style={{
                position: "absolute",
                top: "32px",
                right: "32px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "12px",
                color: colors.textHigh,
                backgroundColor: "rgba(0,0,0,0.5)",
                padding: "8px 12px",
                borderRadius: "4px",
                zIndex: 10,
              }}
            >
              <div>FRAME: {selectedFrame.id}</div>
              <div>TIME: {selectedFrame.timestamp}</div>
              {selectedFrame.isAnomaly && (
                <div style={{ color: colors.hyperRed, marginTop: "4px" }}>
                  ANOMALY: {selectedFrame.anomalyType}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Timeline */}
        {frames.length > 0 && (
          <div
            style={{
              height: "192px",
              backgroundColor: colors.surface,
              borderTop: `1px solid ${colors.borderWhite}`,
              position: "relative",
              zIndex: 20,
              flexShrink: 0,
            }}
          >
            <Timeline frames={frames} onSelectAnomaly={handleSelectAnomaly} />
          </div>
        )}
      </div>

      {/* Expanded Analysis Section */}
      {selectedFrame && (
        <div ref={analysisRef} style={{ width: "100%" }}>
          <ForensicAnalysisSection
            frame={selectedFrame}
            onClose={() => setSelectedFrame(null)}
            taskId={taskId}
          />
        </div>
      )}
    </div>
  );
};

export default AnalysisDashboard;
