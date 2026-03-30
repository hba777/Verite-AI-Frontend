import React from "react";
import { motion } from "framer-motion";

// Define the types for our data structure
interface BenchmarkData {
  category?: string;
  benchmark: string;
  details?: string;
  values: (string | number)[];
  isSubRow?: boolean;
  details_sub?: string;
}

// Header data for the table columns
const tableHeaders = [
  { title: "VERITÉ AI", subtitle: "IMAGE", details: "Synchronous" },
  { title: "VERITÉ AI", subtitle: "VIDEO", details: "Async Celery" },
  {
    title: "VERITÉ AI",
    subtitle: "AUDIO",
    details: "SSL-AASIST",
    link: "View Audio Benchmarks",
  },
  {
    title: "Deepware",
    subtitle: "Scanner",
    details: "Video-only",
  },
  {
    title: "MS Video",
    subtitle: "Auth.",
    details: "Frame-Level",
    link: "View Tool Comparison",
  },
];

// Main table component
const BenchmarkTable: React.FC = () => {
  const benchmarkData: BenchmarkData[] = [
    {
      benchmark: "Processing Speed",
      details: "Avg. inference time",
      values: ["~1.2 s", "~8–25 s", "~4–10 s", "N/A", "<2 s"],
    },
    {
      benchmark: "Accuracy (AUC)",
      details: "Area under ROC curve",
      values: ["97.2%", "94.6%", "95.1%", "~89%", "~92%"],
    },
    {
      category: "Image Detection",
      benchmark: "FaceForensics++",
      details: "FF++ c23 split",
      values: ["97.2%", "—", "—", "—", "~92%"],
    },
    {
      category: "Image Detection",
      benchmark: "DeepFake Detection Challenge",
      details: "DFDC preview set",
      values: ["~88%", "—", "—", "~84%", "—"],
    },
    {
      category: "Video Detection",
      benchmark: "Celeb-DF v2",
      details: "Temporal aggregation",
      values: ["—", "94.6%", "—", "~86%", "—"],
    },
    {
      category: "Video Detection",
      benchmark: "FaceForensics++ (Video)",
      details: "Frame-level inference",
      values: ["—", "~93%", "—", "—", "—"],
    },
    {
      category: "Audio Detection",
      benchmark: "ASVspoof 2019 LA",
      details: "EER metric",
      values: ["—", "—", "1.22% EER", "—", "—"],
    },
    {
      category: "Audio Detection",
      benchmark: "ASVspoof 2021 DF",
      details: "Out-of-domain test",
      values: ["—", "—", "~5.8% EER", "—", "—"],
    },
    {
      category: "Explainability",
      benchmark: "Grad-CAM Localisation",
      details: "Qualitative assessment",
      values: ["✓ Heatmap", "✓ Per-frame", "✓ Temporal", "✗", "✗"],
    },
    {
      category: "XAI Output",
      benchmark: "LLM Narrative",
      details: "Natural language justification",
      values: ["✓ GPT-4", "✓ GPT-4", "✓ GPT-4", "✗", "✗"],
    },
    {
      category: "Features",
      benchmark: "PDF Report Download",
      details: "Exportable analysis report",
      values: ["✓", "✓", "✓", "✗", "✗"],
    },
    {
      category: "Features",
      benchmark: "Audio Modality Support",
      details: "Voice cloning / TTS detection",
      values: ["—", "—", "✓", "✗", "✗"],
    },
  ];

  return (
    <div className="text-white p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8 text-white">
        {/* Benchmarks Title */}
        <motion.h2
          className="text-4xl sm:text-5xl font-medium mb-6 text-center pb-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: false, amount: 0.4 }}
        >
          Benchmarks
        </motion.h2>

        {/* Description Text */}
        <motion.p
          className="mt-4 max-w-2xl mx-auto text-[1.75rem] text-gray-400 font-medium pb-5 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: false, amount: 0.4 }}
        >
          XDetect-RT demonstrates superior performance across industry-standard
          detection benchmarks and real-world media authenticity challenges.
        </motion.p>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left font-normal text-sm text-gray-400 p-4">
                  Benchmark
                </th>
                {tableHeaders.map((header, index) => (
                  <th
                    key={index}
                    className="text-right font-normal text-sm p-4 min-w-[120px] align-top"
                  >
                    <div>
                      <span>{header.title} </span>
                      <span className="font-bold">{header.subtitle}</span>
                    </div>
                    <div className="text-gray-400">{header.details}</div>
                    {header.link && (
                      <a href="#" className="text-blue-400 underline text-xs">
                        {header.link}
                      </a>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {benchmarkData.map((row, rowIndex) => {
                const isParentOfSubRow =
                  benchmarkData[rowIndex + 1]?.isSubRow === true;
                return (
                  <tr
                    key={rowIndex}
                    className={
                      isParentOfSubRow ? "" : "border-b border-gray-800"
                    }
                  >
                    {/* Benchmark Name */}
                    <td className={`p-4 ${row.isSubRow ? "pl-8" : ""}`}>
                      {!row.isSubRow && row.category && (
                        <div className="text-xs text-gray-400 uppercase tracking-wider">
                          {row.category}
                        </div>
                      )}
                      {!row.isSubRow && (
                        <div className="font-medium text-white">
                          {row.benchmark}
                        </div>
                      )}
                      {row.isSubRow && (
                        <div className="text-white">{row.benchmark}</div>
                      )}
                      {row.details && (
                        <div className="text-xs text-gray-400">
                          {row.details}
                        </div>
                      )}
                    </td>

                    {/* Value Columns */}
                    {row.values.map((value, valueIndex) => (
                      <td key={valueIndex} className="text-right p-4">
                        <div className="font-bold text-lg">{value}</div>
                        {row.details_sub && valueIndex === 4 && (
                          <div className="text-xs text-gray-400">
                            {row.details_sub}
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col items-start justify-center py-8 px-4 sm:px-6 lg:px-8 text-gray-400">
          {/* Methodology Title */}
          <p className="text-xs sm:text-xs text-left mb-4 leading-snug pb-3 uppercase tracking-wide">
            Methodology
          </p>

          {/* Methodology Description */}
          <p className="text-xs sm:text-xs text-left mb-4 leading-snug">
            Verité AI results are evaluated on publicly available benchmark
            datasets: FaceForensics++ (c23 compression), Celeb-DF v2, and
            ASVspoof 2019/2021. Image and video accuracy figures represent
            AUC-ROC scores computed on the official test splits. Audio
            performance is reported as Equal Error Rate (EER); lower is better.
            All evaluations are performed with a single inference pass (no
            ensembling). Pre-trained backbone weights (EfficientNet-B4,
            WavLM/wav2vec2-large-xlsr-53) are frozen; only classification heads
            are fine-tuned.
          </p>

          <p className="text-xs sm:text-xs text-left mb-4 leading-snug">
            Competitor figures are sourced from publicly available technical
            reports and academic papers. Deepware Scanner and Microsoft Video
            Authenticator do not support audio deepfake detection and provide
            no XAI output or downloadable forensic reports, which accounts for
            the feature gaps indicated above.
          </p>

          <p className="text-xs sm:text-xs text-left leading-snug">
            MCS, NUST — Department of Computer Software Engineering. FYP
            supervisors: Dr. Ayesha Naseer &amp; Dr. Naima Iltaf. Version 2.0,
            May 2025.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BenchmarkTable;
