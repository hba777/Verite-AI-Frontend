import React from "react";

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
  { title: "GEMINI 2.5", subtitle: "FLASH-LITE", details: "Non-thinking" },
  { title: "GEMINI 2.5", subtitle: "FLASH-LITE", details: "Thinking" },
  { title: "GEMINI 2.5", subtitle: "FLASH", details: "Non-thinking" },
  {
    title: "GEMINI 2.5",
    subtitle: "FLASH",
    details: "Thinking",
    link: "View 2.5 Flash",
  },
  {
    title: "GEMINI 2.5",
    subtitle: "PRO",
    details: "Thinking",
    link: "View 2.5 Pro",
  },
];

// Main table component
const BenchmarkTable: React.FC = () => {
  const benchmarkData: BenchmarkData[] = [
    {
      benchmark: "Input price",
      details: "$1M tokens (no caching)",
      values: ["$0.10", "$0.10", "$0.30", "$0.30", "$1.25"],
      details_sub: "$2.50 + 200k tokens",
    },
    {
      benchmark: "Output price",
      details: "$1M tokens",
      values: ["$0.40", "$0.40", "$2.50", "$2.50", "$10.00"],
      details_sub: "$15.00 + 200k tokens",
    },
    {
      category: "Reasoning & knowledge",
      benchmark: "Humanity's Last Exam (no tools)",
      values: ["5.1%", "6.9%", "8.4%", "11.0%", "21.6%"],
    },
    {
      category: "Science",
      benchmark: "GPQA diamond",
      values: ["64.6%", "66.7%", "78.3%", "82.8%", "86.4%"],
    },
    {
      category: "Mathematics",
      benchmark: "AIME 2025",
      values: ["49.8%", "63.1%", "61.6%", "72.0%", "88.0%"],
    },
    {
      category: "Code generation",
      benchmark: "LiveCodeBench",
      details: "(ut. 1/1/2025-5/1/2025)",
      values: ["33.7%", "34.3%", "41.1%", "55.4%", "69.0%"],
    },
    {
      category: "Code editing",
      benchmark: "Aider Polyglot",
      values: ["26.7%", "27.1%", "44.0%", "56.7%", "82.2%"],
    },
    {
      category: "Agentic coding",
      benchmark: "SWE-bench Verified",
      details: "single attempt",
      values: ["31.6%", "27.6%", "50.0%", "48.9%", "59.6%"],
    },
    {
      benchmark: "SWE-bench Verified",
      details: "multiple attempts",
      values: ["42.6%", "44.9%", "60.0%", "60.3%", "67.2%"],
      isSubRow: true,
    },
    {
      category: "Factuality",
      benchmark: "SimpleQA",
      values: ["10.7%", "13.0%", "25.8%", "26.9%", "54.0%"],
    },
    {
      category: "Factuality",
      benchmark: "FACTS grounding",
      values: ["84.1%", "86.8%", "83.4%", "85.3%", "87.8%"],
    },
    {
      category: "Visual reasoning",
      benchmark: "MMMU",
      values: ["72.9%", "72.9%", "76.9%", "79.7%", "82.0%"],
    },
    {
      category: "Image understanding",
      benchmark: "Vibe-Eval (Reka)",
      values: ["51.3%", "57.5%", "66.2%", "65.4%", "67.2%"],
    },
    {
      category: "Long context",
      benchmark: "MRCR v2 (8-needle)",
      details: "128k (average)",
      values: ["16.6%", "30.6%", "34.1%", "54.3%", "58.0%"],
    },
    {
      benchmark: "MRCR v2 (8-needle)",
      details: "1M (pointwise)",
      values: ["4.1%", "5.4%", "16.8%", "21.0%", "16.4%"],
      isSubRow: true,
    },
    {
      category: "Multilingual performance",
      benchmark: "Global MMLU (Lite)",
      values: ["81.1%", "84.5%", "85.8%", "88.4%", "89.2%"],
    },
  ];

  return (
    <div className="bg-black text-white p-4 sm:p-6 lg:p-8 font-sans">
      <div className="flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-black text-white">
        {/* Benchmarks Title */}
        <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-center">
          Benchmarks
        </h2>

        {/* Description Text */}
        <p className="text-lg sm:text-2xl text-center max-w-2xl leading-relaxed text-gray-400">
          In addition to its strong performance on academic benchmarks, Gemini
          2.5 tops the popular coding leaderboard WebDev Arena.
        </p>
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
        <div className="flex flex-col items-start justify-center py-8 px-4 sm:px-6 lg:px-8 bg-black text-gray-400">
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
