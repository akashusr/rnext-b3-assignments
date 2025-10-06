"use client";
import React from "react";
import RouteError from "@/components/common/RouteError";

export default function ReviewError({ error, reset }) {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-800">
      <div className="max-w-md w-full">
        <RouteError
          heading="Unable to load review form"
          message="Something went wrong while preparing the review form. You can retry."
          error={error}
          onRetry={reset}
        />
      </div>
    </div>
  );
}
