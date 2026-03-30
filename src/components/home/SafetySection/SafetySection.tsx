import React from "react";
import { motion } from "framer-motion";
import { LuSquareArrowOutUpRight } from "react-icons/lu";

const SafetySection = React.forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <section
      ref={ref}
      className="relative w-full h-screen bg-black text-white overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/safety-bg.png')`,
        }}
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 h-full flex items-center justify-center px-6">
        <div className="text-center max-w-4xl">
          <motion.h2
            className="text-5xl font-medium pb-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: false, amount: 0.4 }}
          >
            Responsible AI at NUST
          </motion.h2>
          <motion.p
            className="mt-4 max-w-2xl mx-auto text-[1.75rem] text-gray-400 font-medium pb-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: false, amount: 0.4 }}
          >
            Verité AI is developed in alignment with SDG 16 (Peace, Justice, and
            Strong Institutions) and SDG 9 (Industry, Innovation, and
            Infrastructure). We recognise the dual-use sensitivity of deepfake
            detection technology and commit to transparent, audit-ready outputs
            that protect individuals and democratic integrity.
          </motion.p>
          <motion.a
            href="#"
            className="inline-flex items-center rounded-full py-3 px-8 font-normal text-white"
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
                "linear-gradient(#222323, #222323), linear-gradient(90deg, #3b6bff, #2e96ff 65%, #acb7ff)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundImage =
                "linear-gradient(#060606, #060606), linear-gradient(90deg, #3b6bff, #2e96ff 65%, #acb7ff)")
            }
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Read Our Ethics Statement
            <LuSquareArrowOutUpRight strokeWidth={3} className="ml-2" />
          </motion.a>
        </div>
      </div>
    </section>
  );
});

SafetySection.displayName = "SafetySection";
export default SafetySection;
