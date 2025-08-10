import React from "react";
import { motion } from "framer-motion";
import { LuSquareArrowOutUpRight } from "react-icons/lu";

const PerformanceSection = React.forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <section
      ref={ref}
      className="relative w-full h-screen bg-black text-white overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/performance-bg.png')`, // Make sure this image exists
        }}
      />
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-6">
        <div className="text-center max-w-4xl">
          <motion.p
            className="text-sm uppercase tracking-wide text-gray-300 mb-4 font-semibold"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Performance
          </motion.p>

          <motion.h1
            className="text-2xl sm:text-3xl md:text-5xl font-semibold leading-tight mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Gemini 2.5 is state-of-the-art across a
            <br className="hidden md:block" /> wide range of benchmarks.
          </motion.h1>

          <motion.a
            href="#"
            className="inline-flex items-center px-6 py-3 rounded-full bg-black text-white transition-colors duration-200 font-medium"
            style={{
              backgroundImage:
                "linear-gradient(#060606, #060606), linear-gradient(90deg, #3b6bff, #2e96ff 65%, #acb7ff)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
              border: "2px solid transparent",
              transition:
                "background-color 0.3s ease, background-image 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundImage =
                "linear-gradient(#222323, #222323), linear-gradient(90deg, #3b6bff, #2e96ff 65%, #9ca6e6)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundImage =
                "linear-gradient(#060606, #060606), linear-gradient(90deg, #3b6bff, #2e96ff 65%, #acb7ff)")
            }
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            View 2.5 tech report
            <LuSquareArrowOutUpRight strokeWidth={3} className="ml-2" />
          </motion.a>
        </div>
      </div>
    </section>
  );
});

PerformanceSection.displayName = "PerformanceSection";
export default PerformanceSection;
