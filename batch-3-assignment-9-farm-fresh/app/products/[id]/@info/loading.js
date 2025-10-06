import React from "react";
import Skeleton from "@/components/common/Skeleton";
export default function InfoLoading() {
  return (
    <div className="space-y-4">
      <Skeleton variant="title" className="h-7 w-3/4" />
      <Skeleton variant="text" lines={4} />
    </div>
  );
}
