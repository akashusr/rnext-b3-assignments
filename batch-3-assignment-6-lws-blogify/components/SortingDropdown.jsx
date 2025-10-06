"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
const SortingDropdown = () => {
  const [sort, setSort] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortValue = e => {
    const value = e.target.value;
    setSort(value);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("sort", value);
    } else {
      params.delete("category");
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="mb-6 flex justify-between items-center">
      <h2 className="text-2xl font-bold">Articles</h2>
      <div>
        <label
          htmlFor="sort"
          className="text-sm font-medium text-gray-700 mr-2"
        >
          Sort by:
        </label>
        <select
          id="sort"
          value={sort}
          onChange={handleSortValue}
          name="sort"
          className="border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="popular">Most Popular</option>
          <option value="read-time">Shortest Read Time</option>
        </select>
      </div>
    </div>
  );
};

export default SortingDropdown;
