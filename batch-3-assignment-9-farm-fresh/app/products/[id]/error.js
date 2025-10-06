"use client";
import React from "react";
import RouteError from "@/components/common/RouteError";

export default function ProductDetailsError({ error, reset }) {
  return (
    <RouteError
      heading="Unable to load product"
      message="There was a problem loading this product. Try again."
      error={error}
      onRetry={reset}
    />
  );
}
