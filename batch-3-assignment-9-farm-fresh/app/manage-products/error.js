"use client";
import React from "react";
import RouteError from "@/components/common/RouteError";

export default function ManageProductsListError({ error, reset }) {
  return (
    <RouteError
      heading="Unable to load your products"
      message="We hit a snag loading your product list. Please try again."
      error={error}
      onRetry={reset}
    />
  );
}
