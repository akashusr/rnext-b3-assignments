import React from "react";
import Skeleton from "@/components/common/Skeleton";

// Farmers page loading skeleton
export default function FarmersLoading() {
  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      aria-busy="true"
    >
      {/* Stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="text-center space-y-2">
            <Skeleton height={40} className="mx-auto w-16" />
            <Skeleton height={16} className="mx-auto w-24" />
          </div>
        ))}
      </div>
      {/* Farmer cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 space-y-4 border border-gray-200 dark:border-gray-700"
          >
            <Skeleton height={192} className="w-full" />
            <div className="space-y-3">
              <Skeleton variant="text" lines={1} className="h-6" />
              <Skeleton variant="text" lines={2} />
              <div className="flex justify-between gap-4">
                <Skeleton height={20} className="w-24" />
                <Skeleton height={20} className="w-24" />
              </div>
              <div className="flex gap-2">
                <Skeleton height={28} className="flex-1" />
                <Skeleton height={28} className="w-10" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
