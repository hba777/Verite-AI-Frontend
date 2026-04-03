import React, { useState, useEffect, useRef, useCallback } from "react";
import IngestionHub from "@/components/dashboard/IngestionHub";
import AnalysisDashboard from "@/components/dashboard/AnalysisDashboard";
import ImageResult from "@/components/dashboard/ImageResult";
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
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [videoTaskId, setVideoTaskId] = useState<string>("");
  const wsRef = useRef<WebSocket | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const framesReceivedRef = useRef<boolean>(false); // Track if frames are coming via WebSocket

  // Image processing states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDetectionResult, setImageDetectionResult] = useState<any>(null);
  const [imageFrame, setImageFrame] = useState<FrameData | null>(null);
  const [imageTaskId, setImageTaskId] = useState<string>("");
  const [isImageProcessing, setIsImageProcessing] = useState(false);

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
    if (file.type.startsWith("video/")) {
      // Video processing
      try {
        setStatus("Starting task...");

        // Create local video URL for playback
        const url = URL.createObjectURL(file);
        setVideoUrl(url);

        // Get video duration
        const duration = await getVideoDuration(file);
        setVideoDuration(duration);
        console.log("Video duration:", duration, "seconds");

        // 1. Start task via HTTP POST
        const headers: Record<string, string> = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/video/start-task`,
          {
            method: "POST",
            headers,
          },
        );
        if (!res.ok) throw new Error("Failed to start task");
        const data = await res.json();
        const taskId = data.task_id;
        console.log("Task ID:", taskId);
        setVideoTaskId(taskId);
        setAppState(AppState.ANALYZING);

        // Initialize empty frames array for now
        setFrames([]);

        // 2. Open WebSocket
        const ws = new WebSocket(`ws://localhost:8000/ws/task`);
        wsRef.current = ws;
        ws.binaryType = "arraybuffer";

        ws.onopen = () => {
          // Send task_id and video_duration first to subscribe
          ws.send(
            JSON.stringify({
              task_id: taskId,
              video_duration: videoDuration,
            }),
          );
          setStatus("Connected, ready to upload...");
        };

        ws.onmessage = (event) => {
          try {
            // Handle control messages (SEND_VIDEO, Processing, DONE)
            if (event.data === "SEND_VIDEO") {
              setStatus("Uploading video...");
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
                            : "", // No mock images - will show placeholder
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
                          : "", // No mock images - will show placeholder
                      isAnomaly: jsonData.is_anomaly ?? false,
                      confidenceScore: jsonData.confidence ?? 0,
                      // Mark as processed if it's frame_ready or detection_ready
                      isProcessed: true,
                      anomalyType: jsonData.anomaly_type,
                      elaScore: jsonData.ela_score,
                      frequencySpike: jsonData.frequency_spike,
                      real_prob: jsonData.real_prob,
                      fake_prob: jsonData.fake_prob,
                      // Include Grad-CAM if available (sent together with detection for anomalies)
                      gradcam_b64: jsonData.gradcam_b64,
                    };
                    return updated;
                  });
                  setProcessedFrames((prev) => prev + 1);
                  console.log(
                    `Frame ${frameIndex} received (${jsonData.type})`,
                  );
                } else if (jsonData.type === "xai_ready") {
                  // Handle XAI/Grad-CAM results
                  const xaiFrameIndex = jsonData.frame_index;
                  const gradcamB64 = jsonData.gradcam_b64;
                  const elaB64 = jsonData.ela_b64;
                  const fftData = jsonData.fft_data;
                  const limeData = jsonData.lime_data;

                  setFrames((prev) => {
                    const updated = [...prev];
                    if (updated[xaiFrameIndex]) {
                      updated[xaiFrameIndex] = {
                        ...updated[xaiFrameIndex],
                        gradcam_b64: gradcamB64,
                        ela_b64: elaB64,
                        fft_data: fftData,
                        lime_data: limeData,
                      };
                    }
                    return updated;
                  });
                    
                    // Dispatch custom event for ForensicAnalysisSection to update
                    const xaiEvent = new CustomEvent("xai_update", {
                      detail: {
                        frameIndex: xaiFrameIndex,
                        gradcam_b64: gradcamB64,
                        ela_b64: elaB64,
                        fft_data: fftData,
                        lime_data: limeData,
                        task_id: jsonData.task_id,
                      },
                    });
                    window.dispatchEvent(xaiEvent);
                    
                  console.log(`XAI data received for frame ${xaiFrameIndex}`, jsonData);
                } else if (jsonData.type === "processing_complete") {
                  setStatus("Processing complete!");
                  setIsProcessing(false);
                  setAppState(AppState.COMPLETE);
                  console.log("Processing completed:", jsonData);

                  // Update frames with XAI data (Grad-CAM and TimeSHAP) if available
                  if (jsonData.xai_results && jsonData.timeshap_result) {
                    const timeshap = jsonData.timeshap_result;
                    setFrames((prevFrames) => {
                      return prevFrames.map((frame, idx) => {
                        const xaiFrame = jsonData.xai_results.find(
                          (x: any) => x.frame_index === idx,
                        );
                        if (xaiFrame) {
                          return {
                            ...frame,
                            gradcam_b64: xaiFrame.gradcam_b64,
                            timeshap_attribution:
                              timeshap.attributions?.[idx] !== undefined
                                ? [timeshap.attributions[idx]]
                                : undefined,
                            timeshap_baseline: timeshap.baseline_prob,
                            timeshap_frame_probs: timeshap.frame_probs,
                          };
                        }
                        return frame;
                      });
                    });
                    console.log(
                      "XAI results applied to frames:",
                      jsonData.timeshap_result,
                    );
                  }
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
    } else if (file.type.startsWith("image/")) {
      // Image processing
      try {
        setImageFile(file);
        setIsImageProcessing(true);

        // 1. Start task via HTTP POST
        const headers: Record<string, string> = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/video/start-task`,
          {
            method: "POST",
            headers,
          },
        );
        if (!res.ok) throw new Error("Failed to start task");
        const data = await res.json();
        const taskId = data.task_id;
        console.log("Image Task ID:", taskId);
        setImageTaskId(taskId);

        // 2. Open WebSocket
        const ws = new WebSocket(`ws://localhost:8000/ws/task`);
        ws.binaryType = "arraybuffer";

        ws.onopen = () => {
          // Send task_id and file_type
          ws.send(
            JSON.stringify({
              task_id: taskId,
              file_type: "image",
            }),
          );
        };

        ws.onmessage = (event) => {
          try {
            // Handle control messages (SEND_IMAGE, Processing, DONE)
            if (event.data === "SEND_IMAGE") {
              // Send image data
              const reader = new FileReader();
              reader.onload = (e) => {
                if (e.target?.result) {
                  ws.send(e.target.result as ArrayBuffer);
                  ws.send("END");
                }
              };
              reader.readAsArrayBuffer(file);
            } else if (typeof event.data === "string") {
              try {
                const jsonData = JSON.parse(event.data);
                console.log("Received image JSON data:", jsonData);

                if (
                  jsonData.type === "processing_complete" &&
                  jsonData.detection_result
                ) {
                  setImageDetectionResult(jsonData.detection_result);
                  const frame: FrameData = {
                    id: 0,
                    timestamp: "00:00:00",
                    thumbnailUrl: URL.createObjectURL(file),
                    isAnomaly: jsonData.detection_result.is_anomaly ?? false,
                    confidenceScore: jsonData.detection_result.confidence ?? 0,
                    isProcessed: true,
                    anomalyType: jsonData.detection_result.anomaly_type,
                    elaScore: jsonData.detection_result.ela_score,
                    frequencySpike: jsonData.detection_result.frequency_spike,
                    real_prob: jsonData.detection_result.real_prob,
                    fake_prob: jsonData.detection_result.fake_prob,
                    // Include Grad-CAM if available (sent together with detection for anomalies)
                    gradcam_b64: jsonData.detection_result.gradcam_b64,
                  };
                  setImageFrame(frame);
                  setIsImageProcessing(false);

                  // Update frames with XAI data if available
                  if (jsonData.xai_result) {
                    const xaiData = jsonData.xai_result;
                    setImageFrame((prev) => {
                      if (prev) {
                        return {
                          ...prev,
                          gradcam_b64: xaiData.gradcam_b64 || prev.gradcam_b64,
                          ela_b64: xaiData.ela_b64,
                          fft_data: xaiData.fft_data,
                          lime_data: xaiData.lime_data,
                        };
                      }
                      return prev;
                    });
                    console.log("XAI results applied to image frame:", xaiData);
                  }
                } else if (jsonData.type === "xai_ready") {
                  // Handle XAI/Grad-CAM results
                  const gradcamB64 = jsonData.gradcam_b64;
                  const elaB64 = jsonData.ela_b64;
                  const fftData = jsonData.fft_data;
                  const limeData = jsonData.lime_data;

                  setImageFrame((prev) => {
                    if (prev) {
                      return {
                        ...prev,
                        gradcam_b64: gradcamB64,
                        ela_b64: elaB64,
                        fft_data: fftData,
                        lime_data: limeData,
                      };
                    }
                    return prev;
                  });

                  // Dispatch custom event for ImageResult to update
                  const xaiEvent = new CustomEvent("xai_update", {
                    detail: {
                      frameIndex: 0, // Single frame for image
                      gradcam_b64: gradcamB64,
                      ela_b64: elaB64,
                      fft_data: fftData,
                      lime_data: limeData,
                      task_id: jsonData.task_id,
                    },
                  });
                  window.dispatchEvent(xaiEvent);

                  console.log(`XAI data received for image`, jsonData);
                } else if (jsonData.type === "error") {
                  console.error("Image processing error:", jsonData);
                  setIsImageProcessing(false);
                }
              } catch (parseError) {
                console.log("Non-JSON message:", event.data);
              }
            }
          } catch (err) {
            console.error("Error parsing WebSocket message for image:", err);
          }
        };

        ws.onerror = (err) => {
          console.error("WebSocket error for image:", err);
        };

        ws.onclose = () => {
          console.log("WebSocket closed for image");
        };
      } catch (error) {
        console.error("Image upload failed:", error);
        setIsImageProcessing(false);
      }
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
      {isImageProcessing ? (
        <div className="flex items-center justify-center min-h-screen bg-black">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
            <p className="mt-4 text-white text-xl">Processing image...</p>
          </div>
        </div>
      ) : imageFrame && imageDetectionResult ? (
        <ImageResult
          frame={imageFrame}
          detectionResult={imageDetectionResult}
          taskId={imageTaskId}
        />
      ) : appState === AppState.IDLE ? (
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
          taskId={videoTaskId}
        />
      )}
    </div>
  );
};

export default Dashboard;
