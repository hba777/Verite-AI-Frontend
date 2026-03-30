// src/components/home/DeveloperBuildSection.tsx

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import dynamic from "next/dynamic";

const LoginForm = dynamic(() => import("../LoginForm/LoginForm"), { ssr: false });

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
      className="relative bg-black text-white py-24 px-6 flex items-center justify-center"
    >
      {/* Container to constrain the layout */}
      <div
        className="relative w-full max-w-6xl min-h-[600px] bg-center bg-no-repeat bg-cover rounded-2xl overflow-hidden flex items-center justify-center"
        style={{
          backgroundImage: `url('/gemini-bg.png')`,
        }}
      >
        <div className={`absolute inset-0 ${isOpen ? "bg-black/70" : "bg-black/50"}`} />

        <div className="relative z-10 px-6 py-10 text-center max-w-3xl">
          <motion.p
            className="text-sm uppercase tracking-wide text-gray-300 mb-4 font-semibold"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            For Integrators &amp; Researchers
          </motion.p>

          <motion.h1
            className="text-2xl sm:text-3xl md:text-[2.5rem] font-medium leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Verité AI exposes a fully documented FastAPI REST backend with
            JWT-secured endpoints for media upload, async job polling, and XAI
            report retrieval — enabling researchers and developers to integrate
            tri-modal deepfake detection into their own forensic pipelines.
          </motion.h1>
          <motion.a
            href="#"
            className="inline-flex items-center rounded-full py-3 px-8 font-normal text-white"
            onClick={(e) => {
              e.preventDefault();
              open();
            }}
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
            Access the API
            <LuSquareArrowOutUpRight strokeWidth={3} className="ml-2" />
          </motion.a>
          {(
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
          )}
        </div>
      </div>
    </section>
  );
});

DeveloperBuildSection.displayName = "DeveloperBuildSection";
export default DeveloperBuildSection;
