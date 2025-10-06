"use client";
import React, { useEffect } from "react";
import RouteError from "@/components/common/RouteError";

export default function Error({ error, reset }) {
  useEffect(() => {
    // console.error("Profile route error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center">
      <div className="max-w-xl mx-auto px-4 w-full">
        <RouteError
          heading="Unable to load profile"
          message="We hit a snag loading your profile. If the problem persists, please re-login."
          error={error}
          onRetry={reset}
          actions={
            <a
              href="/login"
              className="px-5 py-2.5 text-sm font-medium rounded-md bg-primary-600 hover:bg-primary-700 text-white"
            >
              Go to Login
            </a>
          }
        />
      </div>
    </div>
  );
}
