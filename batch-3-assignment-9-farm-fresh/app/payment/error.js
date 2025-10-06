"use client";
import React, { useEffect } from "react";
import RouteError from "@/components/common/RouteError";

export default function PaymentError({ error, reset }) {
  useEffect(() => {
    // console.error("Payment route error:", error);
  }, [error]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <RouteError
        heading="Payment unavailable"
        message="We couldn't initialize the payment process."
        error={error}
        onRetry={reset}
      />
    </div>
  );
}
