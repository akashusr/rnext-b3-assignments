import React from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";

// Minimal route-level loading fallback for reset-password (suspense: server action)
export default function Loading() {
  return (
    <div className="flex items-center justify-center py-16" aria-busy="true">
      <LoadingSpinner size="lg" />
    </div>
  );
}
