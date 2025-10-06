"use client";
import React from "react";
import RouteError from "@/components/common/RouteError";

export default function ProductsError({ error, reset }) {
  return (
    <RouteError
      heading="Unable to load products"
      message="There was a problem fetching products. You can retry."
      error={error}
      onRetry={reset}
    />
  );
}
