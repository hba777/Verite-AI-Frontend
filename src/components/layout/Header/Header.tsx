import React from "react";
import { RiGeminiFill } from "react-icons/ri";
import { BiSquareRounded } from "react-icons/bi";

// Helper component for the icon
interface CustomFeatureIconProps {
  size?: number;
  className?: string;
}

const CustomFeatureIcon: React.FC<CustomFeatureIconProps> = ({
  size = 20,
  className,
}) => {
  // Calculate the overlay size to be proportional to the base icon.
  const overlaySize = size * 0.6;

  return (
    // 1. A container to position the icons relative to each other.
    <span
      style={{
        position: "relative",
        display: "inline-block",
        width: size,
        height: size,
      }}
      className={className}
    >
      {/* 2. The base square icon. */}
      <BiSquareRounded
        size={size}
        className="text-gray-400"
        style={{ position: "absolute" }}
      />

      {/* 3. The Gemini icon as the overlay. */}
      <RiGeminiFill
        size={overlaySize}
        className="text-gray-400"
        style={{
          position: "absolute",
          top: "-10%", // Adjust percentage for perfect corner placement
          right: "-10%", // Adjust percentage for perfect corner placement
        }}
      />
    </span>
  );
};

// Added isAtTop prop
const Header = ({
  isVisible,
  isAtTop,
}: {
  isVisible: boolean;
  isAtTop: boolean;
}) => {
  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[1000] bg-black backdrop-blur-sm transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${isVisible && !isAtTop ? "border-b border-white/20" : ""}`}
      >
        <div className="w-full px-2 sm:px-4 lg:px-6">
          <nav className="flex h-14 items-center justify-between">
            <div className="flex items-center space-x-8">
              {/* Main heading - weight 400 */}
              <a href="#" className="text-xl text-white px-10 font-normal">
                Google DeepMind
              </a>

              {/* Nav links (hidden at md and below) */}
              <div className="hidden lg:flex items-center space-x-8">
                {["Models", "Research", "Science", "About"].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white font-extralight"
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
                className="hidden items-center rounded-full text-gray-400 transition-colors sm:inline-flex bg-[#191919] hover:bg-[#222323] font-extralight
             px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base"
                style={{
                  fontFamily: '"Poppins", sans-serif',
                }}
              >
                <CustomFeatureIcon className="mr-2" />
                Build with Gemini
              </a>

              <a
                href="#"
                className="hidden items-center rounded-full text-gray-400 transition-colors sm:inline-flex bg-[#191919] hover:bg-[#222323] font-extralight
             px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base"
                style={{
                  fontFamily: '"Poppins", sans-serif',
                }}
              >
                <RiGeminiFill size={20} className="text-gray-400 mr-2" />
                Try Gemini
              </a>

              <button
                className="rounded-full p-2 text-gray-400 bg-[#191919] hover:bg-[#222323] transition-colors cursor-pointer font-extralight"
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
