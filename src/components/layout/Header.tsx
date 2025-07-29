// src/components/layout/Header.tsx

import React from "react";

// Add isVisible to the props
const Header = ({ isVisible }: { isVisible: boolean }) => {
  return (
    // Add transition classes and conditionally change transform
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-black/30 backdrop-blur-sm transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* ... rest of the header code is the same ... */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex h-20 items-center justify-between">
          <div className="flex items-center space-x-8">
            <a href="#" className="text-xl font-bold text-white">
              Google DeepMind
            </a>
            <div className="hidden items-center space-x-8 md:flex">
              <a
                href="#"
                className="text-gray-300 transition-colors hover:text-white"
              >
                Models
              </a>
              <a
                href="#"
                className="text-gray-300 transition-colors hover:text-white"
              >
                Research
              </a>
              <a
                href="#"
                className="text-gray-300 transition-colors hover:text-white"
              >
                Science
              </a>
              <a
                href="#"
                className="text-gray-300 transition-colors hover:text-white"
              >
                About
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <a
              href="#"
              className="hidden rounded-full border border-gray-700 bg-gray-800/50 py-2 px-4 font-medium text-white transition-colors hover:bg-gray-700 sm:inline-block"
            >
              Try Google AI Studio
            </a>
            <a
              href="#"
              className="hidden rounded-full border border-gray-700 bg-gray-800/50 py-2 px-4 font-medium text-white transition-colors hover:bg-gray-700 sm:inline-block"
            >
              Try Gemini
            </a>
            <button className="rounded-full p-2 hover:bg-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
