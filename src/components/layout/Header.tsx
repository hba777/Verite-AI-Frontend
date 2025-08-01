// src/components/layout/Header.tsx

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

// Add isVisible to the props
const Header = ({ isVisible }: { isVisible: boolean }) => {
  return (
    // The transition classes and conditional transform make the header slide in and out
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-black/30 backdrop-blur-sm transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
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
            {/* The header buttons have a lighter gray border to match the image */}
            <a
              href="#"
              className="hidden items-center rounded-full border border-gray-600 bg-gray-800/50 py-2 px-4 font-medium text-white transition-colors hover:bg-gray-700 sm:inline-flex"
            >
              Build with Gemini <ArrowIcon />
            </a>
            <a
              href="#"
              className="hidden items-center rounded-full border border-gray-600 bg-gray-800/50 py-2 px-4 font-medium text-white transition-colors hover:bg-gray-700 sm:inline-flex"
            >
              Try Gemini <ArrowIcon />
            </a>
            <button className="rounded-full p-2 text-white hover:bg-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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
