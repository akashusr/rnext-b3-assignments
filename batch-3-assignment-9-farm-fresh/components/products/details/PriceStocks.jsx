import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

//need farmer information
const PriceStocks = ({ price, stock, location }) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
            ৳{price}
          </span>
          <span className="text-lg text-gray-500 dark:text-gray-400">/kg</span>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {stock ? "Available Stock" : "Out of Stock"}
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {stock || 0} kg
          </p>
        </div>
      </div>

      {/* <!-- Location --> */}
      <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
        <span>{location || "Unknown location"}</span>
      </div>
    </div>
  );
};

export default PriceStocks;
