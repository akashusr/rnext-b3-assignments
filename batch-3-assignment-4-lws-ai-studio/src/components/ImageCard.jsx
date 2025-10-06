import React, { useState, useEffect } from "react";
import { useFavourites } from "../context/FavouritesContext";
import { FiClock, FiAlertTriangle, FiFolderPlus } from "react-icons/fi";
import { BsCheckCircleFill } from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import AddToCollectionModal from "./AddToCollectionModal";
import ImageSkeleton from "./ImageSkeleton";

export default function ImageCard({
  image,
  onDownload,
  onClick,
  onEdit,
  onSelectCompare,
  isSelected,
  onGenerateMore,
  onRemoveFromCollection,
  collectionId,
}) {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const { state: favState, dispatch: favDispatch } = useFavourites();
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);

  const imageId = image.id || image.permanentUrl;
  const isFav = imageId ? !!favState.favourites[imageId] : false;

  useEffect(() => {
    let isMounted = true;
    let objectUrl = null;

    const rehydrateImage = async () => {
      // ✅ FIX: If the image is just a placeholder for a new generation,
      // let the status-based rendering handle it and do not run the rehydration logic.
      if (image.status === "queued" || image.status === "loading") {
        setIsLoading(false);
        setHasError(false);
        return;
      }

      if (image.displayUrl) {
        setImageUrl(image.displayUrl);
        setIsLoading(false);
        return;
      }

      if (image.permanentUrl) {
        try {
          const res = await fetch(image.permanentUrl);
          if (!res.ok) throw new Error("Image fetch failed");
          const blob = await res.blob();
          objectUrl = URL.createObjectURL(blob);
          if (isMounted) {
            setImageUrl(objectUrl);
          }
        } catch (error) {
          if (isMounted) {
            setHasError(true);
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      } else {
        if (isMounted) {
          setHasError(true);
          setIsLoading(false);
        }
      }
    };

    rehydrateImage();

    return () => {
      isMounted = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [image.displayUrl, image.permanentUrl, image.status]); // ✅ Add image.status to the dependency array

  const toggleFav = (e) => {
    e.stopPropagation();
    if (!imageId) return;
    favDispatch({
      type: "TOGGLE_FAVOURITE",
      payload: { ...image, id: imageId },
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return <ImageSkeleton />;
    }

    if (hasError) {
      return (
        <div className="flex flex-col items-center justify-center gap-2 text-red-400">
          <FiAlertTriangle className="w-8 h-8" />
          <p className="text-sm text-center">Unable to load image.</p>
        </div>
      );
    }

    // This logic now runs correctly for new generations
    if (image.status === "queued") {
      return (
        <div className="flex flex-col items-center justify-center gap-2 text-zinc-400">
          <FiClock className="w-8 h-8 animate-pulse" />
          <p className="text-sm text-center">
            Queued for generating...
            <br />
            Hang tight! Your art will start soon.
          </p>
        </div>
      );
    }
    if (image.status === "loading") {
      return (
        <div className="flex flex-col items-center justify-center gap-3 text-zinc-300">
          <div className="relative w-12 h-12">
            <svg
              className="animate-spin w-12 h-12 text-purple-500"
              viewBox="0 0 50 50"
              fill="none"
            >
              <circle
                className="opacity-30"
                cx="25"
                cy="25"
                r="20"
                stroke="currentColor"
                strokeWidth="5"
              />
              <path
                d="M25 5 a20 20 0 0 1 0 40 a20 20 0 0 1 0 -40"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                className="text-purple-600"
                fill="none"
              />
            </svg>
          </div>
          <p className="text-sm text-center text-zinc-400">
            Generating your masterpiece…
            <br />
            Please wait{" "}
            <span className="text-purple-400 font-medium">10–15 seconds</span>.
          </p>
          <div className="w-3/5 h-1 bg-purple-700/30 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-gradient-to-r from-purple-500 via-purple-400 to-purple-600 animate-pulse rounded-full"></div>
          </div>
        </div>
      );
    }

    if (imageUrl) {
      return (
        <>
          <img
            src={imageUrl}
            alt={image.prompt || "Generated AI"}
            className="absolute inset-0 w-full h-full object-cover group-hover:opacity-80 transition-opacity"
            onError={() => setHasError(true)}
            loading="lazy"
          />
          {isFav && (
            <div className="absolute top-2 left-10 bg-pink-600 text-xs text-white px-2 py-0.5 rounded-full z-10 select-none">
              ★ Favourite
            </div>
          )}
          <div className="absolute top-2 right-2 flex flex-col gap-1 z-20">
            <button
              className="p-2 bg-black/50 rounded-full hover:bg-black/80 transition"
              onClick={toggleFav}
              title={isFav ? "Unfavourite" : "Favourite"}
            >
              {isFav ? (
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3c3.08 0 5.5 2.42 5.5 5.5 0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3c3.08 0 5.5 2.42 5.5 5.5 0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              )}
            </button>
            <button
              className="p-2 bg-black/50 rounded-full hover:bg-black/80 transition"
              onClick={(e) => {
                e.stopPropagation();
                setIsCollectionModalOpen(true);
              }}
              title="Add to Collection"
            >
              <FiFolderPlus className="w-4 h-4 text-white" />
            </button>
            {onDownload && (
              <button
                className="p-2 bg-black/50 rounded-full hover:bg-black/80 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(image);
                }}
                title="Download"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </button>
            )}
            {onGenerateMore && (
              <button
                className="p-2 bg-black/50 rounded-full hover:bg-black/80 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  onGenerateMore(image);
                }}
                title="Generate more like this"
              >
                <HiSparkles className="w-4 h-4 text-purple-300" />
              </button>
            )}
            {onEdit && (
              <button
                className="p-2 bg-black/50 rounded-full hover:bg-black/80 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(image);
                }}
                title="Edit"
              >
                ✎
              </button>
            )}
            {onRemoveFromCollection && collectionId && (
              <button
                className="p-2 bg-red-600/80 rounded-full hover:bg-red-500 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFromCollection(collectionId, image.id);
                }}
                title="Remove from this Collection"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        </>
      );
    }
    return null;
  };

  const isClickable = !isLoading && !hasError && imageUrl;

  return (
    <>
      <div
        className={`relative group rounded-xl overflow-hidden bg-gradient-to-br from-[#0f0f0f] to-[#1a0b2e] w-full h-48 flex items-center justify-center text-center p-4 ${
          isClickable ? "cursor-pointer" : "cursor-default"
        }`}
        onClick={() => {
          if (isClickable && onClick) {
            onClick();
          }
        }}
      >
        {onSelectCompare && image.status === "ready" && (
          <button
            type="button"
            data-image-id={image.id}
            onClick={(e) => {
              e.stopPropagation();
              onSelectCompare(image, !isSelected);
            }}
            title="Select for comparison"
            className={`absolute top-2 left-2 z-30 p-1 rounded-full transition ${
              isSelected
                ? "bg-purple-600 text-white"
                : "bg-black/50 text-gray-300 hover:bg-purple-600 hover:text-white"
            }`}
          >
            <BsCheckCircleFill className="w-6 h-6" />
          </button>
        )}
        {renderContent()}
      </div>
      {isCollectionModalOpen && (
        <AddToCollectionModal
          image={image}
          onClose={() => setIsCollectionModalOpen(false)}
        />
      )}
    </>
  );
}
