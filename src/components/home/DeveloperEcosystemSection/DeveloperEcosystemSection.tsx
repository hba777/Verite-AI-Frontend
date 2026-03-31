// src/components/home/DeveloperEcosystemSection.tsx

import React from "react";
import { motion } from "framer-motion";
import { LuSquareArrowOutUpRight } from "react-icons/lu";

const DeveloperEcosystemSection = React.forwardRef<HTMLDivElement>(
  (props, ref) => {
    return (
      <section ref={ref} className="bg-black text-white py-24 sm:py-32 px-4 lg:px-6 xl:px-8 2xl:px-10">
        <div className="container mx-auto max-w-6xl lg:max-w-7xl xl:max-w-8xl 2xl:max-w-9xl 3xl:max-w-10xl text-center">
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-medium mb-6 pb-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.4 }}
          >
            Research Ecosystem
          </motion.h2>
          <motion.p
            className="max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl text-gray-400 mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: false, amount: 0.4 }}
          >
            A modular microservices architecture enables researchers and
            integrators to interact with Verité AI's tri-modal detection engine
            via a documented REST API or directly through the web interface.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl lg:max-w-7xl xl:max-w-8xl 2xl:max-w-9xl mx-auto">
            {/* Google AI Studio Card */}
            <motion.div
              className="relative min-h-[280px] rounded-2xl bg-[#141414] border border-gray-800 hover:border-blue-500 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
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
                <div className="text-left w-full">
                  <h3 className="font-medium text-xl">Verité AI Dashboard</h3>
                  <p className="text-base text-gray-400 mt-2">
                    Authenticated interface for image, video, and audio deepfake
                    detection with XAI visualisation and detection history access.
                  </p>
                </div>
              </div>
              {/* pointing icon removed */}
            </motion.div>

            {/* Gemini API Card */}
            <motion.div
              className="relative min-h-[280px] rounded-2xl bg-[#141414] border border-gray-800 hover:border-blue-500 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
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
                <div className="text-left w-full">
                  <h3 className="font-medium text-xl">FastAPI Backend</h3>
                  <p className="text-base text-gray-400 mt-2">
                    JWT-secured REST endpoints for media upload, async Celery job
                    polling, Grad-CAM retrieval, and PDF report download.
                  </p>
                </div>
              </div>
              {/* pointing icon removed */}
            </motion.div>
          </div>
        </div>
      </section>
    );
  }
);

DeveloperEcosystemSection.displayName = "DeveloperEcosystemSection";
export default DeveloperEcosystemSection;
