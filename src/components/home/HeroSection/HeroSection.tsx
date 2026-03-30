// src/components/home/HeroSection.tsx

import React from "react";
import router, { useRouter } from "next/router";
import { userAgent } from "next/server";
import ParticleBackground from "./ParticleBackground"; // <-- Import it here

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

  return (
    <main
      className="relative flex h-screen items-start justify-center overflow-hidden bg-black text-center text-white pt-60"
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

      <div className="relative z-10 mx-auto max-w-4xl px-4">
        {/* Heading */}
        <h1 className="mb-4 text-7xl md:text-9xl tracking-tight font-normal pb-3">
          Verité AI
        </h1>

        {/* Subheading */}
        <p className="mb-8 text-lg md:text-xl text-gray-300 font-extralight">
          Tri-Modal Deepfake Detection with Explainable AI — Image, Video &amp; Audio
        </p>

        <div onClick={() => {
          router.push('/dashboard')
        }} className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 cursor-pointer">
          
          {/* First Button */}
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
            Analyze Media <ArrowIcon />
          </a>

          {/* Second Button with gradient border */}
          <a
            href="#"
            className="flex w-full items-center justify-center rounded-full py-3 px-8 sm:w-auto font-normal text-white"
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
          >
            Learn More <ArrowIcon />
          </a>
        </div>
      </div>
    </main>
  );
};

export default HeroSection;