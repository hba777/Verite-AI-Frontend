import React, { useState } from "react";
import VideoCard from "@/features/Dashboard/VideoCard/VideoCard";
import VideoTimeline from "@/features/Dashboard/VideoTimeline/VideoTimeline";

const Dashboard: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

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
        />
        <VideoTimeline
          videoUrl={videoUrl}
          currentTime={currentTime}
          onSeek={setCurrentTime}
          uploadProgress={uploadProgress}
        />
      </div>
    </div>
  );
};

export default Dashboard;
