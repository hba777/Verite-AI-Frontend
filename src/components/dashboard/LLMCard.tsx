import React, { useState, useEffect, useRef } from "react";
import { Cpu, Loader2 } from "lucide-react";
import { FrameData } from "@/types";

const LoadingSkeleton = () => (
  <div className="space-y-3">
    <div className="h-4 bg-white/10 rounded animate-pulse w-3/4"></div>
    <div className="h-4 bg-white/10 rounded animate-pulse w-1/2"></div>
    <div className="h-4 bg-white/10 rounded animate-pulse w-5/6"></div>
    <div className="flex items-center gap-2 mt-4">
      <Loader2 className="w-4 h-4 text-electric-teal animate-spin" />
      <span className="text-sm font-mono text-electric-teal animate-pulse">
        Generating Analysis...
      </span>
    </div>
  </div>
);

interface LLMCardProps {
  frame: FrameData;
}

const LLMCard: React.FC<LLMCardProps> = ({ frame }) => {
  const [isLlmLoading, setIsLlmLoading] = useState(true);
  const [llmAnalysis, setLlmAnalysis] = useState<string | null>(null);

  // Update loading state when frame changes
  useEffect(() => {
    console.log(`LLMCard: frame.llm_analysis changed:`, frame.llm_analysis);
    if (frame.llm_analysis !== undefined) {
      console.log(`LLMCard: Setting loading to false, analysis:`, frame.llm_analysis);
      setIsLlmLoading(false);
      setLlmAnalysis(frame.llm_analysis || null);
    } else {
      console.log(`LLMCard: Setting loading to true`);
      setIsLlmLoading(true);
    }
  }, [frame]);

  // Format the analysis text with basic markdown
  const formatAnalysis = (text: string) => {
    if (!text) return text;
    return text
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  };


  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-8 relative overflow-hidden group w-full">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-electric-teal to-transparent" />
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-electric-teal/5 rounded-full blur-3xl group-hover:bg-electric-teal/10 transition-colors duration-500"></div>

      <div className="relative z-10 w-full">
        <h4 className="font-mono text-sm text-electric-teal mb-4 uppercase tracking-wider">
          GenD Model Analysis
        </h4>

        {isLlmLoading ? (
          <LoadingSkeleton />
        ) : (
          <div
            className="h-64 overflow-y-auto"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#3b6bff #1a1d21',
            }}
          >
            {llmAnalysis ? (
              <div
                className="font-sans text-base text-text-high leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formatAnalysis(llmAnalysis) }}
              />
            ) : (
              <p className="font-sans text-base text-text-high leading-relaxed">
                Report not available
              </p>
            )}
          </div>
        )}

        {/* Real/Fake Probability Display */}
        <div className="mt-4 flex gap-4">
          <div className="flex-1 bg-black/30 rounded-lg p-3 border border-white/5">
            <div className="text-[10px] font-mono text-text-med uppercase tracking-wider mb-1">
              Real Probability
            </div>
            <div className="text-lg font-display font-bold text-neural-green">
              {((frame.real_prob ?? 0.5) * 100).toFixed(2)}%
            </div>
          </div>
          <div className="flex-1 bg-black/30 rounded-lg p-3 border border-white/5">
            <div className="text-[10px] font-mono text-text-med uppercase tracking-wider mb-1">
              Fake Probability
            </div>
            <div className="text-lg font-display font-bold text-hyper-red">
              {((frame.fake_prob ?? 0.5) * 100).toFixed(2)}%
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/5 flex gap-3">
          {frame.anomalyType && (
            <span className="px-3 py-1 bg-black/40 border border-hyper-red/30 text-hyper-red text-xs font-mono rounded">
              DETECTED: {frame.anomalyType.toUpperCase()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LLMCard;