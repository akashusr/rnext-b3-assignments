import React from "react";

// A simple SVG icon to represent a failed image load or error
const FailedImageIcon = () => (
  <svg
    className="w-12 h-12 text-zinc-600 group-hover:text-zinc-500 transition-colors"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1-1m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M15 9l-6 6m0-6l6 6" // This creates an 'X' over the landscape
    ></path>
  </svg>
);

const FailedImageCard = () => {
  return (
    <div
      className="w-full h-48 bg-zinc-800/50 border border-dashed border-zinc-700/60 rounded-xl
                 flex flex-col items-center justify-center text-center p-4 group
                 hover:bg-zinc-800/70 hover:border-zinc-700/80 transition-colors"
    >
      <FailedImageIcon />
      <p className="text-zinc-500 group-hover:text-zinc-400 text-sm mt-2 transition-colors">
        Image unavailable
      </p>
    </div>
  );
};

export default FailedImageCard;
