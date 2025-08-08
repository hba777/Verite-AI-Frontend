import { useRouter } from "next/router";
import type { NextPage } from "next";
import Head from "next/head";
import HeroSection from "@/components/home/HeroSection";
import Header from "@/components/layout/Header";
import ModelFamilySection from "@/components/home/ModelFamilySection";
import ReasoningSection from "@/components/home/ReasoningSection";
import React, { useState, useEffect, useRef } from "react";
import StickyNav from "@/components/layout/StickyNav";
import GetUpdatesSection from "@/components/home/GetUpdatesSection";
import Footer from "@/components/layout/Footer";
import DeveloperEcosystemSection from "@/components/home/DeveloperEcosystemSection";
import DeveloperBuildSection from "@/components/home/DeveloperBuildSection";
import SafetySection from "@/components/home/SafetySection";
import PerformanceSection from "@/components/home/PerformanceSection";
import BenchmarkTable from "@/components/home/BenchmarkTable";
import HandsOn from "@/components/home/Hands-OnSection";
import CardCarousel from "@/components/home/CardCarousel";

const Home: NextPage = () => {
  const [isHeaderVisible, setHeaderVisible] = useState(true);
  const [isFixedNavVisible, setFixedNavVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("Models");
  const [isAtTop, setIsAtTop] = useState(true);

  const router = useRouter();

  // Refs
  const staticNavRef = useRef<HTMLDivElement>(null);
  const modelFamilyRef = useRef<HTMLDivElement>(null);
  const getUpdatesRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const ecosystemRef = useRef<HTMLDivElement>(null);
  const buildRef = useRef<HTMLDivElement>(null);
  const safetyRef = useRef<HTMLDivElement>(null);
  const performanceRef = useRef<HTMLDivElement>(null);
  const handsOnRef = useRef<HTMLDivElement>(null);

  const sectionRefs = [
    { name: "Models", ref: modelFamilyRef },
    { name: "Hands-on", ref: handsOnRef },
    { name: "Safety", ref: safetyRef },
    { name: "Build", ref: buildRef },
    { name: "Build", ref: ecosystemRef },
    { name: "Performance", ref: performanceRef },
  ];

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      // 1. Header hide/show
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
      lastScrollY = window.scrollY;

      // 2. Show floating StickyNav only if static one is out of view
      if (staticNavRef.current) {
        const staticRect = staticNavRef.current.getBoundingClientRect();
        setFixedNavVisible(staticRect.bottom < 0);
      }

      // 3. Active tab tracking
      let currentTab: string | null = null;
      for (const section of sectionRefs) {
        const rect = section.ref.current?.getBoundingClientRect();
        if (rect && rect.top <= 150 && rect.bottom >= 150) {
          currentTab = section.name;
          break;
        }
      }
      setActiveTab(currentTab || "");

      // 4. Track if at top (inside hero section) for header border toggle
      if (window.scrollY > 100) {
        setIsAtTop(false);
      } else {
        setIsAtTop(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const createScrollHandler =
    (ref: React.RefObject<HTMLDivElement | null>) => () => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

  return (
    <div className="font-sans bg-[#060606]">
      <Head>
        <title>Gemini</title>
        <meta name="description" content="Our most intelligent AI models" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Main Header */}
      <div className="relative z-[1000]">
        <Header isVisible={isHeaderVisible} isAtTop={isAtTop} />
      </div>

      {/* Floating StickyNav (appears only after ReasoningSection nav scrolls away) */}
      {isFixedNavVisible && (
        <StickyNav
          activeTab={activeTab}
          onModelsClick={createScrollHandler(modelFamilyRef)}
          onHandsOnClick={createScrollHandler(handsOnRef)}
          onPerformanceClick={createScrollHandler(performanceRef)}
          onSafetyClick={createScrollHandler(safetyRef)}
          onBuildClick={createScrollHandler(buildRef)}
          className={`w-full transition-all duration-300 fixed left-0 right-0 ${
            isHeaderVisible ? "top-[100px] z-[999]" : "top-5 z-[1000]"
          }`}
        />
      )}

      {/* Sections */}
      <HeroSection />
      <ReasoningSection
        navRef={staticNavRef}
        activeTab={activeTab}
        onModelsClick={createScrollHandler(modelFamilyRef)}
        onHandsOnClick={createScrollHandler(handsOnRef)}
        onPerformanceClick={createScrollHandler(performanceRef)}
        onSafetyClick={createScrollHandler(safetyRef)}
        onBuildClick={createScrollHandler(buildRef)}
      />
      <ModelFamilySection ref={modelFamilyRef} />
      <div ref={handsOnRef}>
        <CardCarousel />
        <HandsOn />
      </div>
      <div ref={performanceRef}>
        <PerformanceSection />
        <BenchmarkTable />
      </div>
      <SafetySection ref={safetyRef} />
      <DeveloperBuildSection ref={buildRef} />
      <DeveloperEcosystemSection ref={ecosystemRef} />
      <GetUpdatesSection ref={getUpdatesRef} />
      <Footer ref={footerRef} />

      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <button
          className="bg-white rounded text-black px-6 cursor-pointer"
          onClick={() => router.push("/dashboard")}
        >
          Open
        </button>
      </div>
    </div>
  );
};

export default Home;
