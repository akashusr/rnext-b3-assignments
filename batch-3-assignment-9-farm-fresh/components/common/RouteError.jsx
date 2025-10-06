"use client";
import React, { useEffect, useRef } from "react";
import { cn } from "./uiTokens";

// Reusable route-level error UI
export default function RouteError({
  heading = "Something went wrong",
  message = "We couldn't load this content. Please try again.",
  error,
  onRetry,
  actions,
  className,
}) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.focus?.();
  }, []);

  return (
    <div
      role="alert"
      tabIndex={-1}
      ref={ref}
      className={cn(
        "border border-red-300 dark:border-red-700 bg-red-50/70 dark:bg-red-900/30",
        "p-6 rounded-md max-w-2xl mx-auto text-center",
        className
      )}
    >
      <h2 className="text-lg sm:text-xl font-semibold mb-2 text-red-700 dark:text-red-400">
        {heading}
      </h2>
      <p className="text-sm text-red-600 dark:text-red-300 mb-4">{message}</p>
      {error?.message && (
        <details className="mb-4 text-left text-xs opacity-80 whitespace-pre-wrap break-words">
          <summary className="cursor-pointer select-none">Details</summary>
          {error.message}
        </details>
      )}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button
            onClick={() => onRetry?.()}
            className={cn(
              "px-5 py-2.5 text-sm font-medium text-white",
              "bg-green-700 hover:bg-green-800 rounded-md"
            )}
          >
            Try again
          </button>
        )}
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600"
        >
          Reload
        </button>
        {actions}
      </div>
    </div>
  );
}
