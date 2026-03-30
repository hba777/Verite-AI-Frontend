import React from "react";
import { motion } from "framer-motion";
import { LuSquareArrowOutUpRight } from "react-icons/lu";

const SafetySection = React.forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <section
      ref={ref}
      className="relative w-full h-screen lg:h-[90vh] xl:h-[85vh] 2xl:h-[80vh] bg-black text-white overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/safety-bg.png')`,
        }}
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 h-full flex items-center justify-center px-6 lg:px-8 xl:px-10 2xl:px-12">
        <div className="text-center max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl 3xl:max-w-8xl">
          <motion.h2
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-medium pb-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: false, amount: 0.4 }}
          >
            Responsible AI at NUST
          </motion.h2>
          <motion.p
            className="mt-4 max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl text-gray-400 font-medium pb-5"
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
          {/* Removed 'Read Our Ethics Statement' button per request */}
        </div>
      </div>
    </section>
  );
});

SafetySection.displayName = "SafetySection";
export default SafetySection;
