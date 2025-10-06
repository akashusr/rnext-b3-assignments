"use client";
import React, { useEffect } from "react";
import RouteError from "@/components/common/RouteError";

export default function Error({ error, reset }) {
  useEffect(() => {
    // console.error("Register route error:", error);
  }, [error]);

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <RouteError
        heading="Registration unavailable"
        message="We couldn't load the registration form."
        error={error}
        onRetry={reset}
      />
    </div>
  );
}
