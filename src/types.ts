export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE'
}

export interface FrameData {
  id: number;
  timestamp: string; // e.g., "00:34:12"
  thumbnailUrl: string;
  isAnomaly: boolean;
  confidenceScore: number; // 0-100
  isProcessed: boolean; // For waterfall effect
  anomalyType?: 'FaceSwap-GAN' | 'Lip-Sync' | 'Artifacting' | 'Lighting-Mismatch';
  elaScore?: number;
  frequencySpike?: number;
}

export interface AnalysisResult {
  summary: string;
  technicalDetails: string[];
}

export interface HeatmapConfig {
  show: boolean;
  opacity: number;
}

export interface AnalysisDashboardProps {
  appState: AppState;
  frames: FrameData[];
  uploadProgress?: number;
  status?: string;
  isProcessing?: boolean;
  processedFrames?: number;
}
