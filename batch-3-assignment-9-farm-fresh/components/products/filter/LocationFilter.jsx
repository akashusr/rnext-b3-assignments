"use client";
import React from "react";

const locationOptions = [
  { name: "All Locations", value: "" },
  { name: "Dhaka", value: "dhaka" },
  { name: "Chittagong", value: "chittagong" },
  { name: "Sylhet", value: "sylhet" },
  { name: "Rangpur", value: "rangpur" },
  { name: "Sust", value: "sust" },
];

const LocationFilter = ({ page, q, category, price, location, organic }) => {
  const buildLocationUrl = (selectedLocation) => {
    // Build URL params properly
    const params = new URLSearchParams();

    // Reset to page 1 when filter changes
    params.set("page", "1");

    // Add category if exists
    if (category) {
      params.set("category", category);
    }

    // Add price if exists
    if (price) {
      params.set("price", price);
    }

    // Add search query if exists
    if (q) {
      params.set("q", q);
    }

    // Add organic if exists
    if (organic) {
      params.set("organic", organic);
    }

    // Add location if selected (remove if "All Locations")
    if (selectedLocation) {
      params.set("location", selectedLocation);
    }

    return `/products?${params.toString()}`;
  };

  return (
    <div className="mb-6">
      <h4 className="font-medium text-gray-900 dark:text-white mb-3">
        Location
      </h4>
      <select
        value={location || ""}
        onChange={(e) => {
          const newUrl = buildLocationUrl(e.target.value);
          window.location.href = newUrl;
        }}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
      >
        {locationOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationFilter;
