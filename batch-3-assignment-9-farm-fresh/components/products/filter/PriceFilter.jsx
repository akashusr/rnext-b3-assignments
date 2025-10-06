import React from "react";
import Link from "next/link";

const priceRanges = [
  { label: "Under ৳30", value: "under-30" },
  { label: "৳30 - ৳50", value: "30-50" },
  { label: "৳50 - ৳100", value: "50-100" },
  { label: "Over ৳100", value: "over-100" },
];

export default function PriceFilter({
  price,
  page,
  q,
  category,
  location,
  organic,
}) {
  const selectedPrice = price ? decodeURIComponent(price) : null;

  const togglePrice = (priceValue) => {
    const updatedPrice = selectedPrice === priceValue ? null : priceValue;

    // Build URL params properly
    const params = new URLSearchParams();

    // Reset to page 1 when filter changes
    params.set("page", "1");

    // Add category if exists
    if (category) {
      params.set("category", category);
    }

    // Add search query if exists
    if (q) {
      params.set("q", q);
    }

    // Add location if exists
    if (location) {
      params.set("location", location);
    }

    // Add organic if exists
    if (organic) {
      params.set("organic", organic);
    }

    // Add price if selected (remove if deselecting)
    if (updatedPrice) {
      params.set("price", encodeURIComponent(updatedPrice));
    }

    return `/products?${params.toString()}`;
  };

  return (
    <div className="mb-6">
      <h4 className="font-medium text-gray-900 dark:text-white mb-3">
        Price Range
      </h4>
      <div className="space-y-2">
        {priceRanges.map((range) => {
          const hrefValue = togglePrice(range.value); // Call here so log happens
          const isChecked = selectedPrice === range.value;
          return (
            <label key={range.value} className="flex items-center">
              <Link
                href={hrefValue}
                className="flex items-center"
                // onClick={() => console.log("Clicked price", range.value)} // Logs on click
              >
                <input
                  type="radio"
                  name="price"
                  checked={isChecked}
                  readOnly
                  className="border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {range.label}
                </span>
              </Link>
            </label>
          );
        })}
      </div>
    </div>
  );
}
