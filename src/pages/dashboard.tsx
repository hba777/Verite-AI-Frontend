import React, { useState, useEffect } from "react";
import IngestionHub from "@/components/dashboard/IngestionHub";
import AnalysisDashboard from "@/components/dashboard/AnalysisDashboard";
import { AppState, FrameData } from "@/types";
import { generateMockFrames } from "@/constants";

const Dashboard: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [frames, setFrames] = useState<FrameData[]>([]);

  const handleFileSelect = (file: File) => {
    // In a real app, we would upload the file here.
    // For this demo, we transition to dashboard and start mock processing.
    console.log("File selected:", file);
    setAppState(AppState.ANALYZING);

    // Initialize mock frames
    const initialFrames = generateMockFrames();
    setFrames(initialFrames);
  };

  // Simulate the "Waterfall" processing effect
  useEffect(() => {
    if (appState === AppState.ANALYZING) {
      let currentIndex = 0;

      const processInterval = setInterval(() => {
        setFrames((prevFrames) => {
          const newFrames = [...prevFrames];
          // Process batches of frames to simulate speed
          for (let i = 0; i < 2; i++) {
            if (currentIndex < newFrames.length) {
              newFrames[currentIndex].isProcessed = true;
              currentIndex++;
            }
          }
          return newFrames;
        });

        if (currentIndex >= frames.length && frames.length > 0) {
          clearInterval(processInterval);
          setAppState(AppState.COMPLETE);
        }
      }, 150); // Speed of processing

      return () => clearInterval(processInterval);
    }
  }, [appState, frames.length]);

  return (
    <div className="font-sans text-text-high antialiased">
      {appState === AppState.IDLE ? (
        <IngestionHub onFileSelect={handleFileSelect} />
      ) : (
        <AnalysisDashboard appState={appState} frames={frames} />
      )}
    </div>
  );
};

export default Dashboard;
