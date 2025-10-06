import React from "react";
import Link from "next/link";
import { cn } from "./uiTokens";

// Generic Not Found UI
export default function NotFoundMessage({
  title = "Not Found",
  message = "The resource you are looking for could not be found.",
  homeHref = "/",
  primaryHref = "/products",
  primaryLabel = "Browse Products",
  className,
}) {
  return (
    <div
      className={cn(
        "max-w-xl mx-auto text-center py-16 px-4 sm:px-6 lg:px-8",
        className
      )}
    >
      <h1 className="text-3xl sm:text-4xl font-semibold mb-4">{title}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">{message}</p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href={primaryHref}
          className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-md text-sm font-medium"
        >
          {primaryLabel}
        </Link>
        <Link
          href={homeHref}
          className="border border-gray-300 dark:border-gray-600 px-6 py-3 rounded-md text-sm font-medium"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
