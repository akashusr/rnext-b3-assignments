"use client";
import React, { useEffect } from "react";
import RouteError from "@/components/common/RouteError";

export default function AddProductError({ error, reset }) {
  useEffect(() => {
    // console.error("Add product route error:", error);
  }, [error]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <RouteError
        heading="Unable to load add product form"
        message="We couldn't prepare the product creation form."
        error={error}
        onRetry={reset}
      />
    </div>
  );
}
