import { useRouter } from "next/router";
import type { NextPage } from "next";
import Head from "next/head";
import HeroSection from "@/components/home/HeroSection";
import Header from "@/components/layout/Header";
import ModelFamilySection from "@/components/home/ModelFamilySection";
import ReasoningSection from "@/components/home/ReasoningSection";
import React, { useState, useEffect, useRef } from "react";
import StickyNav from "@/components/layout/StickyNav";
import HandsOnSection from "@/components/home/HandsOnSection";
import Footer from "@/components/layout/Footer";
import DeveloperEcosystemSection from "@/components/home/DeveloperEcosystemSection";
import DeveloperBuildSection from "@/components/home/DeveloperBuildSection";
import SafetySection from "@/components/home/SafetySection";
import PerformanceSection from "@/components/home/PerformanceSection";
import BenchmarkTable from "@/components/home/BenchmarkTable";

const Home: NextPage = () => {
  const [isHeaderVisible, setHeaderVisible] = useState(true);
  const [isFixedNavVisible, setFixedNavVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("Models");
  const router = useRouter();

  const staticNavRef = useRef<HTMLDivElement>(null);
  const modelFamilyRef = useRef<HTMLDivElement>(null);
  const handsOnRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const ecosystemRef = useRef<HTMLDivElement>(null);
  const buildRef = useRef<HTMLDivElement>(null);
  const safetyRef = useRef<HTMLDivElement>(null);
  const performanceRef = useRef<HTMLDivElement>(null);

  const sectionRefs = [
    { name: "Models", ref: modelFamilyRef },
    { name: "Safety", ref: safetyRef },
    { name: "Build", ref: buildRef },
    { name: "Build", ref: ecosystemRef }, // still considered part of Build
    { name: "Performance", ref: performanceRef },
  ];

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      // Header visibility logic
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
      lastScrollY = window.scrollY;

      // Sticky nav anchor tracking
      if (staticNavRef.current) {
        setFixedNavVisible(
          staticNavRef.current.getBoundingClientRect().top < 0
        );
      }

      // Track which tab is active
      let currentTab: string | null = null;

      for (const section of sectionRefs) {
        const rect = section.ref.current?.getBoundingClientRect();
        if (rect && rect.top <= 150 && rect.bottom >= 150) {
          currentTab = section.name;
          break;
        }
      }

      // Update active tab and nav visibility
      setActiveTab(currentTab || "");
      setFixedNavVisible(!!currentTab); // hide nav if no tab matches
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const createScrollHandler =
    (ref: React.RefObject<HTMLDivElement | null>) => () => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

  return (
    <div className="font-sans bg-black">
      <Head>
        <title>Gemini</title>
        <meta name="description" content="Our most intelligent AI models" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header isVisible={isHeaderVisible} />
      <HeroSection />
      <ReasoningSection
        navRef={staticNavRef}
        onModelsClick={createScrollHandler(modelFamilyRef)}
      />
      <ModelFamilySection ref={modelFamilyRef} />
      <div ref={performanceRef}>
        <PerformanceSection />
        <BenchmarkTable />
      </div>
      <SafetySection ref={safetyRef} />
      <DeveloperBuildSection ref={buildRef} />
      <DeveloperEcosystemSection ref={ecosystemRef} />
      <HandsOnSection ref={handsOnRef} />
      <Footer ref={footerRef} />

      {isFixedNavVisible && (
        <StickyNav
          activeTab={activeTab}
          onModelsClick={createScrollHandler(modelFamilyRef)}
          onSafetyClick={createScrollHandler(safetyRef)}
          onBuildClick={createScrollHandler(buildRef)}
          className="fixed top-5 left-0 right-0 z-40 animate-in fade-in duration-300"
        />
      )}

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
