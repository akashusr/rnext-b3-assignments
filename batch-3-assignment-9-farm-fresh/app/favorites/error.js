"use client";
import React, { useEffect } from "react";
import RouteError from "@/components/common/RouteError";

export default function Error({ error, reset }) {
  useEffect(() => {
    // console.error("Favorites route error:", error);
  }, [error]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <RouteError
        heading="Unable to load favorites"
        message="We couldn't load your favorites list."
        error={error}
        onRetry={reset}
      />
    </div>
  );
}
