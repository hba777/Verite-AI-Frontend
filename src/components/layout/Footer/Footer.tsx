// src/components/layout/Footer.tsx

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXTwitter,
  faInstagram,
  faYoutube,
  faLinkedin,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

const Footer = React.forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <footer ref={ref} className="text-gray-400 py-16 px-4">
      <div className="container mx-auto">
        {/* Top: Social Links */}
        <div className="flex flex-wrap items-center gap-6 border-b border-gray-800 pb-8">
          <span className="text-white text-lg font-medium">Follow us</span>

          <a
            href="#"
            className="hover:text-white text-gray-300 text-4xl font-bold transition"
          >
            <FontAwesomeIcon icon={faXTwitter} />
          </a>
          <a
            href="#"
            className="hover:text-white text-gray-300 text-4xl font-bold transition"
          >
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a
            href="#"
            className="hover:text-white text-gray-300 text-4xl font-bold transition"
          >
            <FontAwesomeIcon icon={faYoutube} />
          </a>
          <a
            href="#"
            className="hover:text-white text-gray-300 text-4xl font-bold transition"
          >
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
          <a
            href="#"
            className="hover:text-white text-gray-300 text-4xl font-bold transition"
          >
            <FontAwesomeIcon icon={faGithub} />
          </a>
        </div>

        {/* Middle: Main Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-16 gap-y-10 py-12">
          {/* Column 1 */}
          <div className="text-3xl font-bold text-white col-span-1">
            Build AI responsibly to benefit humanity
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-xl font-bold text-white">Models</h4>
            <p className="text-sm text-gray-400 mt-1">
              Build with our next generation AI systems
            </p>
            <ul className="mt-4 space-y-3 text-lg font-semibold text-gray-300">
              <li>
                <a href="#" className="hover:text-white">
                  Gemini
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Gemma
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Veo
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Imagen
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Lyria
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-xl font-bold text-white">Science</h4>
            <p className="text-sm text-gray-400 mt-1">
              Unlocking a new era of discovery with AI
            </p>
            <ul className="mt-4 space-y-3 text-lg font-semibold text-gray-300">
              <li>
                <a href="#" className="hover:text-white">
                  AlphaFold
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  SynthiD
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  WeatherNext
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div></div>
          <div>
            <h4 className="text-xl font-bold text-white">Learn more</h4>
            <ul className="mt-4 space-y-3 text-lg font-semibold text-gray-300">
              <li>
                <a href="#" className="hover:text-white">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  News
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Research
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Responsibility & Safety
                </a>
              </li>
            </ul>
          </div>

          {/* Sign-up Form */}
          <div>
            <p className="text-base font-normal text-gray-400">
              Sign up for updates on our latest innovations
            </p>

            <p className="mt-4 text-sm text-gray-400">
              I accept Google's Terms and Conditions and acknowledge that my
              information will be used in accordance with{" "}
              <a href="#" className="underline hover:text-gray-300">
                Google's Privacy Policy.
              </a>
            </p>

            <form className="mt-4 relative">
              <input
                type="text"
                placeholder="Email Address"
                className="w-full rounded-full bg-[#141414] p-5 pr-10 text-gray-400 placeholder:text-gray-400 focus:outline-none"
              />
              <span className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 select-none">
                &gt;
              </span>
            </form>
          </div>
        </div>

        {/* Bottom: Google Links */}
        <div className="flex flex-col sm:flex-row items-center gap-6 border-t border-gray-800 pt-8 mt-16">
          <span className="text-2xl text-white font-semibold">Google</span>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-lg font-medium">
            <a href="#" className="hover:text-white">
              About Google
            </a>
            <a href="#" className="hover:text-white">
              Google products
            </a>
            <a href="#" className="hover:text-white">
              Privacy
            </a>
            <a href="#" className="hover:text-white">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";
export default Footer;
