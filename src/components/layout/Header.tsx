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
    <>
      {/* Load Google Sans font */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;450&display=swap"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500&display=swap"
        rel="stylesheet"
      ></link>

      <header
        className={`fixed inset-x-0 top-0 z-1000 bg-black backdrop-blur-sm transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="w-full px-2 sm:px-4 lg:px-6">
          <nav className="flex h-14 items-center justify-between">
            <div className="flex items-center space-x-8">
              {/* Main heading - weight 400 */}
              <a
                href="#"
                className="text-xl text-white px-10"
                style={{
                  fontFamily: '"Google Sans", sans-serif',
                  fontWeight: 400,
                }}
              >
                Google DeepMind
              </a>

              {/* Nav links (hidden at md and below) */}
              <div className="hidden lg:flex items-center space-x-8">
                {["Models", "Research", "Science", "About"].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-gray-300 transition-colors hover:text-white font-extralight"
                    style={{
                      fontFamily: '"Poppins", sans-serif',
                    }}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            {/* Buttons - weight 450 */}
            <div className="flex items-center space-x-2">
              <a
                href="#"
                className="hidden items-center rounded-full text-white transition-colors sm:inline-flex bg-[#191919] hover:bg-[#222323] font-extralight
             px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base"
                style={{
                  fontFamily: '"Poppins", sans-serif',
                }}
              >
                Build with Gemini <ArrowIcon />
              </a>

              <a
                href="#"
                className="hidden items-center rounded-full text-white transition-colors sm:inline-flex bg-[#191919] hover:bg-[#222323] font-extralight
             px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base"
                style={{
                  fontFamily: '"Poppins", sans-serif',
                }}
              >
                Try Gemini <ArrowIcon />
              </a>

              <button
                className="rounded-full p-2 text-white bg-[#191919] hover:bg-[#222323] transition-colors cursor-pointer font-extralight"
                style={{
                  fontFamily: '"Poppins", sans-serif',
                }}
              >
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
    </>
  );
};

export default Header;
