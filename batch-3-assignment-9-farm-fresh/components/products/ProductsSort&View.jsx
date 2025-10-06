"use client";
import { faList, faTh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ProductsSortAndView = ({ page, productsLength }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current view mode from URL params, default to "grid"
  const currentView = searchParams.get("view") || "grid";
  const [viewMode, setViewMode] = useState(currentView);

  const searchQuery = searchParams.get("q");

  // Get current sort value from URL params, default to "featured"
  const currentSort = searchParams.get("sort") || "featured";

  // Update local state when URL changes
  useEffect(() => {
    setViewMode(currentView);
  }, [currentView]);

  const handleSortChange = (e) => {
    const sortValue = e.target.value;
    const params = new URLSearchParams(searchParams);

    // If "featured" is selected, remove the sort parameter
    if (sortValue === "featured") {
      params.delete("sort");
    } else {
      params.set("sort", sortValue);
    }

    // Reset to page 1 when sorting changes
    // params.delete("page");

    const queryString = params.toString();
    const url = queryString ? `/products?${queryString}` : "/products";

    router.push(url);
  };

  const handleViewToggle = (mode) => {
    const params = new URLSearchParams(searchParams);

    // If "grid" is selected, remove the view parameter (default)
    if (mode === "grid") {
      params.delete("view");
    } else {
      params.set("view", mode);
    }

    const queryString = params.toString();
    const url = queryString ? `/products?${queryString}` : "/products";

    router.push(url);
  };

  const handleRefresh = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("q");

    const queryString = params.toString();
    const url = queryString ? `/products?${queryString}` : "/products";

    router.push(url);
  };

  return (
    <div className="flex justify-between items-center mb-6">
      {productsLength > 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          Showing {page * 6 - 5}-
          {page * 6 > productsLength ? productsLength : page * 6} of{" "}
          {productsLength} products
        </p>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">
          No product to show...
        </p>
      )}
      <div className="flex items-center space-x-4">
        {searchQuery && <button className="bg-gray-700 px-4 py-2 rounded-md" onClick={handleRefresh}>Refresh Search</button>}
        <select
          value={currentSort}
          onChange={handleSortChange}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        >
          <option value="featured">Sort by: Featured</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
          <option value="newest">Newest First</option>
          <option value="rating">Rating</option>
        </select>
        <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg">
          <button
            onClick={() => handleViewToggle("grid")}
            className={`p-2 rounded-l-lg ${
              viewMode === "grid"
                ? "bg-primary-600 text-white"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <FontAwesomeIcon icon={faTh} />
          </button>
          <button
            onClick={() => handleViewToggle("list")}
            className={`p-2 rounded-r-lg ${
              viewMode === "list"
                ? "bg-primary-600 text-white"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <FontAwesomeIcon icon={faList} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsSortAndView;
