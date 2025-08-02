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
  onUploadProgress?: (progress: number) => void;
}

const VIDEO_WIDTH_WITH_IMAGE = 600;
const VIDEO_HEIGHT_WITH_IMAGE = 400;
const VIDEO_WIDTH_ONLY = 800;
const VIDEO_HEIGHT_ONLY = 450;

const VideoCard: React.FC<VideoCardProps> = ({
  onVideoSelect,
  videoUrl: controlledUrl,
  onCurrentTimeChange,
  currentTime,
  showImageCard,
  onUploadProgress,
}) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<string>("");
  const [taskId, setTaskId] = useState<string | null>(null);
  const [previewFrames, setPreviewFrames] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Use controlled videoUrl if provided
  const url = controlledUrl !== undefined ? controlledUrl : videoUrl;

  useEffect(() => {
    if (currentTime !== undefined && videoRef.current && url) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime, url]);

  async function uploadVideoViaWebSocket(file: File) {
    try {
      setUploadProgress(0);
      // 1. Start task via HTTP POST
      const res = await fetch("http://localhost:8000/video/start-task", {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to start task");
      const data = await res.json();
      const tid = data.task_id;
      console.log("Task ID:", tid);
      setTaskId(tid);

      // 2. Open WebSocket
      const ws = new WebSocket("ws://localhost:8000/ws/task");
      ws.binaryType = "arraybuffer";

      ws.onopen = () => {
        // Send task_id first to subscribe
        ws.send(tid);
      };

      ws.onmessage = (event) => {
        try {
          // Handle control messages (SEND_VIDEO, Processing, DONE)
          if (event.data === "SEND_VIDEO") {
            // Start sending file chunks
            const chunkSize = 64 * 1024; // 64 KB
            let offset = 0;
            function sendNext() {
              const slice = file.slice(offset, offset + chunkSize);
              const reader = new FileReader();
              reader.onload = (e) => {
                if (e.target?.result) {
                  ws.send(e.target.result as ArrayBuffer);
                  offset += chunkSize;
                  // Update progress
                  const progress = Math.min((offset / file.size) * 100, 100);
                  setUploadProgress(progress);
                  onUploadProgress?.(progress);
                  if (offset < file.size) {
                    sendNext();
                  } else {
                    ws.send("END");
                    setUploadProgress(100);
                    onUploadProgress?.(100);
                  }
                }
              };
              reader.readAsArrayBuffer(slice);
            }
            sendNext();
          } else if (event.data === "Processing...") {
            setStatus("Processing video...");
            setUploadProgress(100); // Upload complete, now processing
            onUploadProgress?.(100);
          } else if (event.data === "DONE") {
            setStatus("Processing complete!");
            // Next message will contain JSON result
          } else {
            // Try parsing JSON result (final message with preview frames)
            const jsonData = JSON.parse(event.data);
            console.log("Received JSON data:", jsonData);
            if (jsonData.preview_frames) {
              console.log("Preview frames received:", jsonData.preview_frames.length);
              // Store preview frames in state
              setPreviewFrames(jsonData.preview_frames);
            } else {
              console.log("No preview_frames in response");
            }
          }
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        setStatus("WebSocket error");
      };

      ws.onclose = () => {
        console.log("WebSocket closed");
        setStatus("Upload finished");
      };
    } catch (error) {
      console.error("Upload failed:", error);
      setStatus("Failed to start upload");
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && ACCEPTED_VIDEO_TYPES.includes(file.type)) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      onVideoSelect?.(url);
      uploadVideoViaWebSocket(file);
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
      uploadVideoViaWebSocket(file);
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
    const videoWidth = showImageCard
      ? VIDEO_WIDTH_WITH_IMAGE
      : VIDEO_WIDTH_ONLY;
    const videoHeight = showImageCard
      ? VIDEO_HEIGHT_WITH_IMAGE
      : VIDEO_HEIGHT_ONLY;
    return (
      <div className="flex flex-row items-center justify-center w-full relative">
        <video
          ref={videoRef}
          src={url}
          controls
          className="rounded shadow-lg transition-all duration-500"
          style={{
            background: "#000",
            width: videoWidth,
            height: videoHeight,
            transition:
              "width 0.5s cubic-bezier(0.4,0,0.2,1), height 0.5s cubic-bezier(0.4,0,0.2,1)",
          }}
          onTimeUpdate={handleTimeUpdate}
        />
        {showImageCard && (
          <div className="ml-6 animate-slidein">
            {previewFrames.length > 0 ? (
              <div 
                className="rounded shadow-lg overflow-hidden"
                style={{
                  width: VIDEO_WIDTH_WITH_IMAGE,
                  height: VIDEO_HEIGHT_WITH_IMAGE,
                  background: "#000",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div className="text-white text-sm mb-2">Detection Results</div>
                <div className="flex flex-wrap gap-2 justify-center max-h-[300px] overflow-y-auto p-2">
                  {previewFrames.map((frame, index) => (
                    <img
                      key={index}
                      src={`data:image/jpeg;base64,${frame}`}
                      alt={`Detection frame ${index + 1}`}
                      className="rounded border border-gray-600"
                      style={{
                        width: "120px",
                        height: "90px",
                        objectFit: "cover",
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <img
                src="/Peak.png"
                alt="Card"
                style={{
                  width: VIDEO_WIDTH_WITH_IMAGE,
                  height: VIDEO_HEIGHT_WITH_IMAGE,
                  objectFit: "contain",
                  display: "block",
                }}
              />
            )}
          </div>
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
        {status && <div className="mb-2 text-sm text-blue-400">{status}</div>}
      </div>
    );
  }

  // Show drag-and-drop UI with border if no video
  return (
    <div
      className={`flex flex-col items-center justify-center w-full min-h-[300px] border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ${
        dragActive
          ? "border-white bg-[#23272f]"
          : "border-gray-500 bg-[#181a20]"
      }`}
      style={{ color: "#fff", maxWidth: 500, margin: "0 auto" }}
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
