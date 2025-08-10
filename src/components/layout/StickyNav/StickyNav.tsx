import React, { useEffect, useRef, useState } from "react";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [isVisible, setIsVisible] = useState(true);

  const navItems = [
    { name: "Models", handler: onModelsClick },
    { name: "Hands-on", handler: onHandsOnClick },
    { name: "Performance", handler: onPerformanceClick },
    { name: "Safety", handler: onSafetyClick },
    { name: "Build", handler: onBuildClick },
  ];

  // Scroll active tab into center
  useEffect(() => {
    const container = containerRef.current;
    const activeButton = buttonRefs.current[activeTab];

    if (container && activeButton) {
      const containerWidth = container.offsetWidth;
      const buttonCenter =
        activeButton.offsetLeft + activeButton.offsetWidth / 2;
      const scrollTo = buttonCenter - containerWidth / 2;

      container.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
    }
  }, [activeTab]);

  // Observe "Build" section visibility to hide nav
  useEffect(() => {
    const buildSection = document.getElementById("build-section");
    if (!buildSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // If build section is NOT intersecting and user scrolled past it → hide nav
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      },
      { threshold: 0 }
    );

    observer.observe(buildSection);
    return () => observer.disconnect();
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`w-full px-4 sm:px-0 ${className}`}>
      <nav
        ref={containerRef}
        className="mx-auto max-w-fit sm:max-w-max flex items-center space-x-2 rounded-full bg-[#141414] p-1 backdrop-blur-sm border-white/10 overflow-x-auto sm:overflow-visible"
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
              ref={(el) => {
                buttonRefs.current[item.name] = el;
              }}
              onClick={item.handler || (() => {})}
              className={`rounded-full px-8 py-2.5 text-base font-medium flex-shrink-0 transition-colors duration-300 border border-transparent
                ${
                  isActive
                    ? "text-white shadow-md"
                    : "text-gray-300 hover:text-white hover:bg-[#222323] hover:border-white"
                }`}
              style={
                isActive
                  ? {
                      background:
                        "linear-gradient(90deg, #3b6bff, #2e96ff 65%, #acb7ff)",
                    }
                  : undefined
              }
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
