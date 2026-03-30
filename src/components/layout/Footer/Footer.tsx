// src/components/layout/Footer.tsx

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

const Footer = React.forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <footer ref={ref} className="bg-black text-gray-500 py-12 px-6">
      <div className="container mx-auto max-w-5xl">

        {/* Top row: brand + links */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-10 border-b border-gray-900 pb-10">

          {/* Brand + tagline */}
          <div className="max-w-xs">
            <p className="text-white text-lg font-semibold tracking-tight">Vérité AI</p>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              Detecting synthetic media with precision.
            </p>
          </div>

          {/* Features + GitHub side by side */}
          <div className="flex gap-16">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-600 mb-4">Features</p>
              <ul className="space-y-2 text-sm text-gray-400">
                {["Image Detection", "Video Analysis", "Audio Deepfakes", "Real-time Results"].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors duration-150">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-gray-600 mb-4">Source</p>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-150 text-xl">
                <FontAwesomeIcon icon={faGithub} />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 text-xs text-gray-700">
          <span>© {new Date().getFullYear()} Vérité AI. All rights reserved.</span>
          <div className="flex gap-5">
            <a href="#" className="hover:text-gray-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Terms</a>
          </div>
        </div>

      </div>
    </footer>
  );
});

Footer.displayName = "Footer";
export default Footer;