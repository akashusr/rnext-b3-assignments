import React from "react";
import Skeleton from "@/components/common/Skeleton";
export default function PriceLoading() {
  return (
    <div className="space-y-3">
      <Skeleton variant="badge" className="w-32" />
      <Skeleton variant="text" lines={2} />
    </div>
  );
}
