import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import {
  Upload,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  XCircle,
  Wifi,
  WifiOff,
  ZoomIn,
  RotateCcw,
  Activity,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────

interface BoundingBox {
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
  score?: number;
}

interface DetectionResult {
  bounding_boxes: BoundingBox[];
  anomaly_score: number; // 0.0 – 1.0
}

type AnalysisPhase =
  | "idle"
  | "connecting"
  | "uploading"
  | "analyzing"
  | "complete"
  | "error";

// ─── Color palette (matches project theme) ─────────────────────────────────

const C = {
  deepVoid: "#08090A",
  surface: "#121416",
  surfaceAlt: "#1a1d20",
  electricTeal: "#00E5FF",
  neuralGreen: "#00E676",
  hyperRed: "#FF2D55",
  warningOrange: "#FF9500",
  textHigh: "#F5F5F5",
  textMed: "#A0A0A0",
  border: "rgba(255,255,255,0.08)",
  borderActive: "rgba(255,255,255,0.18)",
  gradientBlue: "linear-gradient(90deg,#3b6bff,#2e96ff 65%,#acb7ff)",
} as const;

// ─── Helpers ───────────────────────────────────────────────────────────────

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function scoreColor(score: number): string {
  if (score > 0.65) return C.hyperRed;
  if (score > 0.35) return C.warningOrange;
  return C.neuralGreen;
}

function verdictFromScore(score: number): { label: string; color: string } {
  if (score > 0.65)
    return { label: "DEEPFAKE DETECTED", color: C.hyperRed };
  if (score > 0.35)
    return { label: "INCONCLUSIVE", color: C.warningOrange };
  return { label: "LIKELY AUTHENTIC", color: C.neuralGreen };
}

// ─── Sub-components ────────────────────────────────────────────────────────

const StatusPill: React.FC<{ phase: AnalysisPhase; message: string }> = ({
  phase,
  message,
}) => {
  const map: Record<AnalysisPhase, { icon: React.ReactNode; color: string }> =
    {
      idle: {
        icon: <Activity size={13} />,
        color: C.textMed,
      },
      connecting: {
        icon: <Wifi size={13} className="animate-pulse" />,
        color: C.electricTeal,
      },
      uploading: {
        icon: (
          <Upload size={13} style={{ animation: "pulse 1s infinite" }} />
        ),
        color: C.electricTeal,
      },
      analyzing: {
        icon: <RefreshCw size={13} className="animate-spin" />,
        color: C.warningOrange,
      },
      complete: {
        icon: <CheckCircle size={13} />,
        color: C.neuralGreen,
      },
      error: {
        icon: <XCircle size={13} />,
        color: C.hyperRed,
      },
    };

  const { icon, color } = map[phase];

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "5px 14px",
        borderRadius: "9999px",
        backgroundColor: `${color}18`,
        border: `1px solid ${color}50`,
        color,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        transition: "all 0.3s ease",
      }}
    >
      {icon}
      {message}
    </div>
  );
};

interface ScoreGaugeProps {
  score: number;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
  const pct = Math.round(score * 100);
  const radius = 38;
  const circ = 2 * Math.PI * radius;
  const dash = circ * (1 - score);
  const color = scoreColor(score);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <svg width="100" height="100" viewBox="0 0 100 100">
        {/* Track */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={C.border}
          strokeWidth="7"
        />
        {/* Progress */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={dash}
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dashoffset 0.8s ease, stroke 0.4s ease" }}
        />
        {/* Glow */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeOpacity="0.25"
          strokeDasharray={circ}
          strokeDashoffset={dash}
          transform="rotate(-90 50 50)"
          filter="blur(3px)"
        />
        {/* Label */}
        <text
          x="50"
          y="45"
          textAnchor="middle"
          fill={color}
          fontFamily="'JetBrains Mono', monospace"
          fontSize="18"
          fontWeight="700"
        >
          {pct}%
        </text>
        <text
          x="50"
          y="60"
          textAnchor="middle"
          fill={C.textMed}
          fontFamily="'JetBrains Mono', monospace"
          fontSize="8"
          letterSpacing="1"
        >
          ANOMALY
        </text>
      </svg>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────

const ImageAnalyzer: React.FC = () => {
  const [phase, setPhase] = useState<AnalysisPhase>("idle");
  const [statusMsg, setStatusMsg] = useState("Drop an image to begin");
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedFrame, setProcessedFrame] = useState<string | null>(null);
  const [bboxes, setBboxes] = useState<BoundingBox[]>([]);
  const [anomalyScore, setAnomalyScore] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [taskId] = useState<string>(generateUUID);

  const wsRef = useRef<WebSocket | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const dropRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ── Cleanup on unmount ────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── WebSocket image analysis ──────────────────────────────────────────
  const analyzeImage = useCallback(
    async (file: File) => {
      // Build local preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Reset state
      setBboxes([]);
      setAnomalyScore(null);
      setProcessedFrame(null);
      setErrorMsg(null);
      setUploadProgress(0);

      setPhase("connecting");
      setStatusMsg("Connecting to analysis server…");

      const wsUrl =
        process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000/ws/task";

      let ws: WebSocket;
      try {
        ws = new WebSocket(wsUrl);
      } catch {
        setPhase("error");
        setErrorMsg("Failed to open WebSocket connection.");
        setStatusMsg("Connection failed");
        return;
      }

      ws.binaryType = "arraybuffer";
      wsRef.current = ws;

      ws.onopen = () => {
        setPhase("uploading");
        setStatusMsg("Sending metadata…");

        // 1. Send metadata JSON
        ws.send(
          JSON.stringify({ task_id: taskId, file_type: "image" })
        );

        // 2. Stream image as ArrayBuffer
        const reader = new FileReader();
        reader.onload = (e) => {
          if (!e.target?.result) return;
          const buf = e.target.result as ArrayBuffer;
          ws.send(buf);
          setUploadProgress(100);
          setStatusMsg("Upload complete — awaiting analysis…");

          // 3. Signal end of image
          ws.send("END");
          setPhase("analyzing");
          setStatusMsg("Analyzing image for deepfake artifacts…");
        };
        reader.readAsArrayBuffer(file);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data as string);

          if (msg.type === "frame_ready") {
            // Backend echoes processed frame
            setProcessedFrame(`data:image/jpeg;base64,${msg.data}`);
          } else if (msg.type === "detection_ready") {
            const result = msg as DetectionResult & { type: string };
            setBboxes(result.bounding_boxes ?? []);
            setAnomalyScore(result.anomaly_score ?? 0);
          } else if (msg.type === "processing_complete") {
            setPhase("complete");
            setStatusMsg("Analysis complete");
            ws.close();
          } else if (msg.type === "error") {
            setPhase("error");
            setErrorMsg(msg.message ?? "Unknown server error");
            setStatusMsg("Analysis error");
            ws.close();
          }
        } catch {
          // Non-JSON control message — ignore
        }
      };

      ws.onerror = () => {
        setPhase("error");
        setErrorMsg("WebSocket connection error.");
        setStatusMsg("Connection error");
      };

      ws.onclose = () => {
        if (phase !== "complete" && phase !== "error") {
          setStatusMsg("Connection closed");
        }
      };
    },
    [taskId, phase]
  );

  // ── File selection handlers ───────────────────────────────────────────
  const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

  const handleFile = useCallback(
    (file: File) => {
      if (!ACCEPTED.includes(file.type)) {
        setPhase("error");
        setErrorMsg("Only JPG, PNG, and WebP images are supported.");
        setStatusMsg("Unsupported file type");
        return;
      }
      analyzeImage(file);
    },
    [analyzeImage]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const reset = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setPhase("idle");
    setStatusMsg("Drop an image to begin");
    setPreviewUrl(null);
    setProcessedFrame(null);
    setBboxes([]);
    setAnomalyScore(null);
    setErrorMsg(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  // ── SVG overlay (relative coords 0-1) ───────────────────────────────
  const svgOverlay = (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
      viewBox="0 0 1 1"
      preserveAspectRatio="none"
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="0.005" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {bboxes.map((bb, i) => {
        const col = scoreColor(bb.score ?? anomalyScore ?? 0);
        return (
          <g key={i} filter="url(#glow)">
            {/* Main box */}
            <rect
              x={bb.x}
              y={bb.y}
              width={bb.w}
              height={bb.h}
              fill="none"
              stroke={col}
              strokeWidth="0.003"
              rx="0.005"
              ry="0.005"
            />
            {/* Corner accents — TL */}
            <line x1={bb.x} y1={bb.y} x2={bb.x + 0.04} y2={bb.y} stroke={col} strokeWidth="0.006" />
            <line x1={bb.x} y1={bb.y} x2={bb.x} y2={bb.y + 0.04} stroke={col} strokeWidth="0.006" />
            {/* Corner accents — TR */}
            <line x1={bb.x + bb.w} y1={bb.y} x2={bb.x + bb.w - 0.04} y2={bb.y} stroke={col} strokeWidth="0.006" />
            <line x1={bb.x + bb.w} y1={bb.y} x2={bb.x + bb.w} y2={bb.y + 0.04} stroke={col} strokeWidth="0.006" />
            {/* Corner accents — BL */}
            <line x1={bb.x} y1={bb.y + bb.h} x2={bb.x + 0.04} y2={bb.y + bb.h} stroke={col} strokeWidth="0.006" />
            <line x1={bb.x} y1={bb.y + bb.h} x2={bb.x} y2={bb.y + bb.h - 0.04} stroke={col} strokeWidth="0.006" />
            {/* Corner accents — BR */}
            <line x1={bb.x + bb.w} y1={bb.y + bb.h} x2={bb.x + bb.w - 0.04} y2={bb.y + bb.h} stroke={col} strokeWidth="0.006" />
            <line x1={bb.x + bb.w} y1={bb.y + bb.h} x2={bb.x + bb.w} y2={bb.y + bb.h - 0.04} stroke={col} strokeWidth="0.006" />

            {/* Label badge */}
            {bb.score !== undefined && (
              <>
                <rect
                  x={bb.x}
                  y={bb.y - 0.04}
                  width={0.14}
                  height={0.038}
                  rx="0.004"
                  fill={col}
                  fillOpacity="0.88"
                />
                <text
                  x={bb.x + 0.005}
                  y={bb.y - 0.012}
                  fill="#08090A"
                  fontSize="0.025"
                  fontFamily="'JetBrains Mono', monospace"
                  fontWeight="700"
                  letterSpacing="0.002"
                >
                  {bb.label ?? "FACE"} · {Math.round(bb.score * 100)}%
                </text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );

  // ── Derived display image ─────────────────────────────────────────────
  const displaySrc = processedFrame ?? previewUrl;
  const verdict = anomalyScore !== null ? verdictFromScore(anomalyScore) : null;
  const isActive = phase !== "idle";

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div
      id="image-analyzer"
      style={{
        minHeight: "100vh",
        backgroundColor: C.deepVoid,
        color: C.textHigh,
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        gap: "28px",
      }}
    >
      {/* ── Header ───────────────────────────────────────────────────── */}
      <header style={{ textAlign: "center", maxWidth: "640px" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: C.gradientBlue,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ZoomIn size={18} color="#fff" />
          </div>
          <h1
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "22px",
              fontWeight: 700,
              letterSpacing: "-0.4px",
              margin: 0,
            }}
          >
            Image Forensic Analyzer
          </h1>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <StatusPill phase={phase} message={statusMsg} />
          {phase !== "idle" && (
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                color: C.textMed,
                letterSpacing: "0.06em",
              }}
            >
              TASK · {taskId.slice(0, 8).toUpperCase()}
            </span>
          )}
        </div>
      </header>

      {/* ── Main panel ───────────────────────────────────────────────── */}
      <main
        style={{
          width: "100%",
          maxWidth: "900px",
          display: "grid",
          gridTemplateColumns: isActive ? "1fr 320px" : "1fr",
          gap: "20px",
          alignItems: "start",
        }}
      >
        {/* ── Drop zone / image viewer ─────────────────────────────── */}
        <div
          ref={dropRef}
          id="image-dropzone"
          onClick={() => !isActive && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            position: "relative",
            borderRadius: "20px",
            overflow: "hidden",
            border: `2px solid ${isDragOver ? C.electricTeal : isActive ? C.borderActive : C.border}`,
            backgroundColor: C.surface,
            aspectRatio: "4/3",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: isActive ? "default" : "pointer",
            transition: "border-color 0.3s ease, box-shadow 0.3s ease",
            boxShadow: isDragOver
              ? `0 0 60px ${C.electricTeal}30`
              : isActive
                ? `0 0 30px rgba(0,0,0,0.6)`
                : "none",
            transform: isDragOver ? "scale(1.01)" : "scale(1)",
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            id="image-file-input"
            accept=".jpg,.jpeg,.png,.webp"
            style={{ display: "none" }}
            onChange={handleInputChange}
          />

          {displaySrc ? (
            <>
              <img
                ref={imgRef}
                src={displaySrc}
                alt="Analysis preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block",
                }}
              />
              {svgOverlay}

              {/* Scanning animation overlay while analyzing */}
              {phase === "analyzing" && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    background:
                      `linear-gradient(to bottom, transparent 0%, ${C.electricTeal}08 50%, transparent 100%)`,
                    animation: "scanline 2.5s ease-in-out infinite",
                  }}
                />
              )}
            </>
          ) : (
            /* Empty drop zone prompt */
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
                padding: "48px",
                userSelect: "none",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "80px",
                  height: "80px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: C.electricTeal,
                    filter: "blur(20px)",
                    opacity: isDragOver ? 0.4 : 0.15,
                    transition: "opacity 0.3s ease",
                  }}
                />
                <Upload
                  size={40}
                  color={isDragOver ? C.electricTeal : C.textMed}
                  style={{
                    transition: "color 0.3s ease",
                    position: "relative",
                  }}
                />
              </div>
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "18px",
                    fontWeight: 600,
                    color: C.textHigh,
                    margin: "0 0 8px",
                  }}
                >
                  {isDragOver ? "Release to analyze" : "Drop an image here"}
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    color: C.textMed,
                    margin: "0 0 4px",
                  }}
                >
                  or{" "}
                  <span
                    style={{
                      color: C.electricTeal,
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    click to browse
                  </span>
                </p>
                <p
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "10px",
                    color: C.textMed,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    margin: 0,
                  }}
                >
                  JPG · PNG · WEBP
                </p>
              </div>
            </div>
          )}

          {/* Upload progress bar (bottom edge) */}
          {phase === "uploading" && uploadProgress < 100 && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: `${uploadProgress}%`,
                height: "3px",
                background: C.gradientBlue,
                borderRadius: "0 2px 0 0",
                transition: "width 0.2s ease",
              }}
            />
          )}
        </div>

        {/* ── Analysis side-panel (only shown when active) ─────────── */}
        {isActive && (
          <aside
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            {/* Verdict card */}
            {verdict && (
              <div
                id="verdict-card"
                style={{
                  padding: "20px",
                  borderRadius: "16px",
                  backgroundColor: C.surface,
                  border: `1px solid ${verdict.color}40`,
                  boxShadow: `0 0 24px ${verdict.color}18`,
                  textAlign: "center",
                  transition: "all 0.4s ease",
                }}
              >
                {verdict.label === "DEEPFAKE DETECTED" ? (
                  <AlertTriangle
                    size={28}
                    color={verdict.color}
                    style={{ margin: "0 auto 10px" }}
                  />
                ) : verdict.label === "LIKELY AUTHENTIC" ? (
                  <CheckCircle
                    size={28}
                    color={verdict.color}
                    style={{ margin: "0 auto 10px" }}
                  />
                ) : (
                  <Activity
                    size={28}
                    color={verdict.color}
                    style={{ margin: "0 auto 10px" }}
                  />
                )}
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: verdict.color,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  {verdict.label}
                </div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "12px",
                    color: C.textMed,
                  }}
                >
                  {anomalyScore !== null &&
                    `Anomaly confidence: ${Math.round(anomalyScore * 100)}%`}
                </div>
              </div>
            )}

            {/* Anomaly score gauge */}
            {anomalyScore !== null && (
              <div
                style={{
                  padding: "20px",
                  borderRadius: "16px",
                  backgroundColor: C.surface,
                  border: `1px solid ${C.border}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "10px",
                    color: C.textMed,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Anomaly Score
                </span>
                <ScoreGauge score={anomalyScore} />
              </div>
            )}

            {/* Analyzing spinner (before detection_ready arrives) */}
            {(phase === "analyzing" || phase === "uploading") &&
              anomalyScore === null && (
                <div
                  style={{
                    padding: "28px",
                    borderRadius: "16px",
                    backgroundColor: C.surface,
                    border: `1px solid ${C.border}`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "14px",
                    color: C.textMed,
                  }}
                >
                  <RefreshCw
                    size={28}
                    color={C.electricTeal}
                    style={{
                      animation: "spin 1.2s linear infinite",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "11px",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {phase === "uploading"
                      ? "Uploading…"
                      : "Running inference…"}
                  </span>
                </div>
              )}

            {/* Detected faces list */}
            {bboxes.length > 0 && (
              <div
                style={{
                  padding: "16px",
                  borderRadius: "16px",
                  backgroundColor: C.surface,
                  border: `1px solid ${C.border}`,
                }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "10px",
                    color: C.textMed,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: "12px",
                  }}
                >
                  Detected Faces · {bboxes.length}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {bboxes.map((bb, i) => {
                    const sc = bb.score ?? anomalyScore ?? 0;
                    const col = scoreColor(sc);
                    return (
                      <div
                        key={i}
                        id={`face-result-${i}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 12px",
                          borderRadius: "10px",
                          backgroundColor: `${col}10`,
                          border: `1px solid ${col}30`,
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: "11px",
                              fontWeight: 600,
                              color: col,
                              letterSpacing: "0.06em",
                            }}
                          >
                            {bb.label ?? `FACE ${i + 1}`}
                          </div>
                          <div
                            style={{
                              fontSize: "10px",
                              color: C.textMed,
                              marginTop: "2px",
                            }}
                          >
                            Score: {(sc * 100).toFixed(1)}%
                          </div>
                        </div>
                        {/* Mini bar */}
                        <div
                          style={{
                            width: "60px",
                            height: "6px",
                            borderRadius: "3px",
                            backgroundColor: C.deepVoid,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${sc * 100}%`,
                              height: "100%",
                              background: col,
                              borderRadius: "3px",
                              transition: "width 0.6s ease",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Error card */}
            {phase === "error" && errorMsg && (
              <div
                style={{
                  padding: "16px",
                  borderRadius: "16px",
                  backgroundColor: `${C.hyperRed}10`,
                  border: `1px solid ${C.hyperRed}40`,
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: C.hyperRed,
                  }}
                >
                  <WifiOff size={14} />
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Error
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "12px",
                    color: C.textMed,
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {errorMsg}
                </p>
              </div>
            )}

            {/* Reset / analyze another */}
            <button
              id="reset-analyzer-btn"
              onClick={reset}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "12px",
                borderRadius: "12px",
                border: `1px solid ${C.border}`,
                backgroundColor: "transparent",
                color: C.textMed,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  C.electricTeal;
                (e.currentTarget as HTMLButtonElement).style.color =
                  C.electricTeal;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  C.border;
                (e.currentTarget as HTMLButtonElement).style.color = C.textMed;
              }}
            >
              <RotateCcw size={14} />
              Analyze Another Image
            </button>
          </aside>
        )}
      </main>

      {/* ── Keyframe animations (injected once) ────────────────────── */}
      <style>{`
        @keyframes scan-line {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
        #image-analyzer * { box-sizing: border-box; }
      `}</style>
    </div>
  );
};

export default ImageAnalyzer;
