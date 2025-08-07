import React from "react";

interface StickyNavProps {
  activeTab: string;
  onModelsClick?: () => void;
  onSafetyClick?: () => void;
  onBuildClick?: () => void;
  onPerformanceClick?: () => void;
  onHandsOnClick?: () => void;
  className?: string;
}

const StickyNav: React.FC<StickyNavProps> = ({
  activeTab,
  onModelsClick,
  onBuildClick,
  onSafetyClick,
  onPerformanceClick,
  onHandsOnClick,
  className = "",
}) => {
  const navItems = [
    { name: "Models", handler: onModelsClick },
    { name: "Hands-on", handler: onHandsOnClick },
    { name: "Performance", handler: onPerformanceClick },
    { name: "Safety", handler: onSafetyClick },
    { name: "Build", handler: onBuildClick },
  ];

  return (
    <div className={`w-full px-4 sm:px-0 ${className}`}>
      <nav
        className="mx-auto max-w-fit sm:max-w-max flex items-center space-x-2 rounded-full bg-gray-900/80 p-2 backdrop-blur-sm border border-white/10 overflow-x-auto sm:overflow-visible"
        style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE 10+
        }}
      >
        <style jsx>{`
          nav::-webkit-scrollbar {
            display: none; /* Chrome, Safari */
          }
        `}</style>
        {navItems.map((item) => {
          const isActive = activeTab === item.name;
          return (
            <button
              key={item.name}
              onClick={item.handler || (() => {})}
              className={`rounded-full px-8 py-4 text-base font-medium flex-shrink-0 transition-colors duration-300
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
      </nav>
    </div>
  );
};

export default StickyNav;
