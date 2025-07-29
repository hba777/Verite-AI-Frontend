// src/components/home/ReasoningSection.tsx

import React from "react";
import StickyNav from "../layout/StickyNav";

// Define props to accept a ref and the click handler
interface ReasoningSectionProps {
  // Allow the ref's current value to be null
  navRef: React.RefObject<HTMLDivElement | null>;
  onModelsClick: () => void;
}

const ReasoningSection: React.FC<ReasoningSectionProps> = ({
  navRef,
  onModelsClick,
}) => {
  return (
    <section className="relative h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-4xl px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-medium leading-tight">
          <span className="bg-gradient-to-b from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Gemini 2.5 models are capable of reasoning through their thoughts
            before responding, resulting in enhanced performance and improved
            accuracy.
          </span>
        </h2>
      </div>

      {/* The statically positioned nav bar. We pass the ref to its container div. */}
      <div ref={navRef} className="absolute bottom-10 left-0 right-0">
        <StickyNav activeTab="Models" onModelsClick={onModelsClick} />
      </div>
    </section>
  );
};

export default ReasoningSection;
