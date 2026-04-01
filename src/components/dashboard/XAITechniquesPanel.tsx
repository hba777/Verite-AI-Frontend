import React from "react";
import { FrameData } from "@/types";

interface XAITechniquesPanelProps {
  frame: FrameData;
}

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
