"use client";
import React, { useEffect } from "react";
import RouteError from "@/components/common/RouteError";

export default function SuccessRouteError({ error, reset }) {
  useEffect(() => {
    // console.error("Success route error:", error);
  }, [error]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <RouteError
        heading="Unable to load confirmation"
        message="We hit a snag loading your order confirmation details."
        error={error}
        onRetry={reset}
      />
    </div>
  );
}
