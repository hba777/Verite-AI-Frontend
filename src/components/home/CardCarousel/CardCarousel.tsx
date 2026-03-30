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
  const [isHovered, setIsHovered] = useState(false);



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
      imageUrl: "/Carouselimages/01.png",
      title: "Image Deepfake Detection",
      description:
        "Verité AI applies an EfficientNet-B4 classifier to flag manipulated facial regions, returning a Real/Fake verdict with a calibrated confidence score and a Grad-CAM heatmap overlay.",
    },
    {
      imageUrl: "/Carouselimages/02.png",
      title: "Video Frame-Level Analysis",
      description:
        "An asynchronous Celery pipeline extracts frames, runs per-frame inference, and aggregates results temporally — delivering a video-level verdict with per-frame attribution on Celeb-DF and FF++ sequences.",
    },
    {
      imageUrl: "/Carouselimages/03.png",
      title: "Audio Voice Cloning Detection",
      description:
        "The SSL-AASIST classifier (WavLM features, wav2vec2-large-xlsr-53 backbone) detects TTS and voice-conversion attacks, outputting a confidence score and a temporal attribution overlay on the waveform.",
    },
    {
      imageUrl: "/Carouselimages/04.png",
      title: "Grad-CAM Explainability Viewer",
      description:
        "Interactive heatmap viewer renders gradient-weighted activation maps on the original image or video frame, localising the artefact regions that drove the model's Fake classification.",
    },
    {
      imageUrl: "/Carouselimages/05.png",
      title: "Downloadable PDF Forensic Report",
      description:
        "Each detection generates a structured PDF report containing the verdict, confidence score, Grad-CAM heatmap, temporal XAI overlay, and an LLM-narrated justification — ready for academic or legal review.",
    },
    {
      imageUrl: "/Carouselimages/06.png",
      title: "Admin Dashboard &amp; User History",
      description:
        "Administrators can monitor system metrics, manage user accounts, review per-user detection history, and access feedback logs from a dedicated Django-style admin panel.",
    },
  ];

  // Auto-scroll every 5 seconds, but pause while dragging or when hovered/touched
  useEffect(() => {
    if (isDragging || isHovered) return; // pause auto-scroll during interaction

    const id = window.setInterval(() => {
      setCurrentIndex((prev) => (prev === cardData.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => window.clearInterval(id);
  }, [isDragging, isHovered, cardData.length]);

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
              System Capabilities Overview
            </motion.h2>

            <motion.p
              className="mt-4 max-w-xl mx-auto text-[1.75rem] text-gray-400 font-medium pb-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: false, amount: 0.4 }}
            >
              Explore the full detection pipeline of Verité AI — from image and
              video deepfake classification to audio forgery detection, XAI
              visualisation, and PDF report generation.
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
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
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
