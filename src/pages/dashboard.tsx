import React, { useState } from "react";
import VideoCard from "@/features/Dashboard/VideoCard/VideoCard";
import VideoTimeline from "@/features/Dashboard/VideoTimeline/VideoTimeline";

const Dashboard: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [frames, setFrames] = useState<Array<{frameIndex: number, frameData: string, timestamp: number}>>([]);
  const [frameSelector, setFrameSelector] = useState<((frame: {frameIndex: number, frameData: string, timestamp: number} | null) => void) | null>(null);

  const handleFramesReceived = (newFrames: Array<{frameIndex: number, frameData: string, timestamp: number}>, selector?: (frame: {frameIndex: number, frameData: string, timestamp: number} | null) => void) => {
    setFrames(newFrames);
    if (selector) {
      setFrameSelector(() => selector);
    }
  };

  const handleFrameClick = (frame: {frameIndex: number, frameData: string, timestamp: number}) => {
    // Jump to the timestamp in the video
    setCurrentTime(frame.timestamp);
    
    // Update the selected frame in VideoCard
    if (frameSelector) {
      frameSelector(frame);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#181a20] text-white pt-20 pb-12">
      <div className="w-full flex flex-col gap-8">
        <VideoCard
          onVideoSelect={setVideoUrl}
          videoUrl={videoUrl}
          currentTime={currentTime}
          onCurrentTimeChange={setCurrentTime}
          showImageCard={true}
          onUploadProgress={setUploadProgress}
          onFramesReceived={handleFramesReceived}
        />
        <VideoTimeline
          videoUrl={videoUrl}
          currentTime={currentTime}
          onSeek={setCurrentTime}
          uploadProgress={uploadProgress}
          frames={frames}
          onFrameClick={handleFrameClick}
        />
      </div>
    </div>
  );
};

export default Dashboard;
