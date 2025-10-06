"use client";
import React from "react";
import RouteError from "@/components/common/RouteError";

export default function FarmersError({ error, reset }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <RouteError
        heading="Unable to load farmers"
        message="There was a problem fetching farmer data. Please try again."
        error={error}
        onRetry={reset}
      />
    </div>
  );
}
