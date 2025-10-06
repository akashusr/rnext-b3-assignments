import React from "react";
import Link from "next/link";

const categoriesList = [
  { name: "Vegetables", value: "vegetables" },
  { name: "Fruits", value: "fruits" },
  { name: "Grains", value: "grains" },
  { name: "Dairy", value: "dairy" },
  { name: "Honey", value: "honey" },
  { name: "Herbs", value: "herbs" },
];

export default function CategoryFilter({
  category,
  page,
  q,
  price,
  location,
  organic,
  counts = {},
}) {
  // Decode and split from URL param

  const selectedCategories = category
    ? category.split("|").map(decodeURIComponent)
    : [];

  const toggleCategory = (catValue) => {
    const updated = selectedCategories.includes(catValue)
      ? selectedCategories.filter((c) => c !== catValue) // remove
      : [...selectedCategories, catValue]; // add

    // Build URL params properly
    const params = new URLSearchParams();

    // Reset to page 1 when filter changes
    params.set("page", "1");

    // Add categories if any selected
    if (updated.length > 0) {
      const encoded = updated.map(encodeURIComponent).join("|");
      params.set("category", encoded);
    }

    // Add search query if exists
    if (q) {
      params.set("q", q);
    }

    // Add price if exists
    if (price) {
      params.set("price", price);
    }

    // Add location if exists
    if (location) {
      params.set("location", location);
    }

    // Add organic if exists
    if (organic) {
      params.set("organic", organic);
    }

    return `/products?${params.toString()}`;
  };

  return (
    <div className="mb-6">
      <h4 className="font-medium text-gray-900 dark:text-white mb-3">
        Category
      </h4>
      <div className="space-y-2">
        {categoriesList.map((cat) => {
          const isChecked = selectedCategories.includes(cat.value);
          return (
            <label key={cat.value} className="flex items-center">
              <Link
                href={toggleCategory(cat.value)}
                className="flex items-center"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  readOnly
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {cat.name} ({counts[cat.name] ?? 0})
                </span>
              </Link>
            </label>
          );
        })}
      </div>
    </div>
  );
}
