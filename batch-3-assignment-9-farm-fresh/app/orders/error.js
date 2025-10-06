"use client";

import React, { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Optional: log to monitoring
    // console.error("Orders route error:", error);
  }, [error]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-3">Something went wrong</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        We couldn&apos;t load this page. Please try again.
      </p>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          className="bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded"
        >
          Try again
        </button>
        <button
          onClick={() => window.location.reload()}
          className="border border-gray-300 dark:border-gray-600 px-5 py-2.5 rounded"
        >
          Reload
        </button>
      </div>
    </div>
  );
}
