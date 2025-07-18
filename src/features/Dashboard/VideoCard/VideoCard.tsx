import React, { useRef, useState, useEffect } from "react";

const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
  "video/x-matroska",
];

interface VideoCardProps {
  onVideoSelect?: (url: string) => void;
  videoUrl?: string | null;
  onCurrentTimeChange?: (time: number) => void;
  currentTime?: number;
  showImageCard?: boolean;
}

const FIXED_WIDTH = 600;
const FIXED_HEIGHT = 400;
const VIDEO_WIDTH_WITH_IMAGE = 600;
const VIDEO_HEIGHT_WITH_IMAGE = 400;
const VIDEO_WIDTH_ONLY = 800;
const VIDEO_HEIGHT_ONLY = 450;

const VideoCard: React.FC<VideoCardProps> = ({ onVideoSelect, videoUrl: controlledUrl, onCurrentTimeChange, currentTime, showImageCard }) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Use controlled videoUrl if provided
  const url = controlledUrl !== undefined ? controlledUrl : videoUrl;

  useEffect(() => {
    if (currentTime !== undefined && videoRef.current && url) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime, url]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && ACCEPTED_VIDEO_TYPES.includes(file.type)) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      onVideoSelect?.(url);
    } else {
      alert("Please upload a valid video file.");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && ACCEPTED_VIDEO_TYPES.includes(file.type)) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      onVideoSelect?.(url);
    } else {
      alert("Please upload a valid video file.");
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleTimeUpdate = () => {
    if (onCurrentTimeChange && videoRef.current) {
      onCurrentTimeChange(videoRef.current.currentTime);
    }
  };

  if (url) {
    // Only show the video, no border/background
    const videoWidth = showImageCard ? VIDEO_WIDTH_WITH_IMAGE : VIDEO_WIDTH_ONLY;
    const videoHeight = showImageCard ? VIDEO_HEIGHT_WITH_IMAGE : VIDEO_HEIGHT_ONLY;
    return (
      <div className="flex flex-row items-center justify-center w-full relative">
        <video
          ref={videoRef}
          src={url}
          controls
          className="rounded shadow-lg"
          style={{ background: "#000", width: videoWidth, height: videoHeight }}
          onTimeUpdate={handleTimeUpdate}
        />
        {showImageCard && (
          <img
            src="/Peak.png"
            alt="Card"
            className="ml-6 animate-slidein"
            style={{
              animation: 'slidein 0.5s cubic-bezier(0.4,0,0.2,1)',
              width: VIDEO_WIDTH_WITH_IMAGE,
              height: VIDEO_HEIGHT_WITH_IMAGE,
              objectFit: 'contain',
              display: 'block',
            }}
          />
        )}
        <style jsx>{`
          @keyframes slidein {
            from {
              opacity: 0;
              transform: translateX(40px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}</style>
      </div>
    );
  }

  // Show drag-and-drop UI with border if no video
  return (
    <div
      className={`flex flex-col items-center justify-center w-full min-h-[300px] border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ${
        dragActive ? "border-white bg-[#23272f]" : "border-gray-500 bg-[#181a20]"
      }`}
      style={{ color: "#fff", maxWidth: 500, margin: '0 auto' }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_VIDEO_TYPES.join(",")}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <div className="flex flex-col items-center">
        <span className="text-lg font-semibold mb-2" style={{ color: "#fff" }}>
          Drag & Drop your video here
        </span>
        <span className="text-sm" style={{ color: "#fff" }}>
          or click to select a file
        </span>
        <span className="mt-2 text-xs text-gray-400">
          (Supported: mp4, webm, ogg, mov, mkv)
        </span>
      </div>
    </div>
  );
};

export default VideoCard;
