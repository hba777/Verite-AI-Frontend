// src/components/home/DeveloperEcosystemSection.tsx

import React from "react";
import { motion } from "framer-motion";

const DeveloperEcosystemSection = React.forwardRef<HTMLDivElement>(
  (props, ref) => {
    return (
      <section ref={ref} className="bg-black text-white py-24 sm:py-32 px-4">
        <div className="container mx-auto text-center">
          <motion.h2
            className="text-4xl sm:text-6xl font-medium mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.4 }}
          >
            Developer ecosystem
          </motion.h2>
          <motion.p
            className="max-w-3xl mx-auto text-2xl text-gray-400 mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: false, amount: 0.4 }}
          >
            Build with cutting-edge generative AI models and tools to make AI
            helpful for everyone.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {/* Google AI Studio Card */}
            <motion.div
              className="relative min-h-[280px] rounded-2xl bg-[#0d0d0d] border border-gray-800 hover:border-blue-500 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
              viewport={{ once: false, amount: 0.4 }}
            >
              <div className="flex flex-col sm:flex-row items-center gap-6 h-full">
                {/* Large blue glowing icon */}
                <div className="flex-shrink-0 w-24 h-24 sm:w-40 sm:h-40 bg-black rounded-xl flex items-center justify-center">
                  <svg
                    width="70%"
                    height="70%"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M83.3333 41.6667V25C83.3333 22.7833 81.55 20.8333 79.1667 20.8333H20.8333C18.45 20.8333 16.6667 22.7833 16.6667 25V75C16.6667 77.2167 18.45 79.1667 20.8333 79.1667H41.6667"
                      stroke="#2563eb"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M62.5 54.1667L50 41.6667L37.5 54.1667"
                      stroke="#3b82f6"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M50 41.6667V79.1667"
                      stroke="#3b82f6"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M83.3333 62.5L70.8333 50L83.3333 37.5"
                      stroke="#60a5fa"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {/* Text Content */}
                <div className="text-left sm:text-right w-full">
                  <h3 className="font-medium text-xl">Google AI Studio</h3>
                  <p className="text-base text-gray-400 mt-2">
                    Build with the latest models from Google DeepMind
                  </p>
                </div>
              </div>
              <div className="absolute bottom-4 right-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>
            </motion.div>

            {/* Gemini API Card */}
            <motion.div
              className="relative min-h-[280px] rounded-2xl bg-[#0d0d0d] border border-gray-800 hover:border-blue-500 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
              viewport={{ once: false, amount: 0.4 }}
            >
              <div className="flex flex-col sm:flex-row items-center gap-6 h-full">
                {/* Large cyan glowing icon */}
                <div className="flex-shrink-0 w-24 h-24 sm:w-40 sm:h-40 bg-black rounded-xl flex items-center justify-center">
                  <svg
                    width="70%"
                    height="70%"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M50 12.5L29.1667 29.1667L12.5 50L29.1667 70.8333L50 87.5L70.8333 70.8333L87.5 50L70.8333 29.1667L50 12.5Z"
                      stroke="#06b6d4"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M50 50L12.5 50"
                      stroke="#22d3ee"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M87.5 50H50"
                      stroke="#22d3ee"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {/* Text Content */}
                <div className="text-left sm:text-right w-full">
                  <h3 className="font-medium text-xl">Gemini API</h3>
                  <p className="text-base text-gray-400 mt-2">
                    Easily integrate Google’s most capable AI model to your apps
                  </p>
                </div>
              </div>
              <div className="absolute bottom-4 right-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }
);

DeveloperEcosystemSection.displayName = "DeveloperEcosystemSection";
export default DeveloperEcosystemSection;
