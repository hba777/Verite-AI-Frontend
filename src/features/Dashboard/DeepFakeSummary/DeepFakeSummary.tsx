import React, { useMemo } from "react";
import { ChartPieDonutText } from "@/components/ui/pie-chart";
import { ChartAreaGradient } from "@/components/ui/area-chart-gradient";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import { Info, Lightbulb, ShieldCheck } from "lucide-react";

type Frame = { frameIndex: number; frameData: string; timestamp: number } & { [key: string]: any };

interface DeepFakeSummaryProps {
  frames: Frame[];
  selectedFrameIndex: number | null;
}

const DeepFakeSummary: React.FC<DeepFakeSummaryProps> = ({ frames, selectedFrameIndex }) => {
  // Build dummy summary data per frame
  type FrameSummary = {
    frameIndex: number;
    confidence: number;
    explanations: { title: string; text: string }[];
  };

  const summaries: Record<number, FrameSummary> = useMemo(() => {
    const map: Record<number, FrameSummary> = {};
    frames.forEach((f, i) => {
      map[f.frameIndex] = {
        frameIndex: f.frameIndex,
        confidence: Math.min(0.99, 0.65 + ((i % 7) * 0.04)),
        explanations: [
          { title: "Why this score?", text: "Model focused on facial blending artifacts and lighting inconsistencies." },
          { title: "Key evidence", text: "Eye reflection mismatch and mouth region temporal jitter detected." },
          { title: "Reliability notes", text: "Confidence calibrated using validation set; consider cross-model agreement." },
        ],
      };
    });
    return map;
  }, [frames]);

  const effectiveIndex = selectedFrameIndex ?? frames[0]?.frameIndex ?? 0;
  const summary = summaries[effectiveIndex];
  const selected = frames.find((f) => f.frameIndex === effectiveIndex) || frames[0];

  if (!selected || !summary) return null;

  return (
    <div className="w-full max-w-3xl mt-6">
      <div className="space-y-4">
        <div className="text-white/90 text-lg font-semibold">Frame Summary</div>
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-4">
          <img
            src={(selected as any)._url ? (selected as any)._url : `data:image/jpeg;base64,${selected.frameData}`}
            alt={`Selected frame ${selected.frameIndex}`}
            className="rounded-lg shadow-lg"
            style={{ width: 370, height: 200, objectFit: "cover" }}
          />
          <img
            src={(selected as any)._url ? (selected as any)._url : `data:image/jpeg;base64,${selected.frameData}`}
            alt={`Selected frame ${selected.frameIndex}`}
            className="rounded-lg shadow-lg"
            style={{ width: 370, height: 200, objectFit: "cover" }}
          />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartPieDonutText confidence={Math.round(summary.confidence * 100)} />
        <ChartAreaGradient />
        </div>

        <BentoGrid className="!grid-cols-3">
          {summary.explanations.map((exp, i) => (
            <BentoCard
              key={i}
              name={exp.title}
              className="col-span-1"
              background={<div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />}
              Icon={i === 0 ? Info : i === 1 ? ShieldCheck : Lightbulb}
              description={exp.text}
              href="#"
              cta=""
            />
          ))}
        </BentoGrid>
      </div>
    </div>
  );
};

export default DeepFakeSummary;


