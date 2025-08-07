import React from "react";
import { motion, Variants } from "framer-motion";

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
  <div className="bg-[#121316] rounded-2xl p-10 flex flex-col items-center text-center h-full border border-gray-700/50">
    <div className="text-blue-400 mb-8 text-[48px]">{icon}</div>{" "}
    {/* Icon size increased */}
    <h3 className="text-white font-semibold text-2xl mb-4">{title}</h3>{" "}
    {/* Title size increased */}
    <p className="text-gray-400 text-lg leading-relaxed">{description}</p>{" "}
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
      title: "Calibrated",
      description:
        "The model explores diverse thinking strategies, leading to more accurate and relevant outputs.",
    },
    {
      icon: <ControllableIcon />,
      title: "Controllable",
      description:
        "Developers have fine-grained control over the model's thinking process, allowing them to manage resource usage.",
    },
    {
      icon: <AdaptiveIcon />,
      title: "Adaptive",
      description:
        "When no thinking budget is set, the model assesses the complexity of a task and calibrates the amount of thinking accordingly.",
    },
  ];

  const deepThinkFeatures: FeatureCardProps[] = [
    {
      icon: <IterativeIcon />,
      title: "Iterative development and design",
      description:
        "We've seen impressive results on tasks that require building something by making small changes over time.",
    },
    {
      icon: <ScienceIcon />,
      title: "Aiding scientific and mathematical discovery",
      description:
        "By reasoning through complex problems, Deep Think can act as a powerful tool for researchers.",
    },
    {
      icon: <CodeIcon />,
      title: "Algorithmic development and code",
      description:
        "Deep Think excels at tough coding problems where problem formulation and careful consideration of tradeoffs and time complexity is paramount.",
    },
  ];

  return (
    <div className="bg-black text-white min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Section 1: Adaptive and budgeted thinking */}
        <section className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-medium mb-4 pb-12">
            Adaptive and budgeted thinking
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-2xl pb-12">
            Adaptive controls and adjustable thinking budgets allow you to
            balance performance and cost.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3 pb-24">
            {adaptiveFeatures.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </section>

        {/* Section 2: Gemini 2.5 Deep Think */}
        <section className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-medium mb-4 pb-12">
            Gemini 2.5 Deep Think
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto text-2xl mb-8 pb-24">
            An enhanced reasoning mode that uses cutting edge research
            techniques in parallel thinking and reinforcement learning to
            significantly improve Gemini's ability to solve complex problems.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16 ">
            <a
              href="#"
              className="flex w-full sm:w-auto items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-400 py-3 px-8 text-base font-bold text-white transition-opacity hover:opacity-90"
            >
              Try with Google AI Ultra
            </a>
            <a
              href="#"
              className="flex w-full sm:w-auto items-center justify-center rounded-full border border-blue-500 bg-gray-800/50 py-3 px-8 text-base font-bold text-white transition-colors hover:bg-gray-700 gap-2"
            >
              View model card
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>

          <section className="flex items-center justify-center py-20">
            <div className="max-w-4xl px-6 text-center">
              <motion.h2
                className="text-3xl md:text-5xl font-medium leading-snug text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text break-words"
                style={{
                  backgroundRepeat: "repeat",
                  backgroundSize: "100% 1.2em",
                  lineHeight: "1.2em",
                }}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.4 }}
              >
                Deep Think can better help tackle problems that require
                creativity, strategic planning, and making improvements
                step-by-step.
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
