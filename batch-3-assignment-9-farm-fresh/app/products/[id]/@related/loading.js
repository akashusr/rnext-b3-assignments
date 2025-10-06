import React from "react";
import Skeleton from "@/components/common/Skeleton";
export default function RelatedLoading() {
  return (
    <div className="space-y-4">
      <Skeleton variant="title" className="h-6 w-48" />
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))" }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="border border-gray-200 dark:border-gray-700 rounded-md p-3 space-y-3"
          >
            <Skeleton height={100} />
            <Skeleton variant="text" lines={2} />
          </div>
        ))}
      </div>
    </div>
  );
}
