// src/components/home/DeveloperBuildSection.tsx

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import dynamic from "next/dynamic";

const LoginForm = dynamic(() => import("../LoginForm/LoginForm"), {
  ssr: false,
});

function useDisclosure(initial = false) {
  const [isOpen, setIsOpen] = React.useState(initial);
  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);
  return { isOpen, open, close };
}

const DeveloperBuildSection = React.forwardRef<HTMLDivElement>((props, ref) => {
  const router = useRouter();

  const { isOpen, open, close } = useDisclosure(false);

  return (
    <section
      ref={ref}
      className="relative bg-black text-white py-24 px-6 lg:px-8 xl:px-10 2xl:px-12 flex items-center justify-center"
    >
      {/* Container to constrain the layout */}
      <div
        className="relative w-full max-w-6xl lg:max-w-7xl xl:max-w-8xl 2xl:max-w-9xl 3xl:max-w-10xl min-h-[600px] lg:min-h-[700px] xl:min-h-[800px] 2xl:min-h-[900px] bg-center bg-no-repeat bg-cover rounded-2xl overflow-hidden flex items-center justify-center"
        style={{
          backgroundImage: `url('/gemini-bg.png')`,
        }}
      >
        <div
          className={`absolute inset-0 ${isOpen ? "bg-black/70" : "bg-black/50"}`}
        />

        <div className="relative z-10 px-6 lg:px-8 xl:px-10 2xl:px-12 py-10 text-center max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl">
          <motion.h2
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-medium pb-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: false, amount: 0.4 }}
          >
            For Integrators &amp; Researchers
          </motion.h2>

          <motion.p
            className="mt-4 max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl text-gray-400 font-medium pb-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: false, amount: 0.4 }}
          >
            Verité AI provides a modular FastAPI core that simplifies the
            deepfake detection process. By automating media submission and job
            polling, it gives integrators a ready-to-use engine for tri-modal
            analysis. This setup ensures that getting from a suspicious file to
            a comprehensive XAI report is as seamless as possible.
          </motion.p>
          {/* 'Access the API' button removed per request */}
          {
            <LoginForm
              isOpen={isOpen}
              onClose={close}
              onAuthenticated={(token) => {
                try {
                  if (typeof window !== "undefined") {
                    localStorage.setItem("auth_token", token);
                  }
                } catch {}
                router.push("/dashboard");
              }}
            />
          }
        </div>
      </div>
    </section>
  );
});

DeveloperBuildSection.displayName = "DeveloperBuildSection";
export default DeveloperBuildSection;
