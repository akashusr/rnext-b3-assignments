"use client";
import React from "react";
import RouteError from "@/components/common/RouteError";

export default function EditProductError({ error, reset }) {
  return (
    <RouteError
      heading="Unable to load product for editing"
      message="There was a problem fetching this product. Try again."
      error={error}
      onRetry={reset}
    />
  );
}
