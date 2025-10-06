import React from "react";
import Skeleton from "@/components/common/Skeleton";
export default function ReviewsLoading() {
  return (
    <div className="space-y-4">
      <Skeleton variant="title" className="h-6 w-40" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="border border-gray-200 dark:border-gray-700 rounded-md p-4 space-y-3"
        >
          <Skeleton variant="text" lines={2} />
          <Skeleton variant="text" lines={1} />
        </div>
      ))}
    </div>
  );
}
