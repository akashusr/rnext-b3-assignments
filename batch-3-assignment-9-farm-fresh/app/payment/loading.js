import React from "react";
import Skeleton from "@/components/common/Skeleton";

// Payment route loading skeleton while payment intent & data prepare
export default function PaymentLoading() {
  return (
    <div
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      aria-busy="true"
    >
      <Skeleton variant="title" className="h-8 w-1/3 mb-8" />
      <div className="space-y-6">
        <div className="space-y-3">
          <Skeleton variant="text" lines={2} />
          <Skeleton width="50%" height={20} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Skeleton variant="title" className="h-5 w-1/2" />
            <Skeleton height={48} />
            <Skeleton height={48} />
            <Skeleton height={48} />
          </div>
          <div className="space-y-4">
            <Skeleton variant="title" className="h-5 w-1/2" />
            <Skeleton height={160} />
            <Skeleton variant="text" lines={3} />
            <Skeleton variant="badge" className="w-24" />
          </div>
        </div>
        <div className="flex gap-4">
          <Skeleton variant="button" className="flex-1 h-12" />
          <Skeleton variant="button" className="flex-1 h-12" />
        </div>
      </div>
    </div>
  );
}
