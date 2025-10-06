import React, { useState, useEffect } from "react";

const MetadataRow = ({ label, value }) => (
  <div className="flex justify-between items-center text-zinc-400 text-sm">
    <span className="font-semibold text-zinc-300">{label}:</span>
    <span className="font-mono bg-zinc-700/50 px-2 py-0.5 rounded">
      {value}
    </span>
  </div>
);

const ImageCompareModal = ({ images, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50); // Initial position at 50%

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  if (!images || images.length !== 2) return null;

  const [imageA, imageB] = images;
  const commonPrompt = imageA.prompt;
  const commonModel = imageA.model;
  const commonSize = `${imageA.width || "?"} x ${imageA.height || "?"} px`;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-opacity duration-200 ease-in-out ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-zinc-900 border border-zinc-700/50 rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto flex flex-col transform transition-all duration-200 ease-in-out custom-scrollbar ${
          isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 sticky top-0 bg-zinc-900/80 backdrop-blur-md z-20">
          <h2 className="text-xl font-bold text-white">Image Comparison</h2>
          <button
            onClick={handleClose}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
            aria-label="Close comparison"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">
              Common Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <MetadataRow label="Model" value={commonModel || "Unknown"} />
              <MetadataRow label="Size" value={commonSize} />
              <div className="md:col-span-2">
                <p className="text-zinc-400">
                  <span className="font-semibold text-zinc-300">Prompt:</span>{" "}
                  {commonPrompt || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-2xl mx-auto aspect-square select-none group">
              <img
                src={imageB.displayUrl || imageB.permanentUrl}
                alt={imageB.prompt || "Image B"}
                className="absolute inset-0 w-full h-full object-contain rounded-md shadow-lg"
                loading="lazy"
              />
              <img
                src={imageA.displayUrl || imageA.permanentUrl}
                alt={imageA.prompt || "Image A"}
                className="absolute inset-0 w-full h-full object-contain rounded-md shadow-lg"
                style={{
                  clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                }}
                loading="lazy"
              />

              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(e.target.value)}
                className="absolute inset-0 w-full h-full m-0 p-0 cursor-ew-resize opacity-0 z-10"
                aria-label="Image comparison slider"
              />

              <div
                className="absolute top-0 bottom-0 w-1 bg-purple-500/80 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{ left: `calc(${sliderPosition}% - 2px)` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -ml-5 h-10 w-10 rounded-full bg-purple-500 border-4 border-zinc-900 flex items-center justify-center text-white shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="17" y1="5" x2="7" y2="12"></line>
                    <line x1="17" y1="19" x2="7" y2="12"></line>
                  </svg>
                </div>
              </div>
            </div>

            <div className="mt-6 w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              <div className="bg-zinc-800/40 p-3 rounded-lg space-y-2 border-l-4 border-purple-500">
                <h4 className="font-bold text-white text-center mb-2">
                  Image A
                </h4>
                <MetadataRow label="Seed" value={imageA.seed || "N/A"} />
              </div>
              <div className="bg-zinc-800/40 p-3 rounded-lg space-y-2 border-l-4 border-zinc-500">
                <h4 className="font-bold text-white text-center mb-2">
                  Image B
                </h4>
                <MetadataRow label="Seed" value={imageB.seed || "N/A"} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCompareModal;
