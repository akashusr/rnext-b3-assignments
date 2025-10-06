"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Search = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const page = searchParams.get("page");

  const handleSearch = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const searchTerm = formData.get("search")?.toString().trim();
    e.target.reset();

    if (!searchTerm) return; // ignore empty search

    if (pathname === "/") {
      router.push(`/products?q=${encodeURIComponent(searchTerm)}&page=1`);
    } else {
      router.push(
        `${pathname}?${
          category ? `category=${category}&` : ""
        }q=${encodeURIComponent(searchTerm)}&page=${page}`
      );
    }
  };

  return (
    <form className="hidden sm:block relative" onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Search products..."
        name="search"
        className="w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
      />
      <button type="submit">
        <FontAwesomeIcon
          icon={faSearch}
          className="absolute left-3 top-3 text-gray-400"
        />
      </button>
    </form>
  );
};

export default Search;
