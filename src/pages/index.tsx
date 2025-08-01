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

const Home: NextPage = () => {
  const [isHeaderVisible, setHeaderVisible] = useState(true);
  const [isFixedNavVisible, setFixedNavVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("Models");
  const router = useRouter();

  // Refs for scrolling targets and triggers
  const staticNavRef = useRef<HTMLDivElement>(null);
  const modelFamilyRef = useRef<HTMLDivElement>(null);
  const handsOnRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const sectionRefs = [
    { name: "Models", ref: modelFamilyRef },
    { name: "Hands-on", ref: handsOnRef },
    { name: "Footer", ref: footerRef },
  ];

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      // Logic for top header visibility
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
      lastScrollY = window.scrollY;

      // Logic for the fixed sticky nav
      if (staticNavRef.current) {
        setFixedNavVisible(
          staticNavRef.current.getBoundingClientRect().top < 0
        );
      }

      // Logic for active tab highlighting
      for (const section of sectionRefs) {
        const rect = section.ref.current?.getBoundingClientRect();
        if (rect && rect.top <= 150 && rect.bottom >= 150) {
          setActiveTab(section.name);
          break;
        }
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
    <div className="font-sans bg-black">
      <Head>
        <title>Gemini</title>
        <meta name="description" content="Our most intelligent AI models" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header isVisible={isHeaderVisible} />
      {/* RENDER ALL SECTIONS IN ORDER */}
      <HeroSection />
      <ReasoningSection
        navRef={staticNavRef}
        onModelsClick={createScrollHandler(modelFamilyRef)}
      />
      <ModelFamilySection ref={modelFamilyRef} />
      <HandsOnSection ref={handsOnRef} />
      <Footer ref={footerRef} />
      {/* RENDER THE FIXED NAVIGATION BAR */}
      {isFixedNavVisible && (
        <StickyNav
          activeTab={activeTab}
          onModelsClick={createScrollHandler(modelFamilyRef)}
          onHandsOnClick={createScrollHandler(handsOnRef)}
          onFooterClick={createScrollHandler(footerRef)}
          className="fixed top-5 left-0 right-0 z-40 animate-in fade-in duration-300"
        />
      )}
      <div
        className={
          "grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20"
        }
      >
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
