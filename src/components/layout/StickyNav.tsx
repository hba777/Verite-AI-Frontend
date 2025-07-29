// src/components/layout/StickyNav.tsx

import React from "react";

interface StickyNavProps {
  activeTab: string;
  onModelsClick: () => void;
  // Add an optional className prop for positioning
  className?: string;
}

const StickyNav: React.FC<StickyNavProps> = ({
  activeTab,
  onModelsClick,
  className = "",
}) => {
  const navItems = ["Models", "Hands-on", "Performance", "Safety", "Build"];

  return (
    // Pass down the className for positioning
    <div className={`flex justify-center ${className}`}>
      <nav className="flex items-center space-x-2 rounded-full bg-gray-900/80 p-1.5 backdrop-blur-sm border border-white/10">
        {/* This new div makes the content scrollable on small screens */}
        <div className="flex items-center overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navItems.map((item) => {
            const isModelsButton = item === "Models";
            const commonClasses = `rounded-full px-4 py-1.5 text-sm font-medium transition-colors flex-shrink-0`; // Added flex-shrink-0
            const activeClasses = `bg-blue-500 text-white`;
            const inactiveClasses = `text-gray-300 hover:text-white`;

            return isModelsButton ? (
              <button
                key={item}
                onClick={onModelsClick}
                className={`${commonClasses} ${
                  activeTab === item ? activeClasses : inactiveClasses
                }`}
              >
                {item}
              </button>
            ) : (
              <a
                key={item}
                href="#"
                className={`${commonClasses} ${
                  activeTab === item ? activeClasses : inactiveClasses
                }`}
              >
                {item}
              </a>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default StickyNav;
