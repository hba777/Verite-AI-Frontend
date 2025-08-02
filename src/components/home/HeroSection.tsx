// src/components/home/HeroSection.tsx

import React from "react";

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
  return (
    <main className="relative flex h-screen items-center justify-center overflow-hidden bg-black text-center text-white bg-[radial-gradient(ellipse_at_40%_20%,rgba(15,32,67,0.6)_0%,#000_75%)]">
      {/* Starfield Background Elements - These create the animated star background */}
      <div id="stars1" className="absolute inset-0"></div>
      <div id="stars2" className="absolute inset-0"></div>

      <div className="relative z-10 mx-auto max-w-4xl px-4">
        <h1 className="mb-4 text-6xl font-medium tracking-tight md:text-8xl">
          Gemini
        </h1>
        <p className="mb-8 text-xl text-gray-300 md:text-2xl">
          Our most intelligent AI models
        </p>
        <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          {/* Updated gradient to be bluer on the left and lighter on the right */}
          <a
            href="#"
            className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-400 py-3 px-8 font-bold text-white transition-opacity hover:opacity-90 sm:w-auto"
          >
            Chat with Gemini <ArrowIcon />
          </a>
          {/* Updated border to be blue */}
          <a
            href="#"
            className="flex w-full items-center justify-center rounded-full border border-blue-500 bg-gray-800/50 py-3 px-8 font-bold text-white transition-colors hover:bg-gray-700 sm:w-auto"
          >
            Build with Gemini <ArrowIcon />
          </a>
        </div>
      </div>
    </main>
  );
};

export default HeroSection;
