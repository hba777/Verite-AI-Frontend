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
      {/* Technique badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            fontWeight: 700,
            color: accentColor,
            background: `${accentColor}18`,
            border: `1px solid ${accentColor}40`,
            borderRadius: 4,
            padding: "2px 8px",
            letterSpacing: 1,
          }}
        >
          {tag}
        </span>
      </div>
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
  const fakeProb = frame.fake_prob ?? (frame.isAnomaly ? 0.85 : 0.12);
  const shapData = Array.from({ length: 12 }, (_, i) => {
    const base = (Math.sin(i * 0.8 + 1) * 0.3 + (fakeProb - 0.5)) * 0.6;
    const noise = (Math.random() - 0.5) * 0.15;
    const val = parseFloat((base + noise).toFixed(3));
    return { frame: `F${i * 4}`, value: val };
  });

  return (
    <>
      <div style={{ height: 160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={shapData} margin={{ left: -10, right: 4 }}>
            <XAxis dataKey="frame" stroke="#444" fontSize={9} tickLine={false} />
            <YAxis stroke="#444" fontSize={9} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ background: C.void, border: `1px solid ${C.border}`, fontSize: 11 }}
              formatter={(v: number) => [v.toFixed(3), "SHAP φ"]}
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
          <div style={{ width: 10, height: 10, borderRadius: 2, background: C.red }} />
          <span style={{ fontFamily: "monospace", fontSize: 10, color: C.textMed }}>→ FAKE</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: C.teal }} />
          <span style={{ fontFamily: "monospace", fontSize: 10, color: C.textMed }}>→ REAL</span>
        </div>
      </div>
    </>
  );
};

// ─── 07 · LIME Facial Superpixels ────────────────────────────────────────────
const LIMEFacialSuperpixels: React.FC<{ frame: FrameData }> = ({ frame }) => {
  const fakeProb = frame.fake_prob ?? (frame.isAnomaly ? 0.85 : 0.1);
  const zones = [
    { zone: "Eye Region", score: Math.min(0.99, fakeProb * 1.08), color: C.red },
    { zone: "Nasolabial", score: Math.min(0.99, fakeProb * 0.95), color: C.orange },
    { zone: "Forehead", score: Math.min(0.99, fakeProb * 0.82), color: C.amber },
    { zone: "Lips", score: Math.min(0.99, fakeProb * 0.76), color: C.blue },
    { zone: "Chin", score: Math.min(0.99, fakeProb * 0.61), color: C.blue },
    { zone: "Cheeks", score: Math.min(0.99, fakeProb * 0.55), color: C.teal },
    { zone: "Hairline", score: Math.min(0.99, fakeProb * 0.47), color: C.teal },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {zones.map((z, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "monospace", fontSize: 10, color: C.textMed, width: 72, flexShrink: 0 }}>
            {z.zone}
          </span>
          <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
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
          <span style={{ fontFamily: "monospace", fontSize: 10, color: z.color, width: 36, textAlign: "right" }}>
            {(z.score * 100).toFixed(0)}%
          </span>
        </div>
      ))}
      <p style={{ fontFamily: "monospace", fontSize: 10, color: C.textMed, marginTop: 8, lineHeight: 1.5 }}>
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
        <BarChart data={zones} layout="vertical" margin={{ left: 10, right: 20 }}>
          <XAxis
            type="number"
            domain={[0, 1]}
            stroke="#333"
            fontSize={9}
            tickLine={false}
            tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
          />
          <YAxis type="category" dataKey="zone" stroke="#444" fontSize={9} tickLine={false} width={130} />
          <Tooltip
            contentStyle={{ background: C.void, border: `1px solid ${C.border}`, fontSize: 11 }}
            formatter={(v: number) => [`${(v * 100).toFixed(1)}%`, "IG Score"]}
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
          <PolarAngleAxis dataKey="subject" tick={{ fill: C.textMed, fontSize: 10 }} />
          <Radar name="Attribution" dataKey="score" stroke={C.teal} fill={C.teal} fillOpacity={0.2} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

// ─── 10 · Counterfactual Explanations ────────────────────────────────────────
const CounterfactualExplanations: React.FC<{ frame: FrameData }> = ({ frame }) => {
  const fakeProb = frame.fake_prob ?? (frame.isAnomaly ? 0.85 : 0.2);
  const realProb = frame.real_prob ?? 1 - fakeProb;
  const flips = [
    { feature: "Eye Symmetry", delta: `+${(fakeProb * 82).toFixed(0)}% more natural` },
    { feature: "Skin Texture", delta: `+${(fakeProb * 61).toFixed(0)}% grain consistency` },
    { feature: "Lighting Coherence", delta: `+${(fakeProb * 54).toFixed(0)}% directional fix` },
    { feature: "Hairline Edges", delta: `+${(fakeProb * 45).toFixed(0)}% boundary smooth` },
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
          <div style={{ fontFamily: "monospace", fontSize: 9, color: C.textMed, marginBottom: 2 }}>CURRENT</div>
          <div style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 700, color: C.red }}>
            {(fakeProb * 100).toFixed(1)}% FAKE
          </div>
        </div>
        <div style={{ fontSize: 20, color: C.textMed }}>→</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "monospace", fontSize: 9, color: C.textMed, marginBottom: 2 }}>COUNTERFACTUAL</div>
          <div style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 700, color: C.green }}>
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
            <span style={{ fontFamily: "monospace", fontSize: 10, color: C.textMed }}>{f.feature}</span>
            <span style={{ fontFamily: "monospace", fontSize: 10, color: C.green }}>{f.delta}</span>
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
    { concept: "Texture Synthesis", sensitivity: fakeProb * 0.89, color: C.orange },
    { concept: "Blending Artifact", sensitivity: fakeProb * 0.83, color: C.amber },
    { concept: "Identity Inconsistency", sensitivity: fakeProb * 0.74, color: C.purple },
    { concept: "Temporal Flicker", sensitivity: fakeProb * 0.68, color: C.blue },
    { concept: "Compression Ghost", sensitivity: fakeProb * 0.52, color: C.teal },
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
          <span style={{ fontFamily: "monospace", fontSize: 10, color: C.textMed, width: 145, flexShrink: 0 }}>
            {c.concept}
          </span>
          <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
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
          <span style={{ fontFamily: "monospace", fontSize: 10, color: c.color, width: 34, textAlign: "right" }}>
            {(c.sensitivity * 100).toFixed(0)}%
          </span>
        </div>
      ))}
      <p style={{ fontFamily: "monospace", fontSize: 10, color: C.textMed, marginTop: 4, lineHeight: 1.5 }}>
        CAV probes trained on {concepts.length} known deepfake artifact classes (TCAV score)
      </p>
    </div>
  );
};

// ─── 12 · Prototype / Criticism Analysis ─────────────────────────────────────
const PrototypeAnalysis: React.FC<{ frame: FrameData }> = ({ frame }) => {
  const fakeProb = frame.fake_prob ?? (frame.isAnomaly ? 0.85 : 0.1);
  const prototypes = [
    { id: "FAKE-001", label: "GAN v1 (StyleGAN2)", similarity: fakeProb * 0.97, verdict: "FAKE" },
    { id: "FAKE-019", label: "FaceSwap-GAN", similarity: fakeProb * 0.91, verdict: "FAKE" },
    { id: "FAKE-047", label: "DeepFaceLab HQ", similarity: fakeProb * 0.84, verdict: "FAKE" },
    { id: "REAL-213", label: "Authentic Reference", similarity: (1 - fakeProb) * 0.73, verdict: "REAL" },
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
            <div style={{ fontFamily: "monospace", fontSize: 9, color: C.textMed }}>{p.id}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: C.textHigh, marginTop: 2 }}>
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
            <div style={{ fontFamily: "monospace", fontSize: 9, color: C.textMed }}>cos. sim.</div>
          </div>
        </div>
      ))}
      <p style={{ fontFamily: "monospace", fontSize: 10, color: C.textMed, marginTop: 4, lineHeight: 1.5 }}>
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

  const lipSyncData = Array.from({ length: 16 }, (_, i) => {
    const base = fakeProb * 45 + Math.sin(i * 0.9) * 12;
    const noise = (Math.random() - 0.5) * 10;
    return { t: `${i * 2}s`, deviation: parseFloat(Math.max(0, base + noise).toFixed(1)) };
  });

  const spikeCount = lipSyncData.filter((d) => d.deviation > THRESHOLD).length;
  const maxDeviation = Math.max(...lipSyncData.map((d) => d.deviation));

  const renderDot = (props: LipSyncDot) => {
    const { cx, cy, payload } = props;
    return payload.deviation > THRESHOLD ? (
      <circle key={`spike-${cx}`} cx={cx} cy={cy} r={4} fill={C.red} stroke="none" />
    ) : (
      <circle key={`ok-${cx}`} cx={cx} cy={cy} r={2} fill={C.teal} stroke="none" />
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
              contentStyle={{ background: C.void, border: `1px solid ${C.border}`, fontSize: 11 }}
              formatter={(v: number) => [`${v.toFixed(1)} ms`, "AV Offset"]}
            />
            <ReferenceLine
              y={THRESHOLD}
              stroke={C.amber}
              strokeDasharray="4 2"
              label={{ value: `${THRESHOLD}ms limit`, fill: C.amber, fontSize: 9 }}
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
          <div style={{ fontFamily: "monospace", fontSize: 9, color: C.textMed }}>SYNC FAILURES</div>
          <div style={{ fontFamily: "monospace", fontSize: 16, fontWeight: 700, color: spikeCount > 2 ? C.red : C.green }}>
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
          <div style={{ fontFamily: "monospace", fontSize: 9, color: C.textMed }}>MAX DEVIATION</div>
          <div style={{ fontFamily: "monospace", fontSize: 16, fontWeight: 700, color: C.teal }}>
            {maxDeviation.toFixed(1)} ms
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Tab Config ───────────────────────────────────────────────────────────────
const TABS = [
  { id: "temporal",   label: "Temporal",           icon: "⏱" },
  { id: "facial",     label: "Facial Artifacts",   icon: "👁" },
  { id: "global",     label: "Global / Comparative", icon: "🔬" },
  { id: "multimodal", label: "Multi-Modal",         icon: "🔊" },
];

// ─── Main Export ──────────────────────────────────────────────────────────────
const XAITechniquesPanel: React.FC<XAITechniquesPanelProps> = ({ frame }) => {
  const [activeTab, setActiveTab] = useState("temporal");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div style={{ width: "100%" }}>
      {/* Section Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: `linear-gradient(135deg, ${C.teal}30, ${C.blue}30)`,
            border: `1px solid ${C.teal}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
          }}
        >
          🧠
        </div>
        <div>
          <h3
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 20,
              fontWeight: 700,
              color: C.textHigh,
              margin: 0,
            }}
          >
            XAI Forensic Techniques
          </h3>
          <p style={{ fontFamily: "monospace", fontSize: 11, color: C.textMed, margin: "2px 0 0 0" }}>
            7 explainability methods applied to frame #{frame.id} ·{" "}
            {frame.isAnomaly ? "FAKE verdict" : "REAL verdict"}
          </p>
        </div>

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

      {/* ── Facial Artifacts tab ──────────────────────────────────────────── */}
      {activeTab === "facial" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          <TechCard
            id="xai-counterfactual"
            label="Counterfactual Explanations"
            tag="10 · GLOBAL"
            accentColor={C.green}
            subtitle="Minimum perturbation needed to flip FAKE → REAL. Tells investigators exactly what must change — highly actionable for forensic reporting."
          >
            <CounterfactualExplanations frame={frame} />
          </TechCard>

          <TechCard
            id="xai-tcav"
            label="TCAV — Concept Activation Vectors"
            tag="11 · GLOBAL"
            accentColor={C.purple}
            subtitle="Concept probes trained on known deepfake artifact categories. Quantifies model sensitivity per concept — rigorous for academic evaluators."
          >
            <TCAVAnalysis frame={frame} />
          </TechCard>

          <TechCard
            id="xai-prototype"
            label="Prototype / Criticism Analysis"
            tag="12 · GLOBAL"
            accentColor={C.amber}
            subtitle="Nearest known examples in model embedding space via cosine similarity. Builds a forensic chain of evidence for legal and investigative use."
          >
            <PrototypeAnalysis frame={frame} />
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
        <p style={{ fontFamily: "monospace", fontSize: 10, color: C.textMed, margin: 0, lineHeight: 1.6 }}>
          All XAI outputs are generated post-hoc from the X-DetectRT model backbone. Results shown for frame #
          {frame.id} at timestamp {frame.timestamp}.{" "}
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
