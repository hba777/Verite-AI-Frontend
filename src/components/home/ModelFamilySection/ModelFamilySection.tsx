// src/components/home/ModelFamilySection.tsx

import React from "react";
import ModelCard from "../ModelCard/ModelCard";
import { motion } from "framer-motion";

const models = [
  { title: "Image Detector", description: "Advanced deepfake detection for images with high accuracy" },
  {
    title: "Video Detector",
    description: "Real-time analysis for video content and manipulations",
  },
  {
    title: "Audio Detector",
    description: "Voice cloning and audio forgery detection",
  },
];

// Use React.forwardRef to accept the ref from the parent
const ModelFamilySection = React.forwardRef<HTMLDivElement>((props, ref) => {
  return (
    // Attach the ref to the root element of this section
    <div ref={ref} className="text-white relative">
      <section className="container mx-auto px-6 py-20 max-w-5xl text-center">
        <motion.h2
          className="text-5xl font-medium pb-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: false, amount: 0.4 }}
        >
          Detection Models
        </motion.h2>

        <motion.p
          className="mt-4 max-w-2xl mx-auto text-[1.75rem] text-gray-400 font-medium pb-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: false, amount: 0.4 }}
        >
          XDetect-RT offers specialized models for detecting manipulated media
          across images, videos, and audio with state-of-the-art accuracy.
        </motion.p>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {models.map((model) => (
            <ModelCard
              key={model.title}
              title={model.title}
              description={model.description}
            />
          ))}
        </div>
      </section>
    </div>
  );
});

// Add a display name for easier debugging
ModelFamilySection.displayName = "ModelFamilySection";

export default ModelFamilySection;
