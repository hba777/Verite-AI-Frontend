// src/components/home/HeroSection.tsx

import React from "react";

const HeroSection = () => {
  return (
    <main className="relative flex h-screen items-center justify-center overflow-hidden bg-black text-center text-white bg-[radial-gradient(ellipse_at_40%_20%,rgba(15,32,67,0.6)_0%,#000_75%)]">
      {/* Starfield Background Elements */}
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
          <a
            href="#"
            className="w-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 py-3 px-8 font-bold text-white transition-opacity hover:opacity-90 sm:w-auto"
          >
            Chat with Gemini
          </a>
          <a
            href="#"
            className="w-full rounded-full border border-gray-700 bg-gray-800/50 py-3 px-8 font-bold text-white transition-colors hover:bg-gray-700 sm:w-auto"
          >
            Try in Google AI Studio
          </a>
        </div>
      </div>
    </main>
  );
};

export default HeroSection;
