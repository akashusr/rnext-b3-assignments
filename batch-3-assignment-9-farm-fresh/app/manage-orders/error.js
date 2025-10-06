"use client";
import React from "react";
import RouteError from "@/components/common/RouteError";

export default function ManageOrdersError({ error, reset }) {
  return (
    <RouteError
      heading="Unable to load orders"
      message="We couldn't load your orders right now. Please retry."
      error={error}
      onRetry={reset}
    />
  );
}
