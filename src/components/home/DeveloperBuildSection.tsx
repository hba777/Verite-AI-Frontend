// src/components/home/DeveloperBuildSection.tsx

import React from "react";
import { motion } from "framer-motion";

const DeveloperBuildSection = React.forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <section
      ref={ref}
      className="relative bg-black text-white py-24 px-6 flex items-center justify-center"
    >
      {/* Container to constrain the layout */}
      <div
        className="relative w-full max-w-6xl min-h-[600px] bg-center bg-no-repeat bg-cover rounded-2xl overflow-hidden flex items-center justify-center"
        style={{
          backgroundImage: `url('/gemini-bg.png')`,
        }}
      >
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 px-6 py-10 text-center max-w-3xl">
          <motion.p
            className="text-sm uppercase tracking-wide text-gray-300 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            For Developers
          </motion.p>

          <motion.h1
            className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Gemini’s advanced thinking, native multimodality and massive context
            window empowers developers to build next-generation experiences.
          </motion.h1>

          <motion.a
            href="#"
            className="inline-flex items-center px-6 py-3 rounded-full bg-black text-white border border-blue-500 hover:bg-gray-200/10 transition-colors duration-200 font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Start building
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </motion.a>
        </div>
      </div>
    </section>
  );
});

DeveloperBuildSection.displayName = "DeveloperBuildSection";
export default DeveloperBuildSection;
