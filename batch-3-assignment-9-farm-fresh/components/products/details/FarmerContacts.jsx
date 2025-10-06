import React from "react";
import Image from "next/image";

const FarmerContacts = ({ name, image, since, farmName }) => {
  const displayName = name || "Unknown";
  const displaySince = since ? `Farmer since ${since}` : "Member";
  const displayImage = image || "/chinese.png";
  return (
    <div className="bg-primary-50 dark:bg-primary-900 rounded-xl p-4">
      <div className="flex items-center space-x-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <Image
          src={displayImage}
          alt={displayName}
          className="w-12 h-12 rounded-full object-cover"
          width={50}
          height={50}
        />
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {displayName}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {farmName ? farmName : "Farm name not available"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
            {displaySince}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FarmerContacts;
