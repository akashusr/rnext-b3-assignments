import React from "react";
import Skeleton from "@/components/common/Skeleton";

export default function EditProductLoading() {
  return (
    <div
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      aria-busy="true"
    >
      <Skeleton variant="title" className="h-8 w-1/3 mb-8" />
      <div className="space-y-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton height={56} />
            <Skeleton height={56} />
          </div>
        ))}
        <Skeleton height={160} />
        <div className="flex gap-4">
          <Skeleton variant="button" className="flex-1" />
          <Skeleton variant="button" className="flex-1" />
        </div>
      </div>
    </div>
  );
}
