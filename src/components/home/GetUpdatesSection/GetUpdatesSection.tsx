// src/components/home/HandsOnSection.tsx

import React from "react";
import { motion } from "framer-motion";
import { LuSquareArrowOutUpRight } from "react-icons/lu";

const GetUpdatesSection = React.forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <section ref={ref} className="bg-black text-white py-24 sm:py-32 px-4">
      <div className="container mx-auto text-center">
        {/* Top Part: Accessing Models */}
        <div className="max-w-3xl mx-auto">
          <motion.h2
            className="text-4xl sm:text-5xl font-medium pb-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: false, amount: 0.4 }}
          >
            Accessing our latest AI models
          </motion.h2>

          <motion.p
            className="mt-4 text-3xl text-gray-400 max-w-2xl text-center mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: false, amount: 0.4 }}
          >
            We want developers to gain access to our models as quickly as
            possible. We're making these available through Google AI Studio.
          </motion.p>

          <motion.a
            href="#"
            className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold text-white transition-all duration-300 shadow-md"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #3b6bff, #2e96ff 65%, #acb7ff)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.filter = "brightness(0.9)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.filter = "brightness(1)")
            }
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            viewport={{ once: false, amount: 0.4 }}
          >
            Sign in to Google AI Studio
            <LuSquareArrowOutUpRight strokeWidth={3} className="ml-2" />
          </motion.a>
        </div>
      </div>

      {/* Bottom Part: Get Updates Form */}
      <section className="flex justify-center items-center pt-20 bg-black px-4">
        <div
          className="w-full max-w-6xl rounded-[3rem] lg:rounded-[300px] px-8 py-20 sm:px-20 lg:px-60 sm:py-32 text-center"
          style={{
            backgroundImage:
              "linear-gradient(90deg, #d7e6ff 6.02%, #c7e4ff 51.92%, #dce2ff 96.44%)",
          }}
        >
          <h3 className="text-3xl sm:text-5xl font-medium text-black pb-4">
            Get the latest updates
          </h3>
          <p className="mt-2 text-gray-900">
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
                className="w-full rounded-lg border border-black bg-transparent py-3 pl-11 pr-4 text-black placeholder:text-black focus:border-black focus:outline-none autofill:bg-transparent autofill:text-black autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255,0)]"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto rounded-full px-8 py-3 font-bold text-white transition-all duration-300 shadow-md"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #3b6bff, #2e96ff 65%, #acb7ff)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.filter = "brightness(0.9)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.filter = "brightness(1)")
              }
            >
              Sign up
            </button>
          </form>

          <p className="mt-4 text-xs text-gray-900">
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

GetUpdatesSection.displayName = "GetUpdatesSection";
export default GetUpdatesSection;
