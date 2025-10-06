import React from "react";
import Skeleton from "@/components/common/Skeleton";

export default function ReviewLoading() {
  return (
    <div
      className="flex items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-800"
      aria-busy="true"
    >
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-md w-full p-6 space-y-6">
        <Skeleton variant="title" className="h-7 w-1/2" />
        <div className="space-y-4">
          <div>
            <Skeleton height={20} className="w-40 mb-3" />
            <div className="flex gap-2 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton
                  key={i}
                  height={40}
                  width={40}
                  className="rounded-full"
                />
              ))}
            </div>
            <Skeleton height={14} className="w-48" />
          </div>
          <div>
            <Skeleton height={20} className="w-32 mb-3" />
            <Skeleton height={100} />
          </div>
          <Skeleton variant="button" className="w-full h-10" />
        </div>
      </div>
    </div>
  );
}
