// src/components/home/ReasoningSection.tsx
import React from "react";
import StickyNav from "../../layout/StickyNav/StickyNav";
import { motion, Variants } from "framer-motion";

interface ReasoningSectionProps {
  navRef: React.RefObject<HTMLDivElement | null>;
  activeTab: string;
  onModelsClick: () => void;
  onHandsOnClick: () => void;
  onPerformanceClick: () => void;
  onSafetyClick: () => void;
  onBuildClick: () => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const ReasoningSection: React.FC<ReasoningSectionProps> = ({
  navRef,
  activeTab,
  onModelsClick,
  onHandsOnClick,
  onPerformanceClick,
  onSafetyClick,
  onBuildClick,
}) => {
  return (
    <section className="relative min-h-[80vh] text-white flex flex-col items-center justify-center overflow-hidden">
      <div className="max-w-4xl px-6 text-center">
        <motion.h2
          className="text-3xl md:text-5xl font-medium leading-snug text-transparent bg-clip-text break-words"
          style={{
            backgroundImage:
              "linear-gradient(90deg, #3b6bff, #2e96ff 65%, #acb7ff)",
            WebkitBackgroundClip: "text", // Safari support
            backgroundClip: "text",
            backgroundRepeat: "repeat",
            backgroundSize: "100% 1.2em", // height of one line
            lineHeight: "1.2em",
          }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.4 }}
        >
          Gemini 2.5 models are capable of reasoning through their thoughts
          before responding, resulting in enhanced performance and improved
          accuracy.
        </motion.h2>
      </div>

      <div ref={navRef} className="mt-30 w-full">
        <StickyNav
          activeTab={activeTab}
          onModelsClick={onModelsClick}
          onHandsOnClick={onHandsOnClick}
          onPerformanceClick={onPerformanceClick}
          onSafetyClick={onSafetyClick}
          onBuildClick={onBuildClick}
        />
      </div>
    </section>
  );
};

export default ReasoningSection;
