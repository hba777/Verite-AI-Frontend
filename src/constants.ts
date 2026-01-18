import { FrameData } from "./types";

// Generate realistic looking dummy data
export const generateMockFrames = (): FrameData[] => {
  const frames: FrameData[] = [];
  const totalFrames = 50;

  for (let i = 0; i < totalFrames; i++) {
    // Create anomalies at specific intervals (e.g., frame 15, 32, 45)
    const isAnomaly = [15, 32, 45].includes(i);

    // Pad number for picsum
    const imgId = 100 + i;

    frames.push({
      id: i,
      timestamp: `00:00:${i.toString().padStart(2, "0")}`,
      // Using different placeholder images to simulate video frames
      thumbnailUrl: `https://picsum.photos/seed/${imgId}/800/450`,
      isAnomaly: isAnomaly,
      confidenceScore: isAnomaly ? 85 + Math.floor(Math.random() * 14) : 5,
      isProcessed: false, // Starts false for waterfall effect
      anomalyType: isAnomaly ? "FaceSwap-GAN" : undefined,
      elaScore: isAnomaly ? 0.85 : 0.1,
      frequencySpike: isAnomaly ? 85 : 12,
    });
  }
  return frames;
};
