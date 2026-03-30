export enum AppState {
  IDLE = "IDLE",
  ANALYZING = "ANALYZING",
  COMPLETE = "COMPLETE",
}

export enum View {
  FORENSICS = "FORENSICS",
  ADMIN = "ADMIN",
}

export interface FrameData {
  id: number;
  timestamp: string; // e.g., "00:34:12"
  timestamp_seconds?: number;
  thumbnailUrl: string;
  isAnomaly: boolean;
  confidenceScore: number; // 0-100
  isProcessed: boolean; // For waterfall effect
  isImage?: boolean; // Flag for image processing
  anomalyType?:
    | "FaceSwap-GAN"
    | "Lip-Sync"
    | "Artifacting"
    | "Lighting-Mismatch"
    | "GenD Deepfake";
  elaScore?: number;
  frequencySpike?: number;
  real_prob?: number; // Real probability from GenD model (0-1)
  fake_prob?: number; // Fake probability from GenD model (0-1)
}

export interface AnalysisResult {
  summary: string;
  technicalDetails: string[];
}

export interface HeatmapConfig {
  show: boolean;
  opacity: number;
}

export interface AdminStats {
  totalUploads: number;
  anomaliesFound: number;
  activeUsers: number;
  systemHealth: number;
  recentUploads: {
    id: string;
    user: string;
    filename: string;
    timestamp: string;
    status: "Clean" | "Suspicious" | "Malicious";
    size: string;
  }[];
  trends: {
    date: string;
    uploads: number;
    anomalies: number;
  }[];
}

export interface AnalysisDashboardProps {
  appState: AppState;
  frames: FrameData[];
  uploadProgress?: number;
  status?: string;
  isProcessing?: boolean;
  processedFrames?: number;
  videoUrl?: string;
}
