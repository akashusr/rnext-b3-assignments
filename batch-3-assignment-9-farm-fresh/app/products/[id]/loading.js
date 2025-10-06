import React from "react";
import Skeleton from "@/components/common/Skeleton";

export default function ProductDetailsLoading() {
  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      aria-busy="true"
    >
      <Skeleton variant="title" className="h-8 w-1/2 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <Skeleton height={400} />
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} width={80} height={80} />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton variant="title" className="h-7 w-2/3" />
          <Skeleton variant="text" lines={3} />
          <Skeleton variant="badge" className="w-28" />
          <Skeleton variant="button" />
        </div>
      </div>
      <div className="mt-12 space-y-8">
        <Skeleton variant="title" className="h-6 w-1/4" />
        <Skeleton variant="text" lines={6} />
      </div>
    </div>
  );
}
