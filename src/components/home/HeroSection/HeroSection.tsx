// src/components/home/HeroSection.tsx

import React, { useState } from "react";
import { useRouter } from "next/router";
import ParticleBackground from "./ParticleBackground"; // <-- Import it here
import dynamic from "next/dynamic";
import { useUser } from "../../../context/UserContext";

const LoginForm = dynamic(() => import("../LoginForm/LoginForm"), {
  ssr: false,
});

// Helper component for the arrow icon
const ArrowIcon = () => (
  <svg
    className="ml-2 h-4 w-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 5l7 7-7 7"
    ></path>
  </svg>
);

const HeroSection = () => {
  const router = useRouter();
  const { user, token } = useUser();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openLoginForm = () => setIsLoginOpen(true);
  const closeLoginForm = () => setIsLoginOpen(false);

  const handleAnalyzeClick = () => {
    if (token) {
      router.push("/dashboard");
    } else {
      setIsLoginOpen(true);
    }
  };

  return (
    <main
      className="relative flex h-screen items-start justify-center overflow-hidden bg-black text-center text-white pt-32 md:pt-40 lg:pt-48 xl:pt-56 2xl:pt-64 3xl:pt-72"
      style={{
        backgroundImage: `
      url('hero-bg.png'),
      radial-gradient(ellipse at 40% 20%, rgba(15,32,67,0.6) 0%, #000 75%)
    `,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      {/* --- ADD THE PARTICLE COMPONENT HERE --- */}
      <ParticleBackground />

      <div className="relative z-10 mx-auto max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl 3xl:max-w-8xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h1 className="mb-4 text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10rem] 3xl:text-[12rem] tracking-tight font-normal pb-3">
          Verité AI
        </h1>

        {/* Subheading */}
        <p className="mb-8 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-gray-300 font-extralight">
          Tri-Modal Deepfake Detection with Explainable AI — Image, Video &amp; Audio
        </p>

        <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          {/* First Button */}
          <button
            onClick={handleAnalyzeClick}
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
            Analyze Media <ArrowIcon />
          </button>
        </div>
      </div>

      <LoginForm
        isOpen={isLoginOpen}
        onClose={closeLoginForm}
        onAuthenticated={(token) => {
          try {
            if (typeof window !== "undefined") {
              localStorage.setItem("auth_token", token);
            }
          } catch {}
          router.push("/dashboard");
        }}
      />
    </main>
  );
};

export default HeroSection;