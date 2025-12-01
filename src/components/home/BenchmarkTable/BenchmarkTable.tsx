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
  { title: "XDETECT-RT", subtitle: "IMAGE", details: "Basic Detection" },
  { title: "XDETECT-RT", subtitle: "IMAGE", details: "Advanced Analysis" },
  { title: "XDETECT-RT", subtitle: "VIDEO", details: "Real-time" },
  {
    title: "XDETECT-RT",
    subtitle: "VIDEO",
    details: "Forensic",
    link: "View Video Benchmarks",
  },
  {
    title: "XDETECT-RT",
    subtitle: "AUDIO",
    details: "Voice Analysis",
    link: "View Audio Benchmarks",
  },
];

// Main table component
const BenchmarkTable: React.FC = () => {
  const benchmarkData: BenchmarkData[] = [
    {
      benchmark: "Processing speed",
      details: "Images per second",
      values: ["50", "30", "25", "15", "10"],
    },
    {
      benchmark: "Accuracy",
      details: "Detection precision",
      values: ["94.2%", "96.8%", "92.1%", "95.3%", "93.7%"],
    },
    {
      category: "Image detection",
      benchmark: "FaceSwap Dataset",
      values: ["91.5%", "94.7%", "89.2%", "93.8%", "90.1%"],
    },
    {
      category: "Image detection",
      benchmark: "DeepFake Detection Challenge",
      values: ["87.3%", "91.6%", "85.4%", "89.9%", "86.2%"],
    },
    {
      category: "Video detection",
      benchmark: "FF++ Dataset",
      values: ["88.9%", "92.4%", "87.1%", "91.7%", "88.5%"],
    },
    {
      category: "Video detection",
      benchmark: "Celeb-DF Dataset",
      details: "(real-time processing)",
      values: ["85.6%", "89.3%", "83.8%", "87.9%", "84.7%"],
    },
    {
      category: "Audio detection",
      benchmark: "ASVspoof 2019",
      values: ["82.4%", "86.1%", "80.7%", "84.8%", "81.9%"],
    },
    {
      category: "Audio detection",
      benchmark: "Voice Conversion Detection",
      details: "LA dataset",
      values: ["79.8%", "83.5%", "78.2%", "82.1%", "79.6%"],
    },
    {
      category: "Explainability",
      benchmark: "Heatmap accuracy",
      values: ["76.3%", "81.9%", "74.5%", "79.2%", "75.8%"],
    },
    {
      category: "Robustness",
      benchmark: "Compression resistance",
      values: ["89.1%", "92.7%", "87.4%", "91.3%", "88.6%"],
    },
    {
      category: "Real-time performance",
      benchmark: "Latency (ms)",
      values: ["120", "180", "250", "350", "420"],
    },
    {
      category: "Batch processing",
      benchmark: "Throughput (videos/min)",
      values: ["45", "32", "28", "18", "12"],
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
          <p className="text-xs sm:text-xs text-left mb-4 leading-snug uppercase tracking-wide">
            Methodology
          </p>

          {/* Methodology Description */}
          <p className="text-xs sm:text-xs text-left mb-4 leading-snug">
            Gemini results: AI Gemini scores are pass @1 "Single attempt"
            settings allow no majority voting or parallel test-time compute;
            "multiple attempts" settings allow test-time selection of the
            candidate answer. They are all run with the AI Studio API with
            default sampling settings. To reduce variance, we average over
            multiple trials for smaller benchmarks. Aider Polyglot score is the
            pass rate average of 3 trials. Vibe-Eval results are reported using
            Gemini as a Google's scaffolding for "multiple attempts" for
            SWE-Bench includes drawing multiple trajectories and re-scoring them
            using model's own judgment. For Aider results differ from the
            official leaderboard due to a difference in the settings used for
            evaluation (non-default).
          </p>

          {/* Result Sources Title (Implicit) */}
          <p className="text-xs sm:text-xs text-left mb-4 leading-snug">
            Result sources: Where provider numbers are not available we report
            numbers from leaderboards reporting results on these benchmarks:
            Humanity's Last Exam results are sourced from https://tgi.safe.ai
            and https://scale.com/leaderboard/humanitye_last_exam. LiveCodeBench
            results are from https://livecodebench.github.io/leaderboard.html
            (1/1/2025 - 5/1/2025 in the UI). Aider Polyglot numbers come from
            https://aider.chat/docs/leaderboards! FACTS come from
            https://www.kaggle.com/benchmarks/google-facts-grounding. For MCR v2
            which is not publically available yet we include 128k results as a
            cumulative score to ensure they can be comparable with other models
            and a pointwise value for 1M content window to show the capability
            of the model at full length. The methodology has changed in this
            table in previously published results for MCR v2 as we have decided
            to focus on a harder, 8-needle version of the benchmark going
            forward.
          </p>

          {/* Input and Output Price Reflection */}
          <p className="text-xs sm:text-xs text-left leading-snug">
            Input and output price reflects text, image and video modalities.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BenchmarkTable;
