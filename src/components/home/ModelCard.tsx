// src/components/home/ModelCard.tsx

import React from "react";

interface ModelCardProps {
  title: string;
  description: string;
}

const ModelCard = ({ title, description }: ModelCardProps) => {
  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-[#0d0d0d] p-6 text-center">
      {/* Placeholder for the diagram */}
      <div className="mb-6 flex justify-center">
        <svg
          width="200"
          height="120"
          viewBox="0 0 200 120"
          className="opacity-75"
        >
          <defs>
            <g id="a">
              <path fill="#2563eb" d="M2.5 0h-5L0 5l2.5-5z"></path>
              <path fill="#3b82f6" d="M2.5 0h5L5 5l-2.5-5z"></path>
            </g>
          </defs>
          <g transform="translate(100 20)">
            <g transform="translate(0 0)">
              <use href="#a"></use>
            </g>
            <g transform="translate(-10 10)">
              <use href="#a"></use>
            </g>
            <g transform="translate(10 10)">
              <use href="#a"></use>
            </g>
            <g transform="translate(-20 20)">
              <use href="#a"></use>
            </g>
            <g transform="translate(0 20)">
              <use href="#a"></use>
            </g>
            <g transform="translate(20 20)">
              <use href="#a"></use>
            </g>
          </g>
          <rect
            x="50"
            y="55"
            width="100"
            height="2"
            fill="#3b82f6"
            opacity="0.5"
          ></rect>
          <g transform="translate(100 90)">
            <g transform="translate(0 0)">
              <use href="#a" opacity="0.7"></use>
            </g>
            <g transform="translate(-40 0)">
              <use href="#a" opacity="0.7"></use>
            </g>
            <g transform="translate(40 0)">
              <use href="#a" opacity="0.7"></use>
            </g>
            <g transform="translate(-20 10)">
              <use href="#a" opacity="0.7"></use>
            </g>
            <g transform="translate(20 10)">
              <use href="#a" opacity="0.7"></use>
            </g>
            <g transform="translate(0 20)">
              <use href="#a" opacity="0.7"></use>
            </g>
          </g>
        </svg>
      </div>
      <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
        General Availability
      </p>
      <h3 className="mt-2 text-2xl font-medium">{title}</h3>
      <p className="mt-2 text-gray-400 flex-grow">{description}</p>
      <a
        href="#"
        className="mt-6 font-medium text-blue-400 hover:text-blue-300"
      >
        Learn more
      </a>
    </div>
  );
};

export default ModelCard;
