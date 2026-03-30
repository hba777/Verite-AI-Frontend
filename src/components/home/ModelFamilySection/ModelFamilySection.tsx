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
      <section className="container mx-auto px-6 lg:px-8 xl:px-10 2xl:px-12 py-20 max-w-5xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-8xl 3xl:max-w-9xl text-center">
        <motion.h2
          className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-medium pb-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: false, amount: 0.4 }}
        >
          Tri-Modal Detection Engine
        </motion.h2>

        <motion.p
          className="mt-4 max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl text-gray-400 font-medium pb-5"
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
              showLearnMore={false}
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
