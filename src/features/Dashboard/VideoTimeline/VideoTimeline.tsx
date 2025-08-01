import React, { useRef, useState, useEffect } from "react";
import { ProgressDemo } from "@/features/Dashboard/ProgressBar/ProgressBar";

interface VideoTimelineProps {
  videoUrl: string | null;
  onSeek?: (time: number) => void;
  currentTime?: number;
  uploadProgress?: number;
}

const VideoTimeline: React.FC<VideoTimelineProps> = ({ videoUrl, onSeek, currentTime, uploadProgress }) => {
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const [duration, setDuration] = useState(0);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [previewPosition, setPreviewPosition] = useState<number | null>(null);

  useEffect(() => {
    if (previewVideoRef.current && videoUrl) {
      previewVideoRef.current.load();
    }
  }, [videoUrl]);

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    setDuration(e.currentTarget.duration);
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;
    const newTime = percent * duration;
    if (onSeek) {
      onSeek(newTime);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const hoverX = e.clientX - rect.left;
    const percent = hoverX / rect.width;
    const newTime = percent * duration;
    setHoverTime(newTime);
    setPreviewPosition(hoverX);
  };

  const handleMouseLeave = () => {
    setHoverTime(null);
    setPreviewPosition(null);
  };

  useEffect(() => {
    if (
      hoverTime === null ||
      !previewVideoRef.current ||
      !previewCanvasRef.current
    ) return;

    const video = previewVideoRef.current;
    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext("2d");

    const handleSeeked = () => {
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
    };

    video.addEventListener("seeked", handleSeeked);
    video.currentTime = hoverTime;

    return () => {
      video.removeEventListener("seeked", handleSeeked);
    };
  }, [hoverTime]);

  return (
    <div className="w-full flex flex-col items-center mt-8">
      {videoUrl ? (
        <>
          <div
            className="relative w-full max-w-2xl h-20 rounded cursor-pointer border border-white/60  "
            onClick={handleTimelineClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ marginBottom: 24 }}
          >
            {/* Timeline container with preview background */}
            <div
              className="absolute top-1/2 left-3 right-3 h-15 bg-opacity-10 rounded overflow-hidden"
              style={{ transform: "translateY(-50%)" }}
            >
              {/* Preview canvas as background */}
              <canvas
                ref={previewCanvasRef}
                width={320}
                height={24}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  zIndex: 1,
                }}
              />

              {/* Progress bar */}
              <div
                className="h-full bg-white rounded"
                style={{
                  width: `${(currentTime || 0) / (duration || 1) * 100}%`,
                  opacity: 0.8,
                  zIndex: 2,
                  position: "relative",
                }}
              />

              {/* Progress thumb */}
              <div
                className="absolute top-1/2"
                style={{
                  left: `calc(${((currentTime || 0) / (duration || 1)) * 100}% - 8px)`,
                  width: 16,
                  height: 16,
                  background: "#fff",
                  borderRadius: "50%",
                  border: "2px solid #23272f",
                  boxShadow: "0 0 4px #fff",
                  transform: "translateY(-50%)",
                  transition: "left 0.1s",
                  zIndex: 3,
                }}
              />
            </div>

            {/* Hidden video for extracting preview frame */}
            <video
              ref={previewVideoRef}
              src={videoUrl || undefined}
              muted
              style={{ display: "none" }}
              onLoadedMetadata={handleLoadedMetadata}
            />
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-2xl flex justify-center items-center mt-2">
              <ProgressDemo uploadProgress={uploadProgress} />
          </div>
        </>
      ) : (
        <div className="text-white text-center opacity-60">No video loaded</div>
      )}
    </div>
  );
};

export default VideoTimeline;
