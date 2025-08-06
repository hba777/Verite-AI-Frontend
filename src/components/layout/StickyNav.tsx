// src/components/layout/StickyNav.tsx

import React from "react";

interface StickyNavProps {
  activeTab: string;
  onModelsClick?: () => void;
  onSafetyClick?: () => void;
  onBuildClick?: () => void;
  onPerformanceClick?: () => void;
  className?: string;
}

const StickyNav: React.FC<StickyNavProps> = ({
  activeTab,
  onModelsClick,
  onBuildClick,
  onSafetyClick,
  onPerformanceClick,
  className = "",
}) => {
  const navItems = [
    { name: "Models", handler: onModelsClick },
    { name: "Performance", handler: onPerformanceClick },
    { name: "Safety", handler: onSafetyClick },
    { name: "Build", handler: onBuildClick },
  ];

  return (
    <div className={`flex justify-center ${className}`}>
      <nav className="flex items-center space-x-2 rounded-full bg-gray-900/80 p-2 backdrop-blur-sm border border-white/10">
        <div className="flex items-center overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navItems.map((item) => {
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={item.handler || (() => {})}
                className={`rounded-full px-8 py-4 text-sm font-medium flex-shrink-0 transition-colors duration-300
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-blue-300 text-white shadow-md"
                      : "text-gray-300 hover:text-white"
                  }`}
              >
                {item.name}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default StickyNav;
