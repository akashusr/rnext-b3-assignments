import React from "react";
import Skeleton from "@/components/common/Skeleton";
export default function ImagesLoading() {
  return (
    <div className="space-y-4">
      <Skeleton height={400} />
      <div className="flex gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} width={80} height={80} />
        ))}
      </div>
    </div>
  );
}
