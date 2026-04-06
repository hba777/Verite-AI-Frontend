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

// Header data combined for Image & Video focusing on GenD (PE)
const tableHeaders = [
  { 
    title: "VERITÉ AI", 
    subtitle: "IMAGE & VIDEO", 
    details: "GenD (PE)" 
  },
];

// Main table component
const BenchmarkTable: React.FC = () => {
  // Data strictly sourced from the research paper for GenD (PE) backbone
  const benchmarkData: BenchmarkData[] = [
    {
      benchmark: "Processing Speed",
      details: "Inference on A100 GPU (Batch size 1)",
      values: ["120 FPS"],
    },
    {
      benchmark: "Average Accuracy (AUC)",
      details: "Mean across 14 cross-dataset benchmarks",
      values: ["91.4%"],
    },
    {
      category: "In-Domain Visual Detection",
      benchmark: "FaceForensics++ (FF++)",
      details: "Mean AUROC (DF, F2F, FS, NT)",
      values: ["98.9%"],
    },
    {
      category: "Cross-Dataset Visual Detection",
      benchmark: "Celeb-DF v2",
      details: "Cross-dataset test",
      values: ["95.0%"],
    },
    {
      category: "Cross-Dataset Visual Detection",
      benchmark: "Face Forensics in the Wild (FFIW)",
      details: "Cross-dataset test",
      values: ["93.7%"],
    },
    {
      category: "Cross-Dataset Visual Detection",
      benchmark: "DeepFake Detection Challenge (DFDC)",
      details: "Cross-dataset test",
      values: ["82.2%"],
    },
    {
      category: "Cross-Dataset Visual Detection",
      benchmark: "FakeAVCeleb (FAVC)",
      details: "Cross-dataset test",
      values: ["97.3%"],
    },
    {
      category: "Cross-Dataset Visual Detection",
      benchmark: "IDForge (IDF)",
      details: "Cross-dataset test",
      values: ["97.9%"],
    },
  ];

  return (
    <div id="benchmarks" className="text-white p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8 text-white">
        {/* Benchmarks Title */}
        <motion.h2
          className="text-4xl sm:text-5xl font-medium mb-6 text-center pb-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: false, amount: 0.4 }}
        >
          Research Benchmarks: GenD (PE)
        </motion.h2>

        {/* Description Text */}
        <motion.p
          className="mt-4 max-w-2xl mx-auto text-[1.75rem] text-gray-400 font-medium pb-5 text-center leading-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: false, amount: 0.4 }}
        >
          Verité AI demonstrates superior performance across industry-standard
          detection benchmarks and real-world media authenticity challenges.
        </motion.p>
      </div>
      <div className="max-w-3xl mx-auto">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left font-normal text-sm text-gray-400 p-4">
                  Benchmark Dataset
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
                    {/* @ts-expect-error - Handling optional link property from format template */}
                    {header.link && (
                      <a href="#" className="text-blue-400 underline text-xs">
                        {/* @ts-expect-error */}
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
                        <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
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
                        <div className="text-xs text-gray-400 mt-1">
                          {row.details}
                        </div>
                      )}
                    </td>

                    {/* Value Columns */}
                    {row.values.map((value, valueIndex) => (
                      <td key={valueIndex} className="text-right p-4 align-middle">
                        <div className="font-bold text-lg">{value}</div>
                        {row.details_sub && valueIndex === 4 && (
                          <div className="text-xs text-gray-400 mt-1">
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
      </div>
    </div>
  );
};

export default BenchmarkTable;