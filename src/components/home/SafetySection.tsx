import React from "react";
import { motion } from "framer-motion";

const SafetySection = React.forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <section
      ref={ref}
      className="relative w-full h-screen bg-black text-white overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/safety-bg.png')`,
        }}
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 h-full flex items-center justify-center px-6">
        <div className="text-center max-w-4xl">
          <motion.p
            className="text-sm uppercase tracking-wide text-gray-300 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Building responsibly in the agentic era
          </motion.p>
          <motion.h1
            className="text-2xl sm:text-3xl md:text-5xl font-semibold leading-tight mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            As we develop these new technologies, we recognize the
            responsibility it entails, and aim to prioritize safety and security
            in all our efforts.
          </motion.h1>
          <motion.a
            href="#"
            className="inline-flex items-center px-6 py-3 rounded-full bg-black text-white border border-blue-500 hover:bg-gray-200/10 transition-colors duration-200 font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Learn more
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

SafetySection.displayName = "SafetySection";
export default SafetySection;
