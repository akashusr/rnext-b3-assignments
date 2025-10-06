import React from "react";
import Skeleton from "@/components/common/Skeleton";

// Route-level loading skeleton for manage products list
export default function ManageProductsListLoading() {
  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      aria-busy="true"
    >
      <Skeleton variant="title" className="h-8 w-1/2 mb-6" />
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton height={48} />
        <Skeleton height={48} />
        <Skeleton height={48} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton height={192} />
            <Skeleton variant="text" lines={2} />
            <div className="flex justify-between items-center">
              <Skeleton width="40%" height={24} />
              <Skeleton width={80} height={24} />
            </div>
            <div className="flex gap-2">
              <Skeleton variant="button" className="flex-1" />
              <Skeleton variant="button" className="flex-1" />
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
