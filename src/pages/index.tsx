import { useRouter } from "next/router";
import type { NextPage } from "next";
import Head from "next/head";
import HeroSection from "@/components/home/HeroSection";
import Header from "@/components/layout/Header";

export default function Home() {
  const router = useRouter();
  return (
    <div>
      <div className="font-sans">
        <Head>
          <title>Gemini</title>
          <meta name="description" content="Our most intelligent AI models" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header />
        <HeroSection />
      </div>
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
}
