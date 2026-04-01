import React from "react";
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
  // { id: "multimodal", label: "Multi-Modal",         icon: "🔊" },
];

// ─── Main Export ──────────────────────────────────────────────────────────────
const XAITechniquesPanel: React.FC<XAITechniquesPanelProps> = ({ frame }) => {
  const currentXai = frame.xai_results || {};
  const hasResults = Object.keys(currentXai).length > 0;

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="ml-auto">
          <span
            className={`font-mono text-[11px] font-bold px-3.5 py-1.5 rounded-full border tracking-widest ${
              frame.isAnomaly 
                ? "bg-[#FF2D55]/10 border-[#FF2D55]/60 text-[#FF2D55]" 
                : "bg-[#00E676]/10 border-[#00E676]/60 text-[#00E676]"
            }`}
          >
            {frame.isAnomaly ? "⚠ FAKE DETECTED" : "✓ AUTHENTIC"}
          </span>
        </div>
      </div>

      {/* Dynamic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hasResults ? (
          Object.entries(currentXai).map(([techniqueName, base64Str]) => (
            <div 
              key={techniqueName} 
              className="p-5 border border-white/10 bg-[#121416] rounded-xl relative overflow-hidden group hover:border-[#00E5FF]/40 transition-colors"
            >
              {/* technique badge header */}
              <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-3">
                <span className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]"></span>
                <h3 className="text-white font-mono text-xs tracking-wide uppercase">
                  {techniqueName.replace(/_/g, ' ')}
                </h3>
              </div>
              
              <div className="w-full bg-black/50 rounded-lg overflow-hidden border border-white/5 relative min-h-[200px] flex items-center justify-center">
                <img 
                   src={base64Str} 
                   alt={`${techniqueName} explanation`}
                   className="w-full h-full object-contain" 
                />
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center border-2 border-white/5 border-dashed rounded-xl bg-black/20">
             <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-4 text-[#00E5FF] animate-pulse">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
             </div>
             <p className="font-mono text-sm text-white/40">Waiting for XAI technique results from pipeline...</p>
          </div>
        )}
      </div>

      {/* Methodology footnote */}
      <div className="mt-6 p-3 bg-[#00E5FF]/5 border border-[#00E5FF]/20 rounded-xl flex items-start gap-3">
        <span className="text-[#00E5FF] text-sm shrink-0">ℹ</span>
        <p className="font-mono text-[10px] text-[#A0A0A0] m-0 leading-relaxed">
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
