import React from "react";
import Image from "next/image";

const ThumbnailImages = ({ images, name }) => {
  return (
    <div className="grid grid-cols-5 gap-2">
      {images.length === 0 ? (
        <p>No images available</p>
      ) : (
        images.map((img, index) => (
          <button
            key={img._id || index}
            className="aspect-square bg-white dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-transparent hover:border-primary-500"
          >
            <Image
              src={img}
              alt={name}
              className="w-full h-full object-cover"
              width={200}
              height={200}
            />
          </button>
        ))
      )}
    </div>
  );
};

export default ThumbnailImages;
