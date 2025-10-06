import React from "react";
import Skeleton from "@/components/common/Skeleton";

// Orders list loading skeleton
export default function OrdersLoading() {
  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      aria-busy="true"
    >
      <Skeleton variant="title" className="h-8 w-1/3 mb-8" />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-6">
        <div className="space-y-3 w-full sm:w-auto">
          <Skeleton variant="text" lines={2} className="max-w-sm" />
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Skeleton variant="button" className="w-32" />
          <Skeleton variant="button" className="w-32" />
        </div>
      </div>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="border border-gray-200 dark:border-gray-700 rounded-md p-4 flex flex-col sm:flex-row gap-4"
          >
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" lines={3} />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton variant="badge" className="w-20" />
              <Skeleton variant="button" className="w-24" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 flex justify-center gap-3">
        <Skeleton width={40} height={40} className="rounded-full" />
        <Skeleton width={40} height={40} className="rounded-full" />
        <Skeleton width={40} height={40} className="rounded-full" />
      </div>
    </div>
  );
}
