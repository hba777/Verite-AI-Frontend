// src/components/home/HandsOnSection.tsx

import React from "react";

const HandsOnSection = React.forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <section ref={ref} className="bg-black text-white py-24 sm:py-32 px-4">
      <div className="container mx-auto text-center">
        {/* Top Part: Accessing Models */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-medium">
            Accessing our latest AI models
          </h2>
          <p className="mt-4 text-2xl text-gray-400">
            We want developers to gain access to our models as quickly as
            possible. We're making these available through Google AI Studio.
          </p>
          <a
            href="#"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-bold text-white transition-all duration-300 hover:brightness-110 shadow-md"
          >
            Sign in to Google AI Studio
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* Bottom Part: Get Updates Form */}
      <section className="flex justify-center items-center min-h-screen bg-black px-4">
        <div className="w-full max-w-6xl bg-gradient-to-r from-[#d0e2ff] to-[#dfe3ff] rounded-[3rem] lg:rounded-[300px] px-8 py-20 sm:px-20 lg:px-60 sm:py-32 text-center">
          <h3 className="text-3xl sm:text-5xl font-medium text-black pb-4">
            Get the latest updates
          </h3>
          <p className="mt-2 text-gray-700">
            Sign up for news on the latest innovations from Google DeepMind.
          </p>

          <form className="mt-8 flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
            <div className="relative flex-grow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <input
                type="email"
                placeholder="Email address"
                className="w-full rounded-full border border-black bg-transparent py-3 pl-11 pr-4 placeholder:text-black text-black focus:border-black focus:ring-black"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-3 font-bold text-white transition-all duration-300 hover:brightness-110 shadow-md"
            >
              Sign up
            </button>
          </form>

          <p className="mt-4 text-xs text-gray-600">
            I accept Google's Terms and Conditions and acknowledge that my
            information will be used in accordance with{" "}
            <a href="#" className="underline text-black hover:text-gray-900">
              Google's Privacy Policy.
            </a>
          </p>
        </div>
      </section>
    </section>
  );
});

HandsOnSection.displayName = "HandsOnSection";
export default HandsOnSection;
