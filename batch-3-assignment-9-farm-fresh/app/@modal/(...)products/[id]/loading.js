import React from "react";
import Skeleton from "@/components/common/Skeleton";

// Full-screen overlay loading for intercepted product details modal
// Ensures loading UI overlays the existing page rather than flowing within it.
export default function ProductModalLoading() {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm" aria-busy="true">
      <div className="w-full max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl ring-1 ring-black/10 dark:ring-white/10">
        <div className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton height={320} />
              <div className="flex gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} width={64} height={64} />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton variant="title" className="h-7 w-2/3" />
              <Skeleton variant="text" lines={3} />
              <Skeleton variant="badge" className="w-24" />
              <Skeleton variant="button" />
              <Skeleton variant="text" lines={2} />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton variant="title" className="h-6 w-1/4" />
            <Skeleton variant="text" lines={4} />
          </div>
        </div>
      </div>
    </div>
  );
}
