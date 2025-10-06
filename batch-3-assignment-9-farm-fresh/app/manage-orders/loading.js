import React from "react";
import Skeleton from "@/components/common/Skeleton";

// Route-level loading skeleton for manage orders
export default function ManageOrdersLoading() {
  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      aria-busy="true"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 w-full">
        <div className="w-full sm:w-auto">
          <Skeleton variant="title" className="h-8 w-2/3 mb-2" />
          <Skeleton variant="text" lines={2} className="max-w-md" />
        </div>
        <div className="mt-6 sm:mt-0 flex gap-3 w-full sm:w-auto">
          <Skeleton height={48} className="w-40" />
          <Skeleton height={48} className="w-40 hidden md:block" />
        </div>
      </div>

      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden p-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 gap-4">
              <div className="space-y-2 w-full lg:w-auto">
                <Skeleton width="220px" height={20} />
                <Skeleton width="160px" height={16} />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton width={100} height={28} className="rounded-full" />
                <Skeleton width={80} height={28} />
              </div>
            </div>
            <div className="flex items-center gap-4 border-t border-gray-200 dark:border-gray-600 pt-4">
              <Skeleton width={64} height={64} className="rounded-lg" />
              <div className="flex-1 space-y-3">
                <Skeleton width="40%" height={18} />
                <Skeleton variant="text" lines={2} className="max-w-sm" />
              </div>
              <div className="hidden sm:block">
                <Skeleton width={72} height={24} />
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-600 mt-4 pt-4 flex flex-wrap gap-3">
              <Skeleton variant="button" className="flex-1 sm:flex-none" />
              <Skeleton variant="button" className="flex-1 sm:flex-none" />
              <Skeleton
                variant="button"
                className="flex-1 sm:flex-none hidden md:block"
              />
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
