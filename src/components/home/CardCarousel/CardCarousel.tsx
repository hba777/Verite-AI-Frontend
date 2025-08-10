import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

// Card props - Removed unnecessary navigation functions
interface CardProps {
  imageUrl: string;
  title: string;
  description: string;
  isActive: boolean;
  isMobile: boolean;
}

const Card: React.FC<CardProps> = ({
  imageUrl,
  title,
  description,
  isActive,
  isMobile,
}) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [headingWidth, setHeadingWidth] = useState<number | null>(null);

  useEffect(() => {
    if (headingRef.current) {
      setHeadingWidth(headingRef.current.offsetWidth);
    }
  }, [title, isActive]);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Image Container - relative required for positioning the button */}
      <div className="p-2 w-[130%] sm:w-full transition-all duration-300 group relative">
        {/* container uses responsive aspect ratios from the real site */}
        <div className="relative w-full aspect-[311/345] md:aspect-[610/343] max-h-[500px] md:max-h-[600px]">
          <img
            src={imageUrl}
            alt={title}
            className={`absolute inset-0 w-full h-full object-cover rounded-[30px] border-2 transition-all duration-300 pointer-events-none border-transparent ${
              isActive ? "group-hover:border-blue-500" : ""
            }`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src =
                "https://placehold.co/600x400/333/FFF?text=Image+Not+Found";
            }}
          />

          {/* START: Bottom Right Play Button */}
          {isActive && (
            <a
              href="#"
              onClick={(e) => {
                // Prevent the click from triggering the carousel's drag handlers
                e.stopPropagation();
              }}
              // same classes, still positioned absolutely inside the aspect box
              className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/80 transition-all scale-100 hover:scale-110"
              aria-label="Play"
            >
              {/* SVG for Play symbol */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 ml-0.5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </a>
          )}
          {/* END: Bottom Right Play Button */}
        </div>
      </div>

      {/* Text */}
      {isActive && (
        <div className="p-4 w-full text-center flex flex-col items-center">
          <h2
            ref={headingRef}
            className="text-2xl md:text-3xl font-bold mb-2 text-white inline-block"
          >
            {title}
          </h2>
          <p
            className="text-gray-400 text-base md:text-lg"
            style={{
              maxWidth: headingWidth ? `${headingWidth}px` : "100%",
            }}
          >
            {description}
          </p>
        </div>
      )}
    </div>
  );
};

const CardCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  // --- States for drag functionality ---
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const dragThreshold = 50; // Min pixels to drag to trigger a slide change

  // Track screen size
  useEffect(() => {
    const updateIsMobile = () => setIsMobile(window.innerWidth < 768);
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  // Card data
  const cardData = [
    {
      imageUrl: "https://placehold.co/600x400/000000/FFFFFF?text=Cosmic+Fish",
      title: "Make an interactive animation",
      description:
        'See how Gemini 2.5 Pro uses its reasoning capabilities to create an interactive animation of "cosmic fish" with a simple prompt.',
    },
    {
      imageUrl: "/CarouselTest.png",
      title: "Explore Creative Designs",
      description:
        "Discover a new world of creative possibilities and bring your unique ideas to life with powerful design tools and inspiration.",
    },
    {
      imageUrl: "https://placehold.co/600x400/0d0d0d/FFFFFF?text=Code+Smart",
      title: "Code Smarter, Not Harder",
      description:
        "Leverage AI-powered tools to streamline your development workflow, write cleaner code, and solve complex problems faster.",
    },
    {
      imageUrl: "https://placehold.co/600x400/2a2a2a/FFFFFF?text=Data+Insights",
      title: "Unlock Data Insights",
      description:
        "Turn complex datasets into actionable insights with advanced analytics and visualization tools.",
    },
    {
      imageUrl: "https://placehold.co/600x400/1f1f1f/FFFFFF?text=New+Horizons",
      title: "Discover New Horizons",
      description:
        "Embark on a journey of discovery and innovation with tools that expand your creative universe.",
    },
    {
      imageUrl:
        "https://placehold.co/600x400/3c3c3c/FFFFFF?text=Final+Frontier",
      title: "The Final Frontier",
      description:
        "Push the boundaries of what is possible and explore the final frontier of digital creation.",
    },
  ];

  // --- Navigation and Drag Handlers ---
  const goToNext = () => {
    setCurrentIndex((prev) => (prev === cardData.length - 1 ? prev : prev + 1));
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? 0 : prev - 1));
  };

  const goToSlide = (index: number) => setCurrentIndex(index);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); // Prevent default drag behavior
    setIsDragging(true);
    const startPosition = "touches" in e ? e.touches[0].clientX : e.clientX;
    setStartX(startPosition);
    setDragOffset(0); // Reset offset
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const currentPosition = "touches" in e ? e.touches[0].clientX : e.clientX;
    let offset = currentPosition - startX;

    // Clamp dragging beyond edges:
    if (currentIndex === 0 && offset > 0) {
      // Prevent dragging to right beyond first slide
      offset = Math.min(offset, 50); // allow slight resistance
    } else if (currentIndex === cardData.length - 1 && offset < 0) {
      // Prevent dragging to left beyond last slide
      offset = Math.max(offset, -50); // slight resistance left side
    }

    setDragOffset(offset);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);

    // Change slide if dragThreshold is met
    if (dragOffset < -dragThreshold) {
      goToNext();
    } else if (dragOffset > dragThreshold) {
      goToPrevious();
    }

    setDragOffset(0); // Reset offset after drag ends
  };

  return (
    <div className="min-h-screen text-white p-6 md:p-12 flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full max-w-7xl flex flex-col items-center">
        {/* Intro Section */}
        <div className="text-white relative">
          <section className="container mx-auto px-6 py-20 text-center">
            <motion.h2
              className="text-5xl font-medium pb-7"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: false, amount: 0.4 }}
            >
              Hands-on with Gemini 2.5
            </motion.h2>

            <motion.p
              className="mt-4 max-w-xl mx-auto text-[1.75rem] text-gray-400 font-medium pb-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: false, amount: 0.4 }}
            >
              See how Gemini 2.5 uses its reasoning capabilities to create
              interactive simulations and do advanced coding.
            </motion.p>
          </section>
        </div>
        {/* Carousel Container */}
        <div
          className="relative w-full h-[500px] md:h-[700px] flex items-center justify-center cursor-grab active:cursor-grabbing"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          onMouseMove={handleDragMove}
          onTouchMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchEnd={handleDragEnd}
        >
          {cardData.map((card, index) => {
            const distance = index - currentIndex;
            const absDistance = Math.abs(distance);
            const isActive = index === currentIndex;

            if (!isActive && isMobile) return null;
            if (absDistance > 1 && !isMobile) return null;

            const translateX = isMobile ? 0 : distance * 105;
            const scale = isActive ? 1 : 0.92;
            const rotate = isActive
              ? ""
              : distance < 0
              ? "-rotate-2"
              : "rotate-2";
            const zIndex = 100 - absDistance;

            return (
              <div
                key={index}
                className={`absolute w-[83%] md:w-[min(56vw,850px)] max-w-[850px] ${rotate}`}
                style={{
                  transform: `translateX(calc(${translateX}% + ${dragOffset}px)) translateY(${
                    isActive ? "0px" : "-70px"
                  }) scaleY(${isActive ? 1 : 0.85})`,
                  opacity: isActive ? 1 : 0.7,
                  zIndex,
                  transition: isDragging ? "none" : "all 0.5s ease-out",
                }}
              >
                <Card {...card} isActive={isActive} isMobile={isMobile} />
              </div>
            );
          })}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center space-x-3 mt-8 pt-20">
          {cardData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full cursor-pointer transition-all duration-500 ease-out h-3 ${
                currentIndex === index
                  ? "w-13"
                  : "w-3 bg-transparent border border-white"
              }`}
              style={{
                backgroundImage:
                  currentIndex === index
                    ? "linear-gradient(90deg, #3b6bff, #2e96ff 65%, #acb7ff)"
                    : undefined,
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardCarousel;
