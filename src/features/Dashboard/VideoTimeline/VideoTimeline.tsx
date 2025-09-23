import React, { useRef, useState, useEffect } from "react";
import { ProgressDemo } from "@/features/Dashboard/ProgressBar/ProgressBar";

interface VideoTimelineProps {
  videoUrl: string | null;
  onSeek?: (time: number) => void;
  currentTime?: number;
  uploadProgress?: number;
  frames?: Array<{frameIndex: number, frameData: string, timestamp: number}>;
  onFrameClick?: (frame: {frameIndex: number, frameData: string, timestamp: number}) => void;
}

const VideoTimeline: React.FC<VideoTimelineProps> = ({ videoUrl, onSeek, currentTime, uploadProgress, frames, onFrameClick }) => {
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const [duration, setDuration] = useState(0);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [previewPosition, setPreviewPosition] = useState<number | null>(null);
  const [selectedFrameIndex, setSelectedFrameIndex] = useState<number | null>(null);

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
    
    // Clear frame selection when clicking on timeline
    setSelectedFrameIndex(null);
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

  const handleFrameClick = (frame: {frameIndex: number, frameData: string, timestamp: number}) => {
    // Set the selected frame index for visual highlighting
    setSelectedFrameIndex(frame.frameIndex);
    
    // Jump to the timestamp in the video
    if (onSeek) {
      console.log(`Seeking to timestamp: ${frame.timestamp}s`);
      onSeek(frame.timestamp);
    }
    
    // Notify parent component about frame selection
    if (onFrameClick) {
      onFrameClick(frame);
    }
    
    // Add a brief visual feedback
    setTimeout(() => {
      // This ensures the timeline progress bar updates smoothly
    }, 50);
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
                className="h-full bg-white rounded transition-all duration-200 ease-out"
                style={{
                  width: `${(currentTime || 0) / (duration || 1) * 100}%`,
                  opacity: 0.8,
                  zIndex: 2,
                  position: "relative",
                }}
              />

              {/* Progress thumb */}
              <div
                className="absolute top-1/2 transition-all duration-200 ease-out"
                style={{
                  left: `calc(${((currentTime || 0) / (duration || 1)) * 100}% - 8px)`,
                  width: 16,
                  height: 16,
                  background: "#fff",
                  borderRadius: "50%",
                  border: "2px solid #23272f",
                  boxShadow: "0 0 4px #fff",
                  transform: "translateY(-50%)",
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

          {/* Frame Indicators */}
          {frames && frames.length > 0 && (
            <div className="w-full max-w-4xl mb-6">
              <div className="text-white text-sm mb-4 text-center opacity-80 font-medium">
                🎬 Click on any frame to jump to that timestamp
                {currentTime && duration && (
                  <span className="block text-xs opacity-60 mt-1">
                    Current time: {currentTime.toFixed(1)}s / {duration.toFixed(1)}s
                    {selectedFrameIndex !== null && (
                      <span className="ml-2 text-blue-400">
                        • Frame {selectedFrameIndex + 1} selected
                      </span>
                    )}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                {frames.map((frame, index) => (
                  <div
                    key={frame.frameIndex}
                    className={`group cursor-pointer transition-all duration-300 hover:scale-110 transform ${
                      selectedFrameIndex === frame.frameIndex 
                        ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-[#181a20]' 
                        : ''
                    }`}
                    onClick={() => handleFrameClick(frame)}
                    style={{
                      animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                    }}
                  >
                    <div className={`relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ${
                      selectedFrameIndex === frame.frameIndex 
                        ? 'shadow-blue-400/50' 
                        : ''
                    }`}>
                      <img
                        src={`data:image/jpeg;base64,${frame.frameData}`}
                        alt={`Frame ${frame.frameIndex}`}
                        className="w-20 h-16 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent py-2 px-3">
                        <div className="text-white text-xs font-medium text-center">
                          {frame.timestamp.toFixed(1)}s
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {frame.frameIndex + 1}
                      </div>
                      
                      {/* Processing indicator */}
                      {selectedFrameIndex === frame.frameIndex ? (
                        <div className="absolute top-2 left-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                      ) : (
                        <div className="absolute top-2 left-2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Animation styles */}
              <style jsx>{`
                @keyframes fadeInUp {
                  from {
                    opacity: 0;
                    transform: translateY(20px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
              `}</style>
            </div>
          )}

          {/* Loading state for frames */}
          {!frames || frames.length === 0 ? (
            <div className="w-full max-w-4xl mb-6 text-center">
              <div className="text-white text-sm opacity-60 mb-4">
                🎥 Frames will appear here as they're processed...
              </div>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            </div>
          ) : null}

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
