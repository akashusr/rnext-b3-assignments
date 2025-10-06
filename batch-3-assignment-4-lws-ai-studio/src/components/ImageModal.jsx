import React from "react";

const ImageModal = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onPrev,
  onNext,
  onSelect,
}) => {
  if (
    !isOpen ||
    !images ||
    images.length === 0 ||
    currentIndex === undefined ||
    currentIndex < 0 ||
    currentIndex >= images.length
  ) {
    return null;
  }

  const image = images[currentIndex];

  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const aspectRatio = (() => {
    if (image.width && image.height) {
      const divisor = gcd(image.width, image.height);
      const w = image.width / divisor;
      const h = image.height / divisor;
      return `${w}:${h}`;
    }
    return "N/A";
  })();

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const shouldHideThumbnails = () => {
    if (!image?.seed) return false;
    return images.some(
      (img, idx) => idx !== currentIndex && img.seed === image.seed,
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-zinc-900 text-white w-full max-w-2xl p-4 rounded-lg shadow-xl relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-zinc-400 hover:text-white z-20"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Image Display */}
        <div className="relative flex items-center justify-center mb-3 min-h-[250px]">
          <img
            src={image.displayUrl || image.permanentUrl || image.imageUrl}
            alt={image.prompt || "Generated Image"}
            className="w-auto h-auto max-w-full max-h-[60vh] object-contain rounded-lg transition duration-300"
          />

          {/* Arrows */}
          {images.length > 1 && !shouldHideThumbnails() && (
            <>
              <button
                onClick={onPrev}
                disabled={currentIndex === 0}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition disabled:opacity-30 disabled:cursor-not-allowed z-10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                onClick={onNext}
                disabled={currentIndex === images.length - 1}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition disabled:opacity-30 disabled:cursor-not-allowed z-10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && !shouldHideThumbnails() && (
          <div className="flex overflow-x-auto gap-2 mb-3 px-1">
            {images.map((img, idx) => (
              <img
                key={img.permanentUrl || idx}
                src={img.displayUrl || img.permanentUrl || img.imageUrl}
                alt={`Thumbnail ${idx + 1}`}
                onClick={() => idx !== currentIndex && onSelect(idx)}
                className={`w-12 h-12 object-cover rounded cursor-pointer border-2 ${
                  idx === currentIndex
                    ? "border-purple-500"
                    : "border-transparent hover:border-zinc-500"
                }`}
              />
            ))}
          </div>
        )}

        {/* Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-xs">
          <div>
            <span className="text-zinc-400 font-medium">Prompt:</span>
            <p className="text-zinc-200 break-words">{image.prompt || "N/A"}</p>
          </div>
          <div>
            <span className="text-zinc-400 font-medium">Model:</span>
            <p className="text-zinc-200">{image.model || "N/A"}</p>
          </div>
          <div>
            <span className="text-zinc-400 font-medium">Seed:</span>
            <p className="text-zinc-200">{image.seed || "N/A"}</p>
          </div>
          <div>
            <span className="text-zinc-400 font-medium">Aspect Ratio:</span>
            <p className="text-zinc-200">{aspectRatio}</p>
          </div>
          <div>
            <span className="text-zinc-400 font-medium">Width:</span>
            <p className="text-zinc-200">{image.width || "N/A"}</p>
          </div>
          <div>
            <span className="text-zinc-400 font-medium">Height:</span>
            <p className="text-zinc-200">{image.height || "N/A"}</p>
          </div>
        </div>

        {/* Footer Info */}
        {images.length > 1 && (
          <div className="text-center mt-3 text-zinc-400 text-xs">
            {shouldHideThumbnails()
              ? "Navigation disabled: duplicate seed detected"
              : `Image ${currentIndex + 1} of ${images.length}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageModal;
