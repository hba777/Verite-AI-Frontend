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
gradcam_b64?: string; // Base64 encoded Grad-CAM image from XAI
  ela_b64?: string; // Base64 encoded ELA image from XAI
  lipSyncData?: { t: string; deviation: number }[]; // Lip sync data for line chart
  // TimeSHAP temporal attribution data
  timeshap_attribution?: number[]; // Array of SHAP attributions per frame
  timeshap_baseline?: number; // Baseline probability from TimeSHAP
  timeshap_frame_probs?: number[]; // Frame probabilities from TimeSHAP
  // FFT Analysis data
  fft_data?: {
    peak_frequency: number;
    quadrant_energy: { dc: number; low: number; mid: number; high: number };
    radial_profile: { frequency: number; log_power: number }[];
    stats: { mean_log_power: number; std_log_power: number; max_log_power: number; high_freq_ratio: number };
  };
  // LIME Analysis data
  lime_data?: {
    baseline_fake_prob: number;
    features: { superpixel_id: number; importance: number; abs_importance: number; direction: "fake" | "real" | "neutral" }[];
    stats: { n_superpixels: number; n_samples: number; r2_score: number };
    top_fake_superpixels: number[];
    top_real_superpixels: number[];
  };
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
