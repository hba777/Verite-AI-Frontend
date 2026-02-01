// src/services/geminiService.ts
import { FrameData } from "../types";

/**
 * MOCKED generateForensicInsight
 * Simulates AI analysis for frontend testing.
 */
export const generateForensicInsight = async (
  frame: FrameData
): Promise<string> => {
  console.log("Mock insight for frame:", frame);

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  return `Mock insight for frame at timestamp ${frame.timestamp}. Confidence: ${frame.confidenceScore}%.`;
};
