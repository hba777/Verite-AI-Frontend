import { useRouter } from "next/router";
import type { NextPage } from "next";
import Head from "next/head";

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

        {/* Header */}
        <header className="fixed inset-x-0 top-0 z-50 bg-black/30 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex h-20 items-center justify-between">
              <div className="flex items-center space-x-8">
                <a href="#" className="text-xl font-bold text-white">
                  Google DeepMind
                </a>
                <div className="hidden items-center space-x-8 md:flex">
                  <a
                    href="#"
                    className="text-gray-300 transition-colors hover:text-white"
                  >
                    Models
                  </a>
                  <a
                    href="#"
                    className="text-gray-300 transition-colors hover:text-white"
                  >
                    Research
                  </a>
                  <a
                    href="#"
                    className="text-gray-300 transition-colors hover:text-white"
                  >
                    Science
                  </a>
                  <a
                    href="#"
                    className="text-gray-300 transition-colors hover:text-white"
                  >
                    About
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href="#"
                  className="hidden rounded-full border border-gray-700 bg-gray-800/50 py-2 px-4 font-medium text-white transition-colors hover:bg-gray-700 sm:inline-block"
                >
                  Try Google AI Studio
                </a>
                <a
                  href="#"
                  className="hidden rounded-full border border-gray-700 bg-gray-800/50 py-2 px-4 font-medium text-white transition-colors hover:bg-gray-700 sm:inline-block"
                >
                  Try Gemini
                </a>
                <button className="rounded-full p-2 hover:bg-gray-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        {/* The `bg-gemini-gradient` class is a custom one we'll define in tailwind.config.js */}
        <main className="relative flex h-screen items-center justify-center overflow-hidden bg-black text-center text-white bg-[radial-gradient(ellipse_at_40%_20%,rgba(15,32,67,0.6)_0%,#000_75%)]">
          {/* Starfield Background Elements */}
          {/* These IDs are styled in globals.css for the complex box-shadow */}
          <div id="stars1" className="absolute inset-0"></div>
          <div id="stars2" className="absolute inset-0"></div>

          <div className="relative z-10 mx-auto max-w-4xl px-4">
            <h1 className="mb-4 text-6xl font-medium tracking-tight md:text-8xl">
              Gemini
            </h1>
            <p className="mb-8 text-xl text-gray-300 md:text-2xl">
              Our most intelligent AI models
            </p>
            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <a
                href="#"
                className="w-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 py-3 px-8 font-bold text-white transition-opacity hover:opacity-90 sm:w-auto"
              >
                Chat with Gemini
              </a>
              <a
                href="#"
                className="w-full rounded-full border border-gray-700 bg-gray-800/50 py-3 px-8 font-bold text-white transition-colors hover:bg-gray-700 sm:w-auto"
              >
                Try in Google AI Studio
              </a>
            </div>
          </div>
        </main>
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
