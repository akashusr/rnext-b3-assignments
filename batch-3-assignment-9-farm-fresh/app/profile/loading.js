import React from "react";
import Skeleton from "@/components/common/Skeleton";

// Profile page loading skeleton
export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8" aria-busy="true">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Skeleton variant="avatar" size={80} />
              <div className="space-y-3">
                <Skeleton width={180} height={28} />
                <Skeleton width={120} height={20} />
              </div>
            </div>
            <Skeleton variant="button" className="w-40" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <Skeleton variant="title" className="h-6 w-1/3 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton width={140} height={18} />
                <Skeleton height={40} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
