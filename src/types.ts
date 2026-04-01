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
  xai_results?: Record<string, string>; // Mapping from technique name to base64 string
}

export interface XaiTechniqueResult {
  technique: string;
  figure_base64?: string;
  scores?: Record<string, number>;
  narrative?: string;
  error?: string;
  elapsed_seconds?: number;
}

export interface XaiReadyMessage {
  type: "xai_ready";
  frame_index: number;
  timestamp: string;
  is_anomaly: boolean;
  fake_prob: number;
  real_prob: number;
  xai_results: XaiTechniqueResult[];
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
  imageUrl?: string;
  isImage?: boolean;
}
