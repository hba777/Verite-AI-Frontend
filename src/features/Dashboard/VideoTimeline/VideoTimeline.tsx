import React, { useRef, useState, useEffect, useMemo } from "react";
import { ProgressDemo } from "@/features/Dashboard/ProgressBar/ProgressBar";
import DeepFakeSummary from "@/features/Dashboard/DeepFakeSummary/DeepFakeSummary";

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
  const timelineScrollRef = useRef<HTMLDivElement>(null);
  const framesScrollRef = useRef<HTMLDivElement>(null);
  const framesContentRef = useRef<HTMLDivElement>(null);

  const [duration, setDuration] = useState(0);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [previewPosition, setPreviewPosition] = useState<number | null>(null);
  const [selectedFrameIndex, setSelectedFrameIndex] = useState<number | null>(null);

  // Responsive dimensions for the scrollable filmstrip content
  const [thumbWidth, setThumbWidth] = useState(80);
  const [thumbHeight, setThumbHeight] = useState(48);
  const [thumbGap, setThumbGap] = useState(8);
  const [framesOverflow, setFramesOverflow] = useState(false);

  // Update thumbnail sizes based on viewport width
  useEffect(() => {
    const updateSizes = () => {
      const w = window.innerWidth;
      if (w < 480) {
        setThumbWidth(56);
        setThumbHeight(36);
        setThumbGap(6);
      } else if (w < 768) {
        setThumbWidth(64);
        setThumbHeight(40);
        setThumbGap(6);
      } else if (w < 1280) {
        setThumbWidth(80);
        setThumbHeight(48);
        setThumbGap(8);
      } else {
        setThumbWidth(96);
        setThumbHeight(56);
        setThumbGap(10);
      }
    };
    updateSizes();
    window.addEventListener("resize", updateSizes);
    return () => window.removeEventListener("resize", updateSizes);
  }, []);

  // Provide dummy frames when none are passed so the UI can be tested
  const dummyFrames = useMemo(() => {
    const placeholders = [
      "/CarouselTest.png",
      "/Peak.png",
      "/Google.png",
      "/gemini-bg.png",
      "/performance-bg.png",
      "/Safety-bg.png",
    ];
    const count = 24; // increased for overflow testing
    return Array.from({ length: count }).map((_, i) => {
      const timestamp = duration ? (i / count) * Math.max(duration, 1) : i * 1.0;
      return {
        frameIndex: i,
        frameData: "", // not used for dummy URLs below
        timestamp,
        // Attach a helper url for rendering when frameData is empty
        // @ts-ignore - augmenting for internal rendering only
        _url: placeholders[i % placeholders.length],
      };
    });
  }, [duration]);

  // Use provided frames if available, else dummy
  const timelineFrames = useMemo(() => (frames && frames.length ? frames : dummyFrames), [frames, dummyFrames]);
  const retrievedFrames = useMemo(() => (frames && frames.length ? frames.slice(0, Math.min(24, frames.length)) : dummyFrames.slice(0, 24)), [frames, dummyFrames]);

  // Now that timelineFrames/dummyFrames exist, compute overflow robustly
  useEffect(() => {
    const computeOverflow = () => {
      const container = framesScrollRef.current;
      if (!container) return;
      // Compare actual scroll width vs client width to decide overflow
      const isOverflowing = container.scrollWidth > container.clientWidth;
      setFramesOverflow(isOverflowing);
    };

    // Run after layout paint to ensure measurements are correct
    const raf = requestAnimationFrame(computeOverflow);

    // Observe size changes on container and content
    const ro = new ResizeObserver(() => computeOverflow());
    if (framesScrollRef.current) ro.observe(framesScrollRef.current);
    if (framesContentRef.current) ro.observe(framesContentRef.current);

    window.addEventListener("resize", computeOverflow);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", computeOverflow);
    };
  }, [timelineFrames.length, thumbWidth, thumbGap, videoUrl]);


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

    // Smooth scroll to summary section
    const el = document.getElementById("deepfake-summary");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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

  // Keep the two strips horizontally scroll-synced
  useEffect(() => {
    const a = timelineScrollRef.current;
    const b = framesScrollRef.current;
    if (!a || !b) return;

    let syncing = false;
    const onScrollA = () => {
      if (syncing) return;
      syncing = true;
      b.scrollLeft = a.scrollLeft;
      syncing = false;
    };
    const onScrollB = () => {
      if (syncing) return;
      syncing = true;
      a.scrollLeft = b.scrollLeft;
      syncing = false;
    };
    a.addEventListener("scroll", onScrollA);
    b.addEventListener("scroll", onScrollB);
    return () => {
      a.removeEventListener("scroll", onScrollA);
      b.removeEventListener("scroll", onScrollB);
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center mt-8">
      {videoUrl ? (
        <>
          {/* Scrollable timeline filmstrip (fixed outer width) */}
          <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
            <div
              ref={timelineScrollRef}
              className="relative rounded border border-white/40 overflow-x-auto overflow-y-hidden cursor-pointer hide-scrollbar"
              onClick={handleTimelineClick}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ height: Math.max(thumbHeight + 24, 64) }}
            >
              <div
                className="relative flex items-center"
                style={{ width: timelineFrames.length * (thumbWidth + thumbGap) + 24 }}
              >
                <div className="flex items-center gap-2 px-3 py-2">
                  {timelineFrames.map((f) => (
                    <img
                      key={`strip-${f.frameIndex}`}
                      src={(f as any)._url ? (f as any)._url : `data:image/jpeg;base64,${f.frameData}`}
                      alt={`t-${f.frameIndex}`}
                      style={{ width: thumbWidth, height: thumbHeight, objectFit: "cover", borderRadius: 6, marginRight: thumbGap - 2 }}
                    />
                  ))}
                </div>

                {/* Progress overlay */}
                <div
                  className="absolute left-0 top-0 bottom-0 bg-white/20"
                  style={{ width: `${((currentTime || 0) / (duration || 1)) * 100}%`, pointerEvents: "none", zIndex: 2 }}
                />
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
                    zIndex: 3,
                    pointerEvents: "none",
                  }}
                />
              </div>

              {/* Hidden video and canvas kept for hover preview generation if needed */}
              <canvas ref={previewCanvasRef} width={320} height={24} style={{ display: "none" }} />
              <video ref={previewVideoRef} src={videoUrl || undefined} muted style={{ display: "none" }} onLoadedMetadata={handleLoadedMetadata} />
            </div>
          </div>

          {/* Retrieved frames directly below with connector lines (scroll-synced) */}
          {timelineFrames && timelineFrames.length > 0 && (
            <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mb-6">
             
              <div
                ref={framesScrollRef}
                className={`relative overflow-y-visible rounded ${framesOverflow ? 'overflow-x-auto hide-scrollbar' : 'overflow-x-hidden'}`}
                style={{ height: Math.max(thumbHeight + 92, 120) }}
              >
                <div
                  ref={framesContentRef}
                  className="relative"
                  style={{ width: timelineFrames.length * (thumbWidth + thumbGap) + 24, height: "100%" }}
                >
                  {retrievedFrames.map((frame, index) => {
                    const leftPercent = duration ? (frame.timestamp / Math.max(duration, 1)) : (frame.frameIndex / Math.max(timelineFrames.length, 1));
                    const contentWidth = timelineFrames.length * (thumbWidth + thumbGap) + 24;
                    const leftPx = Math.max(12, leftPercent * contentWidth);
                    return (
                      <div key={`rf-${frame.frameIndex}`} className="absolute" style={{ left: leftPx, top: 0 }}>
                        {/* Connector line */}
                        <div className="w-px bg-white/50" style={{ height: Math.min(thumbHeight + 8, 64), marginLeft: thumbWidth / 2 }} />
                        {/* Card */}
                        <div
                          className={`relative mt-2 overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer ${
                            selectedFrameIndex === frame.frameIndex ? 'ring-2 ring-blue-400 shadow-blue-400/50' : ''
                          }`}
                          onClick={() => handleFrameClick(frame as any)}
                          style={{ width: thumbWidth, height: thumbHeight }}
                        >
                          <img
                            src={(frame as any)._url ? (frame as any)._url : `data:image/jpeg;base64,${frame.frameData}`}
                            alt={`Frame ${frame.frameIndex}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent py-1 px-2">
                            <div className="text-white text-[10px] font-medium text-center">
                              {frame.timestamp.toFixed(1)}s
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
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

          {/* Progress Bar */}
          <div className="w-full max-w-2xl flex justify-center items-center mt-2">
              <ProgressDemo uploadProgress={uploadProgress} />
          </div>

          {/* Summary Section */}
          {timelineFrames && timelineFrames.length > 0 && (
            <DeepFakeSummary frames={timelineFrames as any} selectedFrameIndex={selectedFrameIndex} />
          )}
        </>
      ) : (
        <div className="text-white text-center opacity-60">No video loaded</div>
      )}
    </div>
  );
};

export default VideoTimeline;
