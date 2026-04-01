import React, { useState, useEffect, useRef, useCallback } from "react";
import IngestionHub from "@/components/dashboard/IngestionHub";
import AnalysisDashboard from "@/components/dashboard/AnalysisDashboard";
import { AppState, FrameData } from "@/types";
import { useUser } from "../context/UserContext";

const Dashboard: React.FC = () => {
  const { token } = useUser();
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [frames, setFrames] = useState<FrameData[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState("Idle");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFrames, setProcessedFrames] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isImage, setIsImage] = useState<boolean>(false);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const wsRef = useRef<WebSocket | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const framesReceivedRef = useRef<boolean>(false); // Track if frames are coming via WebSocket

  // Generate mock frames for demo/initial state
  const generateMockFrames = useCallback((): FrameData[] => {
    const newFrames: FrameData[] = [];
    const totalFrames = 50;

    for (let i = 0; i < totalFrames; i++) {
      const isAnomaly = [15, 32, 45].includes(i);
      const imgId = 100 + i;

      newFrames.push({
        id: i,
        timestamp: `00:00:${i.toString().padStart(2, "0")}`,
        thumbnailUrl: `https://picsum.photos/seed/${imgId}/800/450`,
        isAnomaly: isAnomaly,
        confidenceScore: isAnomaly ? 85 + Math.floor(Math.random() * 14) : 5,
        isProcessed: false,
        anomalyType: isAnomaly ? "FaceSwap-GAN" : undefined,
        elaScore: isAnomaly ? 0.85 : 0.1,
        frequencySpike: isAnomaly ? 85 : 12,
      });
    }
    return newFrames;
  }, []);

  // Cleanup WebSocket on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Helper function to get video duration
  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      video.onerror = () => {
        resolve(0);
      };
      video.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (file: File) => {
    try {
      setStatus("Starting task...");

      const isImageFile = file.type.startsWith("image/");
      setIsImage(isImageFile);

      // Create local URL for playback/preview
      const url = URL.createObjectURL(file);
      if (isImageFile) {
        setImageUrl(url);
        setVideoUrl(null);
      } else {
        setVideoUrl(url);
        setImageUrl(null);
      }

      // Get video duration
      let duration = 0;
      if (!isImageFile) {
        duration = await getVideoDuration(file);
        setVideoDuration(duration);
        console.log("Video duration:", duration, "seconds");
      }

      // 1. Start task via HTTP POST
      const endpoint = isImageFile ? "/image/start-task" : "/video/start-task";
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        {
          method: "POST",
          headers,
        },
      );
      if (!res.ok) throw new Error("Failed to start task");
      const data = await res.json();
      const taskId = data.task_id;
      console.log("Task ID:", taskId);
      setAppState(AppState.ANALYZING);

      // Initialize empty frames array for now
      setFrames([]);

      // 2. Open WebSocket
      const ws = new WebSocket(`ws://localhost:8000/ws/task`);
      wsRef.current = ws;
      ws.binaryType = "arraybuffer";

      ws.onopen = () => {
        // Send initialization manifest
        if (isImageFile) {
          ws.send(JSON.stringify({ task_id: taskId, file_type: "image" }));
        } else {
          ws.send(JSON.stringify({ task_id: taskId, video_duration: duration }));
        }
        setStatus("Connected, ready to upload...");
      };

      ws.onmessage = (event) => {
        try {
          // Handle control messages (SEND_VIDEO, SEND_IMAGE, Processing, DONE)
          if (event.data === "SEND_VIDEO" || event.data === "SEND_IMAGE") {
            setStatus("Uploading file...");
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
                  if (offset < file.size) {
                    sendNext();
                  } else {
                    ws.send("END");
                    setUploadProgress(100);
                    setStatus("Upload complete, processing...");
                  }
                }
              };
              reader.readAsArrayBuffer(slice);
            }
            sendNext();
          } else if (event.data === "Processing...") {
            setStatus("Processing video...");
            setUploadProgress(100);
            setIsProcessing(true);
            setProcessedFrames(0);
          } else {
            // Try parsing JSON message
            try {
              const jsonData = JSON.parse(event.data as string);
              console.log("Received JSON data:", jsonData);

              if (
                jsonData.type === "frame_ready" ||
                jsonData.type === "detection_ready"
              ) {
                // Mark that frames are being received via WebSocket
                framesReceivedRef.current = true;

                // Handle real-time frame update or detection result
                const frameIndex = jsonData.frame_index;

                // Convert timestamp to string format (e.g., "00:00:12")
                const formatTimestamp = (time: number) => {
                  const hrs = Math.floor(time / 3600);
                  const mins = Math.floor((time % 3600) / 60);
                  const secs = Math.floor(time % 60);
                  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
                };

                // Process XAI results if present in detection_ready
                let xaiResultsMap: Record<string, string> | undefined;
                if (jsonData.xai_results && typeof jsonData.xai_results === 'object') {
                  // If xai_results is already a map (from WebSocket handler), use it directly
                  if (!Array.isArray(jsonData.xai_results)) {
                    xaiResultsMap = jsonData.xai_results;
                  } else {
                    // If xai_results is an array, convert to map
                    xaiResultsMap = jsonData.xai_results.reduce((acc: Record<string, string>, curr: any) => {
                      if (curr.figure_base64) {
                        const prefix = curr.figure_base64.startsWith('data:image') ? '' : 'data:image/jpeg;base64,';
                        acc[curr.technique] = prefix + curr.figure_base64;
                      }
                      return acc;
                    }, {} as Record<string, string>);
                  }
                }

                setFrames((prev) => {
                  const updated = [...prev];
                  // Ensure array is large enough
                  while (updated.length <= frameIndex) {
                    updated.push({
                      id: updated.length,
                      // Use timestamp from backend if available
                      timestamp:
                        typeof jsonData.timestamp === "string"
                          ? jsonData.timestamp
                          : formatTimestamp(
                              jsonData.timestamp || updated.length,
                            ),
                      thumbnailUrl: jsonData.frame_data
                        ? `data:image/jpeg;base64,${jsonData.frame_data}`
                        : jsonData.original_frame_data
                          ? `data:image/jpeg;base64,${jsonData.original_frame_data}`
                          : `https://picsum.photos/seed/${updated.length + 100}/800/450`,
                      isAnomaly: false,
                      confidenceScore: 0,
                      isProcessed: false,
                      anomalyType: undefined,
                      elaScore: undefined,
                      frequencySpike: undefined,
                    });
                  }
                  // Update the specific frame
                  updated[frameIndex] = {
                    ...(updated[frameIndex] || {}),
                    id: frameIndex,
                    // Use timestamp from backend if available, otherwise format from seconds
                    timestamp:
                      typeof jsonData.timestamp === "string"
                        ? jsonData.timestamp
                        : formatTimestamp(jsonData.timestamp ?? frameIndex),
                    timestamp_seconds:
                      jsonData.timestamp_seconds ??
                      (typeof jsonData.timestamp === "number"
                        ? jsonData.timestamp
                        : frameIndex),
                    thumbnailUrl: jsonData.frame_data
                      ? `data:image/jpeg;base64,${jsonData.frame_data}`
                      : jsonData.original_frame_data
                        ? `data:image/jpeg;base64,${jsonData.original_frame_data}`
                        : updated[frameIndex]?.thumbnailUrl 
                        || `https://picsum.photos/seed/${frameIndex + 100}/800/450`,
                    isAnomaly: jsonData.is_anomaly ?? updated[frameIndex]?.isAnomaly ?? false,
                    confidenceScore: jsonData.confidence ?? updated[frameIndex]?.confidenceScore ?? 0,
                    // Mark as processed if it's frame_ready or detection_ready
                    isProcessed: true,
                    anomalyType: jsonData.anomaly_type ?? updated[frameIndex]?.anomalyType,
                    elaScore: jsonData.ela_score ?? updated[frameIndex]?.elaScore,
                    frequencySpike: jsonData.frequency_spike ?? updated[frameIndex]?.frequencySpike,
                    real_prob: jsonData.real_prob ?? updated[frameIndex]?.real_prob,
                    fake_prob: jsonData.fake_prob ?? updated[frameIndex]?.fake_prob,
                    // XAI results are now included in detection_ready
                    xai_results: xaiResultsMap ?? updated[frameIndex]?.xai_results,
                  };
                  return updated;
                });
                setProcessedFrames((prev) => prev + 1);
                console.log(`Frame ${frameIndex} received (${jsonData.type}, xai_count=${xaiResultsMap ? Object.keys(xaiResultsMap).length : 0})`);
              } else if (jsonData.type === "xai_ready") {
                const frameIndex = jsonData.frame_index;
                const techniquesMap = jsonData.xai_results?.reduce((acc: Record<string, string>, curr: any) => {
                    if (curr.figure_base64) {
                       // Add data URL format if it's missing just purely base64
                       const prefix = curr.figure_base64.startsWith('data:image') ? '' : 'data:image/jpeg;base64,';
                       acc[curr.technique] = prefix + curr.figure_base64;
                    }
                    return acc;
                }, {} as Record<string, string>);

                if (techniquesMap) {
                  setFrames((prev) => {
                    const updated = [...prev];
                    if (updated[frameIndex]) {
                      updated[frameIndex] = {
                        ...updated[frameIndex],
                        xai_results: techniquesMap
                      };
                    }
                    return updated;
                  });
                  console.log(`XAI results received for frame ${frameIndex}`);
                }
              } else if (jsonData.type === "processing_complete") {
                setStatus("Processing complete!");
                setIsProcessing(false);
                setAppState(AppState.COMPLETE);
                console.log("Processing completed:", jsonData);
              } else if (jsonData.type === "error") {
                setStatus(`Error: ${jsonData.message}`);
                setIsProcessing(false);
                console.error("Processing error:", jsonData);
              } else if (jsonData.preview_frames) {
                // Legacy support for old format
                console.log(
                  "Preview frames received:",
                  jsonData.preview_frames.length,
                );

                // Convert preview frames to FrameData format
                const newFrames: FrameData[] = jsonData.preview_frames.map(
                  (url: string, idx: number) => ({
                    id: idx,
                    timestamp: `00:00:${idx.toString().padStart(2, "0")}`,
                    timestamp_seconds: idx,
                    thumbnailUrl: url,
                    isAnomaly: false,
                    confidenceScore: 0,
                    isProcessed: true,
                  }),
                );
                setFrames(newFrames);
              }
            } catch (parseError) {
              console.log("Non-JSON message:", event.data);
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
        if (status !== "Processing complete!") {
          setStatus("Connection closed");
        }
      };
    } catch (error) {
      console.error("Upload failed:", error);
      setStatus("Failed to start upload");
    }
  };

  // Simulate the "Waterfall" processing effect (fallback if WebSocket not available)
  useEffect(() => {
    // Only run mock processing if:
    // 1. We're analyzing
    // 2. No frames yet
    // 3. NOT receiving frames via WebSocket (checked via ref)
    if (
      appState === AppState.ANALYZING &&
      frames.length === 0 &&
      !framesReceivedRef.current &&
      status !== "Upload complete, processing..."
    ) {
      // Initialize mock frames for demo
      const initialFrames = generateMockFrames();
      setFrames(initialFrames);

      let currentIndex = 0;
      const processInterval = setInterval(() => {
        setFrames((prevFrames) => {
          const newFrames = [...prevFrames];
          // Process batches of frames to simulate speed
          for (let i = 0; i < 2; i++) {
            if (currentIndex < newFrames.length) {
              newFrames[currentIndex] = {
                ...newFrames[currentIndex],
                isProcessed: true,
              };
              currentIndex++;
            }
          }
          return newFrames;
        });

        if (currentIndex >= initialFrames.length && initialFrames.length > 0) {
          clearInterval(processInterval);
          setAppState(AppState.COMPLETE);
        }
      }, 150);

      return () => clearInterval(processInterval);
    }
  }, [appState, status, generateMockFrames]);

  return (
    <div className="font-sans text-text-high antialiased">
      {appState === AppState.IDLE ? (
        <IngestionHub onFileSelect={handleFileSelect} />
      ) : (
        <AnalysisDashboard
          appState={appState}
          frames={frames}
          uploadProgress={uploadProgress}
          status={status}
          isProcessing={isProcessing}
          processedFrames={processedFrames}
          videoUrl={videoUrl || undefined}
          imageUrl={imageUrl || undefined}
          isImage={isImage}
        />
      )}
    </div>
  );
};

export default Dashboard;
