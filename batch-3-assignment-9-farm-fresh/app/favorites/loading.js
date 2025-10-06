import React from "react";
import Skeleton from "@/components/common/Skeleton";

// Favorites page loading skeleton
export default function FavoritesLoading() {
  return (
    <div
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      aria-busy="true"
    >
      <Skeleton variant="title" className="h-8 w-1/3 mb-8" />
      <ul className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <li
            key={i}
            className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <Skeleton width={80} height={80} />
            <div className="flex-1 space-y-3">
              <Skeleton variant="text" lines={2} />
              <Skeleton width="50%" height={16} />
            </div>
            <div className="flex flex-col gap-2 w-28">
              <Skeleton variant="button" />
              <Skeleton variant="button" />
              <Skeleton variant="button" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
