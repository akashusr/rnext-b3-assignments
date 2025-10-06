import React from "react";
import Skeleton from "@/components/common/Skeleton";

export default function ProductsLoading() {
  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      aria-busy="true"
    >
      <Skeleton variant="title" className="h-8 w-1/3 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div>
          <Skeleton variant="title" className="h-5 w-1/2 mb-4" />
          <Skeleton variant="text" lines={6} />
        </div>
        <div
          className="lg:col-span-3 grid gap-6"
          style={{ gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))" }}
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="border border-gray-200 dark:border-gray-700 rounded-md p-3 space-y-3"
            >
              <Skeleton height={140} />
              <Skeleton variant="text" lines={2} />
              <Skeleton variant="badge" className="w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
