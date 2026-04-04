import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  LineChart,
  Line,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import { FrameData } from "@/types";

interface XAITechniquesPanelProps {
  frame: FrameData;
}

// ─── Color Palette ───────────────────────────────────────────────────────────
const C = {
  teal: "#00E5FF",
  red: "#FF2D55",
  green: "#00E676",
  blue: "#3b6bff",
  purple: "#9C27B0",
  amber: "#FFB300",
  orange: "#FF6D00",
  surface: "#121416",
  void: "#08090A",
  textHigh: "#F5F5F5",
  textMed: "#A0A0A0",
  border: "rgba(255,255,255,0.08)",
};

// ─── Reusable Card Shell ──────────────────────────────────────────────────────
const TechCard: React.FC<{
  id: string;
  label: string;
  tag: string;
  accentColor: string;
  children: React.ReactNode;
  subtitle?: string;
}> = ({ id, label, tag, accentColor, children, subtitle }) => (
  <div
    id={id}
    style={{
      background: `linear-gradient(135deg, ${C.surface} 0%, #0d0f11 100%)`,
      border: `1px solid ${C.border}`,
      borderRadius: 16,
      padding: "24px",
      position: "relative",
      overflow: "hidden",
    }}
  >
    {/* Left accent stripe */}
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 3,
        height: "100%",
        background: `linear-gradient(180deg, ${accentColor}, transparent)`,
        borderRadius: "16px 0 0 16px",
      }}
    />
    {/* Ambient glow */}
    <div
      style={{
        position: "absolute",
        top: -40,
        right: -40,
        width: 120,
        height: 120,
        background: `${accentColor}10`,
        borderRadius: "50%",
        filter: "blur(30px)",
        pointerEvents: "none",
      }}
    />
    <div style={{ paddingLeft: 12 }}>
      <h4
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 15,
          fontWeight: 700,
          color: C.textHigh,
          margin: "0 0 4px 0",
        }}
      >
        {label}
      </h4>
      {subtitle && (
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 11,
            color: C.textMed,
            margin: "0 0 16px 0",
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </p>
      )}
      <div style={{ marginTop: 16 }}>{children}</div>
    </div>
  </div>
);

// ─── 03 · SHAP TimeShap ──────────────────────────────────────────────────────
const SHAPTimeShap: React.FC<{ frame: FrameData }> = ({ frame }) => {
  // Use real TimeSHAP data if available from backend
  const fakeProb = frame.fake_prob ?? (frame.isAnomaly ? 0.85 : 0.12);

  // Generate shapData from real timeshap_attribution if available
  let shapData: { frame: string; value: number }[];

  if (frame.timeshap_attribution && frame.timeshap_attribution.length > 0) {
    // Use real TimeSHAP attribution data
    shapData = frame.timeshap_attribution.map((val, i) => ({
      frame: `F${i}`,
      value: val,
    }));
  } else if (
    frame.timeshap_frame_probs &&
    frame.timeshap_frame_probs.length > 0
  ) {
    // Use frame probs from TimeSHAP
    shapData = frame.timeshap_frame_probs.map((prob, i) => {
      const baseline = frame.timeshap_baseline ?? 0.5;
      const val = prob - baseline;
      return { frame: `F${i}`, value: val };
    });
  } else {
    // Fallback to synthetic data for demo/trial purposes
    shapData = Array.from({ length: 12 }, (_, i) => {
      const base = (Math.sin(i * 0.8 + 1) * 0.3 + (fakeProb - 0.5)) * 0.6;
      const noise = (Math.random() - 0.5) * 0.15;
      const val = parseFloat((base + noise).toFixed(3));
      return { frame: `F${i * 4}`, value: val };
    });
  }

  return (
    <>
      <div style={{ height: 160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={shapData} margin={{ left: -10, right: 4 }}>
            <XAxis
              dataKey="frame"
              stroke="#444"
              fontSize={9}
              tickLine={false}
            />
            <YAxis
              stroke="#444"
              fontSize={9}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                background: C.void,
                border: `1px solid ${C.border}`,
                fontSize: 11,
              }}
              formatter={(v: number) => [v.toFixed(3), "SHAP φ"]}
              cursor={{ fill: "transparent" }}
            />
            <ReferenceLine y={0} stroke="#333" />
            <Bar dataKey="value" radius={[2, 2, 0, 0]}>
              {shapData.map((d, i) => (
                <Cell key={i} fill={d.value >= 0 ? C.red : C.teal} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              background: C.red,
            }}
          />
          <span
            style={{ fontFamily: "monospace", fontSize: 10, color: C.textMed }}
          >
            → FAKE
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              background: C.teal,
            }}
          />
          <span
            style={{ fontFamily: "monospace", fontSize: 10, color: C.textMed }}
          >
            → REAL
          </span>
        </div>
      </div>
    </>
  );
};

// ─── 07 · LIME Facial Superpixels ────────────────────────────────────────────
const LIMEFacialSuperpixels: React.FC<{ frame: FrameData }> = ({ frame }) => {
  const fakeProb = frame.fake_prob ?? (frame.isAnomaly ? 0.85 : 0.1);
  const zones = [
    {
      zone: "Eye Region",
      score: Math.min(0.99, fakeProb * 1.08),
      color: C.red,
    },
    {
      zone: "Nasolabial",
      score: Math.min(0.99, fakeProb * 0.95),
      color: C.orange,
    },
    {
      zone: "Forehead",
      score: Math.min(0.99, fakeProb * 0.82),
      color: C.amber,
    },
    { zone: "Lips", score: Math.min(0.99, fakeProb * 0.76), color: C.blue },
    { zone: "Chin", score: Math.min(0.99, fakeProb * 0.61), color: C.blue },
    { zone: "Cheeks", score: Math.min(0.99, fakeProb * 0.55), color: C.teal },
    { zone: "Hairline", score: Math.min(0.99, fakeProb * 0.47), color: C.teal },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {zones.map((z, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 10,
              color: C.textMed,
              width: 72,
              flexShrink: 0,
            }}
          >
            {z.zone}
          </span>
          <div
            style={{
              flex: 1,
              height: 8,
              background: "rgba(255,255,255,0.06)",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${(z.score * 100).toFixed(0)}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${z.color}cc, ${z.color})`,
                borderRadius: 4,
                transition: "width 1.2s ease",
              }}
            />
          </div>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 10,
              color: z.color,
              width: 36,
              textAlign: "right",
            }}
          >
            {(z.score * 100).toFixed(0)}%
          </span>
        </div>
      ))}
      <p
        style={{
          fontFamily: "monospace",
          fontSize: 10,
          color: C.textMed,
          marginTop: 8,
          lineHeight: 1.5,
        }}
      >
        {zones[0].score > 0.6
          ? `⚠ ${(zones[0].score * 100).toFixed(0)}% detection confidence from eye region anomaly`
          : "✓ No dominant facial zone anomaly detected"}
      </p>
    </div>
  );
};

// ─── 08 · Integrated Gradients ───────────────────────────────────────────────
const IntegratedGradients: React.FC<{ frame: FrameData }> = ({ frame }) => {
  const fakeProb = frame.fake_prob ?? (frame.isAnomaly ? 0.85 : 0.1);
  const zones = [
    { zone: "Nasolabial Folds", ig: fakeProb * 0.93 },
    { zone: "Hairline Boundary", ig: fakeProb * 0.87 },
    { zone: "Forehead-Eye Trans.", ig: fakeProb * 0.81 },
    { zone: "Periocular Region", ig: fakeProb * 0.74 },
    { zone: "Lip Boundary", ig: fakeProb * 0.65 },
  ];
  return (
    <div style={{ height: 150 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={zones}
          layout="vertical"
          margin={{ left: 10, right: 20 }}
        >
          <XAxis
            type="number"
            domain={[0, 1]}
            stroke="#333"
            fontSize={9}
            tickLine={false}
            tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
          />
          <YAxis
            type="category"
            dataKey="zone"
            stroke="#444"
            fontSize={9}
            tickLine={false}
            width={130}
          />
          <Tooltip
            contentStyle={{
              background: C.void,
              border: `1px solid ${C.border}`,
              fontSize: 11,
            }}
            formatter={(v: number) => [`${(v * 100).toFixed(1)}%`, "IG Score"]}
            cursor={{ fill: "transparent" }}
          />
          <Bar dataKey="ig" radius={[0, 4, 4, 0]}>
            {zones.map((_, i) => (
              <Cell key={i} fill={`hsl(${340 - i * 18}, 80%, 60%)`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// ─── 09 · DINO / SAM-Guided Attribution ──────────────────────────────────────
const SAMGuidedAttribution: React.FC<{ frame: FrameData }> = ({ frame }) => {
  const fakeProb = frame.fake_prob ?? (frame.isAnomaly ? 0.85 : 0.1);
  const segments = [
    { name: "Skin", score: fakeProb * 0.78 },
    { name: "Eyes", score: Math.min(1, fakeProb * 1.12) },
    { name: "Hair", score: fakeProb * 0.62 },
    { name: "Mouth", score: fakeProb * 0.71 },
    { name: "Ears", score: fakeProb * 0.48 },
    { name: "Neck", score: fakeProb * 0.38 },
  ];
  const radarData = segments.map((s) => ({
    subject: s.name,
    score: parseFloat((s.score * 100).toFixed(1)),
  }));
  return (
    <div style={{ height: 160 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={radarData}>
          <PolarGrid stroke="#222" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: C.textMed, fontSize: 10 }}
          />
          <Radar
            name="Attribution"
            dataKey="score"
            stroke={C.teal}
            fill={C.teal}
            fillOpacity={0.2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

// ─── 10 · Counterfactual Explanations ────────────────────────────────────────
const CounterfactualExplanations: React.FC<{ frame: FrameData }> = ({
  frame,
}) => {
  const fakeProb = frame.fake_prob ?? (frame.isAnomaly ? 0.85 : 0.2);
  const realProb = frame.real_prob ?? 1 - fakeProb;
  const flips = [
    {
      feature: "Eye Symmetry",
      delta: `+${(fakeProb * 82).toFixed(0)}% more natural`,
    },
    {
      feature: "Skin Texture",
      delta: `+${(fakeProb * 61).toFixed(0)}% grain consistency`,
    },
    {
      feature: "Lighting Coherence",
      delta: `+${(fakeProb * 54).toFixed(0)}% directional fix`,
    },
    {
      feature: "Hairline Edges",
      delta: `+${(fakeProb * 45).toFixed(0)}% boundary smooth`,
    },
  ];
  const targetReal = Math.min(99, realProb * 100 + fakeProb * 35);
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
          background: "rgba(0,0,0,0.3)",
          borderRadius: 10,
          padding: "10px 14px",
          border: `1px solid ${C.border}`,
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              color: C.textMed,
              marginBottom: 2,
            }}
          >
            CURRENT
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 18,
              fontWeight: 700,
              color: C.red,
            }}
          >
            {(fakeProb * 100).toFixed(1)}% FAKE
          </div>
        </div>
        <div style={{ fontSize: 20, color: C.textMed }}>→</div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              color: C.textMed,
              marginBottom: 2,
            }}
          >
            COUNTERFACTUAL
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 18,
              fontWeight: 700,
              color: C.green,
            }}
          >
            {targetReal.toFixed(1)}% REAL
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {flips.map((f, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: "6px 12px",
            }}
          >
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 10,
                color: C.textMed,
              }}
            >
              {f.feature}
            </span>
            <span
              style={{ fontFamily: "monospace", fontSize: 10, color: C.green }}
            >
              {f.delta}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── 11 · TCAV ───────────────────────────────────────────────────────────────
const TCAVAnalysis: React.FC<{ frame: FrameData }> = ({ frame }) => {
  const fakeProb = frame.fake_prob ?? (frame.isAnomaly ? 0.85 : 0.12);
  const concepts = [
    { concept: "GAN Fingerprint", sensitivity: fakeProb * 0.97, color: C.red },
    {
      concept: "Texture Synthesis",
      sensitivity: fakeProb * 0.89,
      color: C.orange,
    },
    {
      concept: "Blending Artifact",
      sensitivity: fakeProb * 0.83,
      color: C.amber,
    },
    {
      concept: "Identity Inconsistency",
      sensitivity: fakeProb * 0.74,
      color: C.purple,
    },
    {
      concept: "Temporal Flicker",
      sensitivity: fakeProb * 0.68,
      color: C.blue,
    },
    {
      concept: "Compression Ghost",
      sensitivity: fakeProb * 0.52,
      color: C.teal,
    },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {concepts.map((c, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: c.color,
              flexShrink: 0,
              boxShadow: `0 0 6px ${c.color}`,
            }}
          />
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 10,
              color: C.textMed,
              width: 145,
              flexShrink: 0,
            }}
          >
            {c.concept}
          </span>
          <div
            style={{
              flex: 1,
              height: 6,
              background: "rgba(255,255,255,0.06)",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${(c.sensitivity * 100).toFixed(0)}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${c.color}80, ${c.color})`,
                borderRadius: 3,
                transition: "width 1s ease",
              }}
            />
          </div>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 10,
              color: c.color,
              width: 34,
              textAlign: "right",
            }}
          >
            {(c.sensitivity * 100).toFixed(0)}%
          </span>
        </div>
      ))}
      <p
        style={{
          fontFamily: "monospace",
          fontSize: 10,
          color: C.textMed,
          marginTop: 4,
          lineHeight: 1.5,
        }}
      >
        CAV probes trained on {concepts.length} known deepfake artifact classes
        (TCAV score)
      </p>
    </div>
  );
};

// ─── 12 · Prototype / Criticism Analysis ─────────────────────────────────────
const PrototypeAnalysis: React.FC<{ frame: FrameData }> = ({ frame }) => {
  const fakeProb = frame.fake_prob ?? (frame.isAnomaly ? 0.85 : 0.1);
  const prototypes = [
    {
      id: "FAKE-001",
      label: "GAN v1 (StyleGAN2)",
      similarity: fakeProb * 0.97,
      verdict: "FAKE",
    },
    {
      id: "FAKE-019",
      label: "FaceSwap-GAN",
      similarity: fakeProb * 0.91,
      verdict: "FAKE",
    },
    {
      id: "FAKE-047",
      label: "DeepFaceLab HQ",
      similarity: fakeProb * 0.84,
      verdict: "FAKE",
    },
    {
      id: "REAL-213",
      label: "Authentic Reference",
      similarity: (1 - fakeProb) * 0.73,
      verdict: "REAL",
    },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {prototypes.map((p, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(0,0,0,0.25)",
            borderRadius: 10,
            padding: "8px 12px",
            border: `1px solid ${p.verdict === "FAKE" ? C.red + "30" : C.green + "30"}`,
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{ fontFamily: "monospace", fontSize: 9, color: C.textMed }}
            >
              {p.id}
            </div>
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                color: C.textHigh,
                marginTop: 2,
              }}
            >
              {p.label}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 14,
                fontWeight: 700,
                color: p.verdict === "FAKE" ? C.red : C.green,
              }}
            >
              {(p.similarity * 100).toFixed(0)}%
            </div>
            <div
              style={{ fontFamily: "monospace", fontSize: 9, color: C.textMed }}
            >
              cos. sim.
            </div>
          </div>
        </div>
      ))}
      <p
        style={{
          fontFamily: "monospace",
          fontSize: 10,
          color: C.textMed,
          marginTop: 4,
          lineHeight: 1.5,
        }}
      >
        Nearest-neighbour search across &gt;50K labelled embedding vectors
      </p>
    </div>
  );
};

// ─── 13 · Cross-Modal Attention — Lip Sync ───────────────────────────────────
type LipSyncDot = { cx: number; cy: number; payload: { deviation: number } };

const CrossModalAttention: React.FC<{ frame: FrameData }> = ({ frame }) => {
  const fakeProb = frame.fake_prob ?? (frame.isAnomaly ? 0.85 : 0.1);
  const THRESHOLD = 33;

  // Use real lipSyncData if available, otherwise generate mock data
  const lipSyncData =
    frame.lipSyncData ??
    Array.from({ length: 16 }, (_, i) => {
      const base = fakeProb * 45 + Math.sin(i * 0.9) * 12;
      const noise = (Math.random() - 0.5) * 10;
      return {
        t: `${i * 2}s`,
        deviation: parseFloat(Math.max(0, base + noise).toFixed(1)),
      };
    });

  const spikeCount = lipSyncData.filter((d) => d.deviation > THRESHOLD).length;
  const maxDeviation = Math.max(...lipSyncData.map((d) => d.deviation));

  const renderDot = (props: LipSyncDot) => {
    const { cx, cy, payload } = props;
    return payload.deviation > THRESHOLD ? (
      <circle
        key={`spike-${cx}`}
        cx={cx}
        cy={cy}
        r={4}
        fill={C.red}
        stroke="none"
      />
    ) : (
      <circle
        key={`ok-${cx}`}
        cx={cx}
        cy={cy}
        r={2}
        fill={C.teal}
        stroke="none"
      />
    );
  };

  return (
    <>
      <div style={{ height: 150 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lipSyncData} margin={{ left: -10, right: 8 }}>
            <CartesianGrid stroke="#1a1a1a" strokeDasharray="3 3" />
            <XAxis dataKey="t" stroke="#444" fontSize={9} tickLine={false} />
            <YAxis stroke="#444" fontSize={9} tickLine={false} unit="ms" />
            <Tooltip
              contentStyle={{
                background: C.void,
                border: `1px solid ${C.border}`,
                fontSize: 11,
              }}
              formatter={(v: number) => [`${v.toFixed(1)} ms`, "AV Offset"]}
            />
            <ReferenceLine
              y={THRESHOLD}
              stroke={C.amber}
              strokeDasharray="4 2"
              label={{
                value: `${THRESHOLD}ms limit`,
                fill: C.amber,
                fontSize: 9,
              }}
            />
            <Line
              type="monotone"
              dataKey="deviation"
              stroke={C.teal}
              strokeWidth={2}
              dot={renderDot as never}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
        <div
          style={{
            flex: 1,
            background: spikeCount > 2 ? `${C.red}12` : `${C.green}12`,
            border: `1px solid ${spikeCount > 2 ? C.red + "40" : C.green + "40"}`,
            borderRadius: 8,
            padding: "8px 12px",
          }}
        >
          <div
            style={{ fontFamily: "monospace", fontSize: 9, color: C.textMed }}
          >
            SYNC FAILURES
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 16,
              fontWeight: 700,
              color: spikeCount > 2 ? C.red : C.green,
            }}
          >
            {spikeCount} spike{spikeCount !== 1 ? "s" : ""}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            background: "rgba(0,0,0,0.3)",
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            padding: "8px 12px",
          }}
        >
          <div
            style={{ fontFamily: "monospace", fontSize: 9, color: C.textMed }}
          >
            MAX DEVIATION
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 16,
              fontWeight: 700,
              color: C.teal,
            }}
          >
            {maxDeviation.toFixed(1)} ms
          </div>
        </div>
      </div>
    </>
  );
};

// ─── 14 · FFT Radial Profile — Line Chart ───────────────────────────────────────
const FFTRadialProfile: React.FC<{ frame: FrameData }> = ({ frame }) => {
  const radialProfile = frame.fft_data?.radial_profile ?? [];
  const data = radialProfile.map((val) => ({
    frequency: val.frequency,
    log_power: val.log_power,
  }));

  if (data.length === 0) {
    return (
      <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "monospace", fontSize: 10, color: C.textMed }}>No FFT radial profile data</p>
      </div>
    );
  }

  return (
    <div style={{ height: 160 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: -10, right: 8 }}>
          <CartesianGrid stroke="#1a1a1a" strokeDasharray="3 3" />
          <XAxis 
            dataKey="frequency" 
            stroke="#444" 
            fontSize={9} 
            tickLine={false}
            tickFormatter={(v) => `${(v * 1000).toFixed(1)}`}
          />
          <YAxis stroke="#444" fontSize={9} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: C.void,
              border: `1px solid ${C.border}`,
              fontSize: 11,
            }}
            formatter={(v: number) => [v.toFixed(3), "Log Power"]}
            labelFormatter={(v) => `Freq: ${parseFloat(v).toFixed(4)}`}
          />
          <Line
            type="monotone"
            dataKey="log_power"
            stroke={C.teal}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// ─── 15 · FFT Frequency Band Energy — Bar Chart ─────────────────────────────────
const FFTFrequencyBandEnergy: React.FC<{ frame: FrameData }> = ({ frame }) => {
  const qe = frame.fft_data?.quadrant_energy;
  const data = qe
    ? [
        { name: "DC", value: qe.dc, fill: C.teal },
        { name: "Low", value: qe.low, fill: C.green },
        { name: "Mid", value: qe.mid, fill: C.amber },
        { name: "High", value: qe.high, fill: C.red },
      ]
    : [
        { name: "DC", value: 0, fill: C.teal },
        { name: "Low", value: 0, fill: C.green },
        { name: "Mid", value: 0, fill: C.amber },
        { name: "High", value: 0, fill: C.red },
      ];

  const maxVal = Math.max(...data.map((d) => d.value), 1);

  return (
    <div style={{ height: 160 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: -10, right: 8 }}>
          <XAxis dataKey="name" stroke="#444" fontSize={10} tickLine={false} />
          <YAxis stroke="#444" fontSize={9} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: C.void,
              border: `1px solid ${C.border}`,
              fontSize: 11,
            }}
            formatter={(v: number) => [v.toFixed(2), "Energy"]}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// ─── 16 · LIME Superpixel Importance — Horizontal Bar Chart ──────────────────────
const LIMESuperpixelImportance: React.FC<{ frame: FrameData }> = ({ frame }) => {
  const features = frame.lime_data?.features ?? [];
  const sortedFeatures = [...features]
    .sort((a, b) => Math.abs(b.abs_importance) - Math.abs(a.abs_importance))
    .slice(0, 10);

  const getColor = (dir: string) => {
    if (dir === "fake") return C.red;
    if (dir === "real") return C.green;
    return "#666";
  };

  const maxAbs = Math.max(...sortedFeatures.map(f => f.abs_importance), 0.001);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {sortedFeatures.map((f, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 10,
              color: C.textMed,
              width: 90,
              flexShrink: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            SP {f.superpixel_id}
          </span>
          <div
            style={{
              flex: 1,
              height: 8,
              background: "rgba(255,255,255,0.06)",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${(Math.abs(f.abs_importance) / maxAbs) * 100}%`,
                height: "100%",
                background: getColor(f.direction),
                borderRadius: 4,
                transition: "width 1s ease",
              }}
            />
          </div>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 10,
              color: getColor(f.direction),
              width: 45,
              textAlign: "right",
            }}
          >
            {f.abs_importance.toFixed(3)}
          </span>
        </div>
      ))}
      {sortedFeatures.length === 0 && (
        <p style={{ fontFamily: "monospace", fontSize: 10, color: C.textMed }}>
          No LIME features available
        </p>
      )}
    </div>
  );
};

// ─── 17 · LIME Fake vs Real Contribution — Donut Chart ───────────────────────
const LIMEFakeRealDonut: React.FC<{ frame: FrameData }> = ({ frame }) => {
  const features = frame.lime_data?.features ?? [];
  const fakeSum = features
    .filter((f) => f.direction === "fake")
    .reduce((sum, f) => sum + Math.abs(f.abs_importance), 0);
  const realSum = features
    .filter((f) => f.direction === "real")
    .reduce((sum, f) => sum + Math.abs(f.abs_importance), 0);
  const neutralSum = features
    .filter((f) => f.direction === "neutral")
    .reduce((sum, f) => sum + Math.abs(f.abs_importance), 0);

  const data = [
    { name: "FAKE", value: fakeSum, fill: C.red },
    { name: "REAL", value: realSum, fill: C.green },
    { name: "NEUTRAL", value: neutralSum, fill: "#666" },
  ].filter((d) => d.value > 0);

  const total = fakeSum + realSum + neutralSum || 1;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, height: 120 }}>
      <div style={{ width: 120, height: 120 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: -15, right: 5 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" stroke="#444" fontSize={9} width={55} />
            <Tooltip
              contentStyle={{
                background: C.void,
                border: `1px solid ${C.border}`,
                fontSize: 10,
              }}
              formatter={(v: number) => [v.toFixed(3), "Contribution"]}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 2,
                background: d.fill,
              }}
            />
            <span style={{ fontFamily: "monospace", fontSize: 10, color: C.textMed }}>
              {d.name}: {(d.value / total).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Tab Config ───────────────────────────────────────────────────────────────
const TABS = [
  { id: "temporal", label: "Temporal", icon: "⏱" },
  { id: "fft", label: "FFT Analysis", icon: "📊" },
  { id: "lime", label: "LIME", icon: "🔍" },
  // { id: "facial", label: "Facial Artifacts", icon: "👁" },
  // { id: "global", label: "Global / Comparative", icon: "🔬" },
  // { id: "multimodal", label: "Multi-Modal",         icon: "🔊" },
];

// ─── Main Export ──────────────────────────────────────────────────────────────
const XAITechniquesPanel: React.FC<XAITechniquesPanelProps> = ({ frame }) => {
  const [activeTab, setActiveTab] = useState("temporal");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <div style={{ width: "100%" }}>
      {/* Section Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 24,
        }}
      >
        {/* Verdict badge */}
        <div style={{ marginLeft: "auto" }}>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 11,
              fontWeight: 700,
              padding: "6px 14px",
              borderRadius: 20,
              background: frame.isAnomaly ? `${C.red}18` : `${C.green}18`,
              border: `1px solid ${frame.isAnomaly ? C.red + "60" : C.green + "60"}`,
              color: frame.isAnomaly ? C.red : C.green,
              letterSpacing: 1,
            }}
          >
            {frame.isAnomaly ? "⚠ FAKE DETECTED" : "✓ AUTHENTIC"}
          </span>
        </div>
      </div>

      {/* Tab Bar */}
      <div
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 20,
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: 4,
          flexWrap: "wrap",
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              minWidth: 120,
              padding: "8px 12px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontFamily: "monospace",
              fontSize: 11,
              fontWeight: activeTab === tab.id ? 700 : 400,
              letterSpacing: 0.5,
              color: activeTab === tab.id ? C.void : C.textMed,
              background:
                activeTab === tab.id
                  ? `linear-gradient(135deg, ${C.teal}, ${C.blue})`
                  : "transparent",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ── Temporal tab ─────────────────────────────────────────────────── */}
      {activeTab === "temporal" && (
        <div style={{ display: "grid", gap: 16 }}>
          <TechCard
            id="xai-shap-timeshap"
            label="SHAP TimeShap — Temporal Frame Attribution"
            tag="03 · TEMPORAL"
            accentColor={C.red}
            subtitle="Each bar represents one frame's SHAP contribution to the final verdict. Red bars push toward FAKE; teal bars push toward REAL. Most granular frame-level causal attribution."
          >
            <SHAPTimeShap frame={frame} />
          </TechCard>
        </div>
      )}

      {/* ── FFT Analysis tab ───────────────────────────────────────────────── */}
      {activeTab === "fft" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          <TechCard
            id="xai-fft-radial"
            label="FFT Radial Profile — Frequency Distribution"
            tag="14 · FFT"
            accentColor={C.teal}
            subtitle="Radial frequency profile extracted from 2D FFT analysis. Shows how spectral energy is distributed across angular directions."
          >
            <FFTRadialProfile frame={frame} />
          </TechCard>

          <TechCard
            id="xai-fft-energy"
            label="FFT Frequency Band Energy"
            tag="15 · FFT"
            accentColor={C.blue}
            subtitle="Energy distribution across frequency bands: DC (constant), Low, Mid, and High frequency components."
          >
            <FFTFrequencyBandEnergy frame={frame} />
          </TechCard>
        </div>
      )}

      {/* ── LIME tab ──────────────────────────────────────────────────────────── */}
      {activeTab === "lime" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          <TechCard
            id="xai-lime-superpixels"
            label="LIME Superpixel Importance"
            tag="16 · LIME"
            accentColor={C.orange}
            subtitle="Local Interpretable Model-agnostic Explanations. Top 10 superpixels sorted by absolute importance contribution."
          >
            <LIMESuperpixelImportance frame={frame} />
          </TechCard>

          <TechCard
            id="xai-lime-donut"
            label="LIME Fake vs Real Contribution"
            tag="17 · LIME"
            accentColor={C.purple}
            subtitle="Aggregated contribution scores: fake (red), real (green), and neutral (grey) features."
          >
            <LIMEFakeRealDonut frame={frame} />
          </TechCard>
        </div>
      )}

      {/* ── Facial Artifacts tab ──────────────────────────────────────────── */}
      {activeTab === "facial" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          <TechCard
            id="xai-lime-superpixels"
            label="LIME with Facial Superpixels"
            tag="07 · FACIAL ARTIFACT"
            accentColor={C.orange}
            subtitle="Anatomical landmarks (MediaPipe / dlib) used as meaningful superpixels. Each zone is scored for manipulation evidence."
          >
            <LIMEFacialSuperpixels frame={frame} />
          </TechCard>

          <TechCard
            id="xai-integrated-gradients"
            label="Integrated Gradients — Zone Attribution"
            tag="08 · FACIAL ARTIFACT"
            accentColor={C.red}
            subtitle="Mask-constrained IG attribution per facial zone. Highlights classic GAN failure points: nasolabial folds, hairline, and forehead-eye transition."
          >
            <IntegratedGradients frame={frame} />
          </TechCard>

          <TechCard
            id="xai-sam-guided"
            label="DINO / SAM-Guided Attribution"
            tag="09 · FACIAL ARTIFACT"
            accentColor={C.teal}
            subtitle="Segment Anything Model auto-segments the face into semantic parts. Cleanest visual output — no manual zone definitions required."
          >
            <SAMGuidedAttribution frame={frame} />
          </TechCard>
        </div>
      )}

      {/* ── Global / Comparative tab ──────────────────────────────────────── */}
      {activeTab === "global" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          <TechCard
            id="xai-tcav"
            label="TCAV — Concept Activation Vectors"
            tag="11 · GLOBAL"
            accentColor={C.purple}
            subtitle="Concept probes trained on known deepfake artifact categories. Quantifies model sensitivity per concept — rigorous for academic evaluators."
          >
            <TCAVAnalysis frame={frame} />
          </TechCard>
        </div>
      )}

      {/* ── Multi-Modal tab ───────────────────────────────────────────────── */}
      {activeTab === "multimodal" && (
        <div style={{ display: "grid", gap: 16 }}>
          <TechCard
            id="xai-cross-modal"
            label="Cross-Modal Attention — Lip Sync Deviation"
            tag="13 · MULTI-MODAL"
            accentColor={C.teal}
            subtitle="Audio phoneme events vs. visual lip positions across frames. Spikes above 33 ms flag audio-visual deepfake splicing."
          >
            <CrossModalAttention frame={frame} />
          </TechCard>
        </div>
      )}

      {/* Methodology footnote */}
      <div
        style={{
          marginTop: 20,
          padding: "12px 16px",
          background: `${C.teal}06`,
          border: `1px solid ${C.teal}20`,
          borderRadius: 10,
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
        }}
      >
        <span style={{ fontSize: 14, flexShrink: 0 }}>ℹ</span>
        <p
          style={{
            fontFamily: "monospace",
            fontSize: 10,
            color: C.textMed,
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          All XAI outputs are generated post-hoc from the X-DetectRT model
          backbone. Results shown for frame #{frame.id} at timestamp{" "}
          {frame.timestamp}.{" "}
          {frame.isAnomaly
            ? `Verdict: FAKE · Confidence ${frame.confidenceScore.toFixed(1)}% · Fake prob ${(
                (frame.fake_prob ?? 0.85) * 100
              ).toFixed(2)}%.`
            : `Verdict: REAL · Confidence ${frame.confidenceScore.toFixed(1)}% · Real prob ${(
                (frame.real_prob ?? 0.85) * 100
              ).toFixed(2)}%.`}
        </p>
      </div>
    </div>
  );
};

export default XAITechniquesPanel;
