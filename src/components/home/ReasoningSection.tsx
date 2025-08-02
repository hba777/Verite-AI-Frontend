// src/components/home/ReasoningSection.tsx

import React from "react";
import StickyNav from "../layout/StickyNav";
// Import the 'Variants' type from framer-motion
import { motion, Variants } from "framer-motion";

// Define props to accept a ref and the click handler
interface ReasoningSectionProps {
  // Allow the ref's current value to be null
  navRef: React.RefObject<HTMLDivElement | null>;
  onModelsClick: () => void;
}

// The text content split into individual lines for animation
const textLines = [
  "Gemini 2.5 models are capable of",
  "reasoning through their thoughts",
  "before responding, resulting",
  "in enhanced performance",
  "and improved accuracy.",
];

// Add the 'Variants' type to the constant
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Delay between each line appearing
    },
  },
};

// Add the 'Variants' type to the constant
const lineVariants: Variants = {
  hidden: { opacity: 0, y: 20 }, // Start invisible and slightly lower
  visible: {
    opacity: 1,
    y: 0, // Animate to full opacity and original position
    transition: {
      duration: 0.5,
      ease: "easeOut", // TypeScript now understands this is a valid value
    },
  },
};

const ReasoningSection: React.FC<ReasoningSectionProps> = ({
  navRef,
  onModelsClick,
}) => {
  return (
    <section className="relative h-screen bg-black text-white flex items-center justify-center overflow-hidden">
      <div className="max-w-4xl px-6 text-center">
        <motion.h2
          className="text-4xl md:text-5xl font-medium leading-tight"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.4 }}
        >
          {textLines.map((line, index) => (
            <motion.span
              key={index}
              className="block"
              variants={lineVariants} // This now passes the correctly typed variant
            >
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                {line}
              </span>
            </motion.span>
          ))}
        </motion.h2>
      </div>

      <div ref={navRef} className="absolute bottom-10 left-0 right-0">
        <StickyNav activeTab="Models" onModelsClick={onModelsClick} />
      </div>
    </section>
  );
};

export default ReasoningSection;
