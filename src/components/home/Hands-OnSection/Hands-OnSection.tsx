import React from "react";
import { motion, Variants } from "framer-motion";
import { LuSquareArrowOutUpRight } from "react-icons/lu";

// A reusable interface for our feature card props
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
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

// A reusable card component to display features consistently
const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => (
  <div className="group bg-[#141414] rounded-2xl p-10 flex flex-col items-center text-center h-full border-2 border-transparent transition-all duration-300 hover:border-blue-500 hover:bg-[#1f1f1f]">
    <div className="text-blue-400 mb-8 text-[48px] pb-7 group-hover:scale-105 transition-transform duration-300">
      {icon}
    </div>{" "}
    {/* Icon size increased */}
    <h3 className="text-white font-semibold text-xl mb-4">{title}</h3>{" "}
    {/* Title size increased */}
    <p className="text-gray-400 text-base leading-relaxed">
      {description}
    </p>{" "}
    {/* Description size increased */}
  </div>
);

// SVG Icon Components
const CalibratedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <path d="M15.5 15.5L19 19"></path>
    <path d="M15.5 19L19 15.5"></path>
    <path d="M8.5 12.5L8.5 15.5"></path>
    <path d="M12.5 8.5L15.5 8.5"></path>
  </svg>
);

const ControllableIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 21v-7"></path>
    <path d="M4 10V3"></path>
    <path d="M12 21v-9"></path>
    <path d="M12 8V3"></path>
    <path d="M20 21v-5"></path>
    <path d="M20 12V3"></path>
    <path d="M1 14h6"></path>
    <path d="M9 8h6"></path>
    <path d="M17 16h6"></path>
  </svg>
);

const AdaptiveIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 12h-4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4Z"></path>
    <path d="M8 22v-4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v4Z"></path>
    <path d="M12 11.5V16a2 2 0 0 0 2 2h2.5"></path>
    <path d="m19 2-3 3"></path>
    <path d="m5 15-3 3"></path>
    <path d="M21 15a6 6 0 0 0-6-6h-2a4 4 0 0 0-4 4v2a6 6 0 0 0 6 6h2a4 4 0 0 0 4-4v-2"></path>
  </svg>
);

const IterativeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
    <path d="M3 7v9"></path>
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
    <path d="M21 17v-9"></path>
  </svg>
);

const ScienceIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <path d="M10.42 16.42L8 14l-2.42 2.42"></path>
    <path d="M8 14V9"></path>
    <path d="M10.5 5.5L8 3l-2.5 2.5"></path>
  </svg>
);

const CodeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

// The main component that lays out the entire page section
const HandsOn: React.FC = () => {
  const adaptiveFeatures: FeatureCardProps[] = [
    {
      icon: <CalibratedIcon />,
      title: "Grad-CAM Heatmap Visualisation",
      description:
        "Gradient-weighted Class Activation Mapping highlights the exact facial or spectral regions responsible for a Fake verdict, providing pixel-level localisation of manipulated artefacts.",
    },
    {
      icon: <ControllableIcon />,
      title: "Calibrated Confidence Scores",
      description:
        "Each detection is accompanied by a probability-calibrated confidence score, enabling downstream triage workflows to set institution-appropriate decision thresholds.",
    },
    {
      icon: <AdaptiveIcon />,
      title: "Asynchronous Task Orchestration",
      description:
        "Video and audio jobs are dispatched to modality-specific Celery workers via Redis, allowing long-running inference to proceed without blocking the UI or holding open HTTP connections.",
    },
  ];

  const deepThinkFeatures: FeatureCardProps[] = [
    {
      icon: <IterativeIcon />,
      title: "LLM-Generated Forensic Narratives",
      description:
        "GPT-4 synthesises Grad-CAM findings and confidence scores into a structured natural-language justification, bridging the gap between model output and human understanding.",
    },
    {
      icon: <ScienceIcon />,
      title: "Downloadable PDF Forensic Reports",
      description:
        "Each detection generates an audit-ready PDF containing the verdict, confidence score, Grad-CAM heatmap, temporal XAI overlay, and the full LLM narrative — suitable for academic or legal review.",
    },
    {
      icon: <CodeIcon />,
      title: "REST API and FastAPI Backend",
      description:
        "A modular FastAPI backend with JWT-secured endpoints, multipart file upload, and JSON polling for async job status enables straightforward integration into enterprise verification pipelines.",
    },
  ];

  return (
    <div className="text-white min-h-screen py-16 px-4 sm:px-6 lg:px-8 pt-30">
      <div className="max-w-7xl mx-auto">
        {/* Section 1: Adaptive and budgeted thinking */}
        <section className="text-center mb-24">
          <motion.h2
            className="text-4xl md:text-5xl font-medium mb-4 pb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: false, amount: 0.4 }}
          >
            XAI Transparency Features
          </motion.h2>

          <motion.p
            className="text-gray-400 max-w-xl mx-auto text-[1.75rem] font-medium pb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: false, amount: 0.4 }}
          >
            Grad-CAM visualisations and LLM-generated narratives make Verité AI
            results interpretable to both technical analysts and non-expert
            stakeholders, fulfilling the explainability gap in existing tools.
          </motion.p>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3 pb-24">
            {adaptiveFeatures.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </section>

        {/* Section 2: Gemini 2.5 Deep Think */}
        <section className="text-center mb-24">
          <motion.h2
            className="text-4xl md:text-5xl font-medium mb-4 pb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: false, amount: 0.4 }}
          >
            Extended Detection Capabilities
          </motion.h2>

          <motion.p
            className="text-gray-400 max-w-2xl mx-auto text-[1.75rem] mb-8 pb-12 font-medium"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: false, amount: 0.4 }}
          >
            Beyond binary verdicts, Verité AI provides a full forensic evidence
            chain: Grad-CAM heatmaps, temporal XAI overlays for audio,
            LLM-narrated justifications, and exportable PDF reports — covering
            all three modalities in a unified web platform.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            viewport={{ once: false, amount: 0.4 }}
          >
            {/* First Button (Try with Google AI Ultra) */}
            <a
              href="#"
              className="flex w-full items-center justify-center rounded-full py-3 px-8 sm:w-auto font-normal text-white"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #3b6bff, #2e96ff 65%, #acb7ff)",
                transition: "background-image 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundImage =
                  "linear-gradient(90deg, #345fe6, #2786e6 65%, #9ca6e6)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundImage =
                  "linear-gradient(90deg, #3b6bff, #2e96ff 65%, #acb7ff)")
              }
            >
              Try Detection Demo
              <LuSquareArrowOutUpRight strokeWidth={3} className="ml-2" />
            </a>

            {/* Second Button (View model card) */}
            <a
              href="#"
              className="flex w-full items-center justify-center rounded-full py-3 px-8 sm:w-auto font-normal text-white gap-2"
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
            >
              View API Documentation
              <LuSquareArrowOutUpRight strokeWidth={3} className="ml-2" />
            </a>
          </motion.div>

          <section className="flex items-center justify-center py-20">
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
                Verité AI addresses multi-modal forensic analysis that demands
                Grad-CAM localisation, temporal attribution, and LLM narrative
                generation — producing a complete evidence chain for each
                detection, step-by-step.
              </motion.h2>
            </div>
          </section>
        </section>

        {/* Section 3: Deep Think Features */}
        <section className="text-center">
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {deepThinkFeatures.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HandsOn;
