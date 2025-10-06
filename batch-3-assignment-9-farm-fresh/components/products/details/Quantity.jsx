"use client";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Quantity = ({ stock, quantity, increaseQuantity, decreaseQuantity }) => {
  const handleChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= stock) {
      // Use the current value to determine whether to increase or decrease
      if (value > quantity) {
        increaseQuantity();
      } else if (value < quantity) {
        decreaseQuantity();
      }
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Quantity (kg)
        </label>
        <div className="flex items-center space-x-3">
          <button
            onClick={decreaseQuantity}
            className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FontAwesomeIcon icon={faMinus} className="text-sm" />
          </button>
          <input
            type="number"
            min="1"
            max={stock}
            value={quantity}
            onChange={handleChange}
            className="w-20 text-center py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={increaseQuantity}
            className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FontAwesomeIcon icon={faPlus} className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quantity;
