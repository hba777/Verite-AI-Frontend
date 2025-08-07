// src/components/home/ReasoningSection.tsx

import React from "react";
import StickyNav from "../layout/StickyNav";
import { motion, Variants } from "framer-motion";

interface ReasoningSectionProps {
  navRef: React.RefObject<HTMLDivElement | null>;
  onModelsClick: () => void;
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

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const ReasoningSection: React.FC<ReasoningSectionProps> = ({
  navRef,
  onModelsClick,
}) => {
  const paragraph =
    "Gemini 2.5 models are capable of reasoning through their thoughts before responding, resulting in enhanced performance and improved accuracy.";

  const words = paragraph.split(" ");

  return (
    <section className="relative h-screen bg-black text-white flex items-center justify-center overflow-hidden">
      <div className="max-w-4xl px-6 text-center">
        <motion.h2
          className="text-3xl md:text-5xl font-medium leading-snug text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text break-words"
          style={{
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

      <div ref={navRef} className="absolute bottom-10 left-0 right-0">
        <StickyNav activeTab="" onModelsClick={onModelsClick} />
      </div>
    </section>
  );
};

export default ReasoningSection;
