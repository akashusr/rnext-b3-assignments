import React from "react";

//need farmer information
const ProductHeader = ({ organic, name, producerName }) => {
  return (
    <div>
      <div className="flex items-center space-x-2 mb-2">
        <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-medium">
          {organic ? "Organic" : "Conventional"}
        </span>
        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs font-medium">
          Fresh
        </span>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {name || "Unknown Product"}
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Produced by
        <span className="font-semibold text-primary-600 dark:text-primary-400 ml-1">
          {producerName || "Not available"}
        </span>
      </p>
    </div>
  );
};

export default ProductHeader;
