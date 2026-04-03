import React, { useRef, useEffect, useCallback, useState } from "react";
import { StftData } from "@/types";

interface AudioSpectrogramCanvasProps {
  /** Downsampled waveform amplitude points (~2 000) */
  waveformSamples: number[];
  /** STFT spectrogram payload from backend */
  stft?: StftData;
  /** Integrated Gradients score vector (one per STFT frame) */
  igScores?: number[];
  /** SHAP score vector (one per STFT frame) */
  shapScores?: number[];
  /** Which XAI overlay is active */
  activeXai: "ig" | "shap" | "none";
  /** HTML5 Audio element ref (for playhead sync) */
  audioRef: React.RefObject<HTMLAudioElement | null>;
  /** Total audio duration in seconds */
  durationSeconds: number;
}

// ─── Inferno colormap (52 stops sampled from matplotlib) ──────────────────────
const INFERNO: [number, number, number][] = [
  [0, 0, 4], [40, 11, 84], [101, 21, 110], [159, 42, 99],
  [212, 72, 66], [245, 125, 21], [252, 178, 22], [252, 255, 164],
];

function infernoColor(t: number): [number, number, number] {
  const clamped = Math.max(0, Math.min(1, t));
  const idx = clamped * (INFERNO.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.min(lo + 1, INFERNO.length - 1);
  const frac = idx - lo;
  return [
    Math.round(INFERNO[lo][0] + frac * (INFERNO[hi][0] - INFERNO[lo][0])),
    Math.round(INFERNO[lo][1] + frac * (INFERNO[hi][1] - INFERNO[lo][1])),
    Math.round(INFERNO[lo][2] + frac * (INFERNO[hi][2] - INFERNO[lo][2])),
  ];
}

// ─── Artifact descriptions for hover tooltip ──────────────────────────────────
const ARTIFACT_LABELS: { threshold: number; label: string }[] = [
  { threshold: 0.9, label: "Phase Discontinuity" },
  { threshold: 0.75, label: "Spectral Artefact" },
  { threshold: 0.6, label: "GAN Compression Noise" },
  { threshold: 0.45, label: "Pitch Inconsistency" },
  { threshold: 0.3, label: "Low Suspicion" },
];

function artifactLabel(score: number): string {
  const abs = Math.abs(score);
  for (const def of ARTIFACT_LABELS) {
    if (abs >= def.threshold) return def.label;
  }
  return "Neutral Region";
}

// ─── Tooltip component ─────────────────────────────────────────────────────────
interface TooltipState {
  x: number; y: number;
  time: string; score: string; label: string;
}

const Tooltip: React.FC<{ tip: TooltipState | null }> = ({ tip }) => {
  if (!tip) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: tip.x + 12,
        top: tip.y - 12,
        background: "rgba(10,10,10,0.92)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 8,
        padding: "8px 12px",
        pointerEvents: "none",
        zIndex: 10,
        minWidth: 160,
      }}
    >
      <p style={{ margin: 0, fontSize: "0.68rem", color: "#A0A0A0", fontFamily: "'Inter',sans-serif", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {tip.time}
      </p>
      <p style={{ margin: "4px 0 0", fontSize: "0.85rem", fontWeight: 700, color: "#FF9A00", fontFamily: "'JetBrains Mono',monospace" }}>
        {tip.score}
      </p>
      <p style={{ margin: "2px 0 0", fontSize: "0.7rem", color: "#D0D0D0", fontFamily: "'Inter',sans-serif" }}>
        {tip.label}
      </p>
    </div>
  );
};

const AudioSpectrogramCanvas: React.FC<AudioSpectrogramCanvasProps> = ({
  waveformSamples,
  stft,
  igScores,
  shapScores,
  activeXai,
  audioRef,
  durationSeconds,
}) => {
  const spectrogramRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLCanvasElement | null>(null);
  const playheadRef = useRef<HTMLCanvasElement | null>(null);
  const waveRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const hotspotThreshold = 0.7;

  // Track container resize
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const xaiScores = activeXai === "ig"
    ? igScores
    : activeXai === "shap"
      ? shapScores
      : undefined;

  // Draw Spectrogram
  useEffect(() => {
    const canvas = spectrogramRef.current;
    if (!canvas || !stft || dimensions.width === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { matrix, db_min, db_max } = stft;
    const freqBins = matrix.length;
    const timeFrames = matrix[0]?.length ?? 0;
    if (!timeFrames) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);

    const W = dimensions.width;
    const H = dimensions.height;
    const cellW = W / timeFrames;
    const cellH = H / freqBins;
    const range = db_max - db_min || 1;

    for (let fi = 0; fi < freqBins; fi++) {
      for (let ti = 0; ti < timeFrames; ti++) {
        const db = matrix[fi][ti];
        const t = (db - db_min) / range;
        const [r, g, b] = infernoColor(t);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        const y = H - (fi + 1) * cellH;
        ctx.fillRect(ti * cellW, y, Math.ceil(cellW), Math.ceil(cellH));
      }
    }
  }, [stft, dimensions.width, dimensions.height]);

  // Draw XAI Overlay
  useEffect(() => {
    const canvas = overlayRef.current;
    if (!canvas || dimensions.width === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    if (!xaiScores || !xaiScores.length) return;

    const W = dimensions.width;
    const H = dimensions.height;
    const timeFrames = xaiScores.length;
    const frameW = W / timeFrames;

    xaiScores.forEach((score, ti) => {
      if (score <= hotspotThreshold) return;
      const intensity = (score - hotspotThreshold) / (1 - hotspotThreshold);

      // SHAP is red, IG is orange
      const color = activeXai === "shap" ? "#7f7f7fff" : "#FF9A00";
      const shadowColor = activeXai === "shap"
        ? `rgba(255, 45, 85, ${0.3 + 0.7 * intensity})`
        : `rgba(255, 140, 0, ${0.3 + 0.7 * intensity})`;

      ctx.save();
      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = 12 * intensity;
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(1, frameW * 0.85);
      ctx.strokeRect(ti * frameW + frameW / 2, 4, 0, H - 8);
      ctx.restore();
    });
  }, [xaiScores, hotspotThreshold, activeXai, dimensions.width, dimensions.height]);

  // Draw Waveform
  useEffect(() => {
    const canvas = waveRef.current;
    if (!canvas || !waveformSamples.length) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const curW = canvas.clientWidth;
    const curH = canvas.clientHeight;

    canvas.width = curW * dpr;
    canvas.height = curH * dpr;
    ctx.scale(dpr, dpr);

    const mid = curH / 2;
    const step = curW / waveformSamples.length;

    ctx.clearRect(0, 0, curW, curH);
    ctx.beginPath();
    ctx.strokeStyle = "#00E5FF";
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.85;

    waveformSamples.forEach((amp, i) => {
      const x = i * step;
      const y = mid - amp * mid * 0.9;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }, [waveformSamples, dimensions.width]);

  // Layer 3: animate playhead
  useEffect(() => {
    const audio = audioRef.current;
    const canvas = playheadRef.current;
    if (!audio || !canvas) return;

    let rafId: number;

    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const dpr = window.devicePixelRatio || 1;
      const curW = canvas.clientWidth;
      const curH = canvas.clientHeight;

      if (canvas.width !== curW * dpr) {
        canvas.width = curW * dpr;
        canvas.height = curH * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, curW, curH);

      const progress = durationSeconds > 0
        ? (audio.currentTime / durationSeconds)
        : 0;
      const x = progress * curW;

      ctx.save();
      ctx.shadowColor = "rgba(0, 229, 255, 0.8)";
      ctx.shadowBlur = 10;
      ctx.strokeStyle = "#00E5FF";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, curH);
      ctx.stroke();
      ctx.restore();

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [audioRef, durationSeconds]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const W = rect.width;

      const frac = Math.max(0, Math.min(1, x / W));
      const timeSec = (frac * durationSeconds).toFixed(2);

      const scores = xaiScores;
      let score = 0;
      if (scores && scores.length) {
        const idx = Math.floor(frac * (scores.length - 1));
        score = scores[idx] ?? 0;
      }

      setTooltip({
        x, y,
        time: `${timeSec} s`,
        score: `${(Math.abs(score) * 100).toFixed(1)}%  ${score >= 0 ? "↑ Fake" : "↓ Real"}`,
        label: artifactLabel(score),
      });
    },
    [xaiScores, durationSeconds],
  );

  const handleMouseLeave = useCallback(() => setTooltip(null), []);

  const LAYERS_STYLE: React.CSSProperties = {
    position: "absolute", top: 0, left: 0,
    width: "100%", height: "100%",
    pointerEvents: "none",
  };

  return (
    <div className="flex flex-col gap-0 w-full">
      <div
        ref={containerRef}
        className="relative w-full h-[200px] cursor-crosshair bg-[#121416]"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <canvas ref={spectrogramRef} className="absolute inset-0 w-full h-full pointer-events-none" />
        <canvas ref={overlayRef} className="absolute inset-0 w-full h-full pointer-events-none" />
        <canvas ref={playheadRef} className="absolute inset-0 w-full h-full pointer-events-none" />
        <Tooltip tip={tooltip} />

        <div className="absolute left-1 top-1 text-[10px] font-mono text-gray-500 pointer-events-none">
          ▲ Freq
        </div>
        <div className="absolute right-1 bottom-1 text-[10px] font-mono text-gray-500 pointer-events-none">
          Time ▶
        </div>
      </div>

      <div className="relative w-full h-[60px] bg-[#08090A]">
        <canvas ref={waveRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      </div>
    </div>
  );
};

export default AudioSpectrogramCanvas;
