// src/components/home/ModelFamilySection.tsx

import React from "react";
import ModelCard from "../ModelCard/ModelCard";
import { motion } from "framer-motion";

const models = [
  {
    title: "Image Detector",
    description:
      "EfficientNet-B4 / Vision Transformer classifier trained on FaceForensics++, producing a binary Real/Fake verdict with a confidence score and Grad-CAM heatmap localising manipulated facial regions.",
  },
  {
    title: "Video Detector",
    description:
      "Asynchronous Celery pipeline performing frame-level inference, temporal aggregation, and per-frame Grad-CAM attribution. Supports MP4 up to 30 s, processed on a CUDA GPU server without blocking the UI.",
  },
  {
    title: "Audio Detector",
    description:
      "SSL-AASIST graph-attention classifier with WavLM (wav2vec2-large-xlsr-53) features, fine-tuned on ASVspoof 2019/2021. Detects TTS and voice-cloning attacks with temporal XAI attribution overlays.",
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
          Tri-Modal Detection Engine
        </motion.h2>

        <motion.p
          className="mt-4 max-w-2xl mx-auto text-[1.75rem] text-gray-400 font-medium pb-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: false, amount: 0.4 }}
        >
          Verité AI provides three modality-specific inference pipelines — image,
          video, and audio — each backed by a dedicated deep learning model with
          integrated XAI explainability output.
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
