import React from "react";
import Link from "next/link";

const OrganicFilter = ({ organic, page, q, category, price, location }) => {
  const isChecked = organic === "true";

  const toggleOrganic = () => {
    const updatedOrganic = isChecked ? null : "true";

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

    // Add location if exists
    if (location) {
      params.set("location", location);
    }

    // Add organic if selected (remove if deselecting)
    if (updatedOrganic) {
      params.set("organic", updatedOrganic);
    }

    return `/products?${params.toString()}`;
  };

  return (
    <div className="mb-6">
      <label className="flex items-center">
        <Link href={toggleOrganic()} className="flex items-center">
          <input
            type="checkbox"
            checked={isChecked}
            readOnly
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Organic Only
          </span>
        </Link>
      </label>
    </div>
  );
};

export default OrganicFilter;
