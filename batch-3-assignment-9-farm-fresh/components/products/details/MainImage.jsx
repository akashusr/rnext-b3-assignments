import React from "react";
import Image from "next/image";

const MainImage = ({ img, name }) => {
  return (
    <div className="aspect-square bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
      <Image
        id="mainImage"
        src={img}
        alt={name || "product image"}
        className="w-full h-full object-cover"
        width={600}
        height={600}
      />
    </div>
  );
};

export default MainImage;
