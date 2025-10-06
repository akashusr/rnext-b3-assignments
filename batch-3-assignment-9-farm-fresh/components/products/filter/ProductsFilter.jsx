import React from "react";
import CategoryFilter from "./CategoryFilter";
import PriceFilter from "./PriceFilter";
import LocationFilter from "./LocationFilter";
import OrganicFilter from "./OrganicFilter";

const ProductsFilter = ({
  category,
  price,
  page,
  q,
  location,
  organic,
  categoryCounts,
}) => {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-24">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Filters
        </h3>

        {/* <!-- Category Filter --> */}
        <CategoryFilter
          category={category}
          page={page}
          q={q}
          price={price}
          location={location}
          organic={organic}
          counts={categoryCounts}
        />

        {/* <!-- Price Range --> */}
        <PriceFilter
          price={price}
          page={page}
          q={q}
          category={category}
          location={location}
          organic={organic}
        />

        {/* <!-- Location --> */}
        <LocationFilter
          page={page}
          q={q}
          category={category}
          price={price}
          location={location}
          organic={organic}
        />

        {/* <!-- Organic Filter --> */}
        <OrganicFilter
          organic={organic}
          page={page}
          q={q}
          category={category}
          price={price}
          location={location}
        />

        <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition">
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default ProductsFilter;
