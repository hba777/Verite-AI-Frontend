import { useRouter } from "next/router";
import type { NextPage } from "next";
import Head from "next/head";
import HeroSection from "@/components/home/HeroSection/HeroSection";
import Header from "@/components/layout/Header/Header";
import ModelFamilySection from "@/components/home/ModelFamilySection/ModelFamilySection";
import ReasoningSection from "@/components/home/ReasoningSection/ReasoningSection";
import React, { useState, useEffect, useRef } from "react";
import StickyNav from "@/components/layout/StickyNav/StickyNav";
import GetUpdatesSection from "@/components/home/GetUpdatesSection/GetUpdatesSection";
import DeveloperEcosystemSection from "@/components/home/DeveloperEcosystemSection/DeveloperEcosystemSection";
import DeveloperBuildSection from "@/components/home/DeveloperBuildSection/DeveloperBuildSection";
import SafetySection from "@/components/home/SafetySection/SafetySection";
import PerformanceSection from "@/components/home/PerformanceSection/PerformanceSection";
import BenchmarkTable from "@/components/home/BenchmarkTable/BenchmarkTable";
import HandsOn from "@/components/home/Hands-OnSection/Hands-OnSection";
import CardCarousel from "@/components/home/CardCarousel/CardCarousel";
import Dashboard from "./dashboard";

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
    { name: "Detection", ref: modelFamilyRef },
    { name: "Features", ref: handsOnRef },
    { name: "Safety", ref: safetyRef },
    { name: "Integration", ref: buildRef },
    { name: "Integration", ref: ecosystemRef },
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

      // 2. Show floating StickyNav only if static one is out of view AND before ecosystem section ends
      let shouldShow = false;

      if (staticNavRef.current) {
        const staticRect = staticNavRef.current.getBoundingClientRect();
        shouldShow = staticRect.bottom < 0;
      }

      if (ecosystemRef.current) {
        const ecosystemRect = ecosystemRef.current.getBoundingClientRect();
        // Hide if we've scrolled past ecosystem section bottom
        if (ecosystemRect.bottom <= 0) {
          shouldShow = false;
        }
      }

      setFixedNavVisible(shouldShow);

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
      setIsAtTop(window.scrollY <= 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const createScrollHandler =
    (ref: React.RefObject<HTMLDivElement | null>) => () => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

  return (
    <div className="bg-[#060606]">
      <Head>
        <title>XDetect-RT</title>
        <meta
          name="description"
          content="Advanced Media Authenticity Detection Service"
        />
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
      <Dashboard />
    </div>
  );
};

export default Home;
