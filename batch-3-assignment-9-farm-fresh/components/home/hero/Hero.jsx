"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const Hero = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [stats, setStats] = useState({
    farmers: null,
    products: null,
    customers: null,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState(null);

  const handleSearch = useCallback(() => {
    // Always navigate with explicit params as requested: products?category=[category]&q=[search input]&page=1
    const url = `/products?category=${encodeURIComponent(
      category
    )}&q=${encodeURIComponent(query)}&page=1`;
    router.push(url);
  }, [router, category, query]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadStats = async () => {
      try {
        setLoadingStats(true);
        const res = await fetch("/api/stats", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        if (isMounted) {
          setStats(data);
          setStatsError(null);
        }
      } catch (e) {
        if (isMounted) setStatsError(e.message || "Error");
      } finally {
        if (isMounted) setLoadingStats(false);
      }
    };
    loadStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const formatNumber = (n) => {
    if (n === null || n === undefined) return "-";
    if (n >= 1000)
      return Intl.NumberFormat("en", { notation: "compact" }).format(n);
    return String(n);
  };

  return (
    <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Fresh from Farm to Your Table
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
            Connect directly with local farmers and get the freshest produce
            delivered to your doorstep
          </p>

          {/* <!-- Search Bar --> */}
          <div className="max-w-2xl mx-auto mb-8">
            <form
              className="flex rounded-lg overflow-hidden shadow-lg bg-white"
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
            >
              <input
                type="text"
                placeholder="Search for vegetables, fruits, farmers..."
                className="flex-1 px-6 py-4 text-gray-900 text-lg focus:outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="Search products"
              />
              <select
                className="px-4 py-4 text-gray-900 border-l border-gray-300 focus:outline-none bg-white"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-label="Select category"
              >
                <option value="all">All Categories</option>
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="grains">Grains</option>
                <option value="dairy">Dairy</option>
              </select>
              <button
                type="submit"
                className="bg-primary-700 hover:bg-primary-800 px-8 py-4 transition flex items-center justify-center"
                aria-label="Search"
              >
                <FontAwesomeIcon icon={faSearch} className="text-xl" />
              </button>
            </form>
          </div>

          {/* <!-- Stats --> */}
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold" aria-live="polite">
                {loadingStats ? "..." : formatNumber(stats.farmers)}
              </div>
              <div className="text-green-200">Local Farmers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" aria-live="polite">
                {loadingStats ? "..." : formatNumber(stats.products)}
              </div>
              <div className="text-green-200">Fresh Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" aria-live="polite">
                {loadingStats ? "..." : formatNumber(stats.customers) + "+"}
              </div>
              <div className="text-green-200">Happy Customers</div>
            </div>
          </div>
          {statsError && (
            <p className="text-sm mt-4 text-red-200" role="alert">
              Could not load live stats.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
