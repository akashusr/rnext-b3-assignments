import React from "react";
import Skeleton from "@/components/common/Skeleton";

// Loading skeleton for Add Product form
export default function AddProductLoading() {
  return (
    <div
      className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      aria-busy="true"
    >
      <Skeleton variant="title" className="h-8 w-1/2 mb-8" />
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Skeleton height={48} />
            <Skeleton height={48} />
            <Skeleton height={48} />
            <Skeleton height={48} />
          </div>
          <div className="space-y-4">
            <Skeleton height={48} />
            <Skeleton height={48} />
            <Skeleton height={48} />
            <Skeleton height={48} />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton variant="title" className="h-5 w-1/3" />
          <Skeleton height={160} />
        </div>
        <div className="flex gap-4">
          <Skeleton variant="button" className="flex-1 h-12" />
          <Skeleton variant="button" className="flex-1 h-12" />
        </div>
      </div>
    </div>
  );
}
