import React from "react";
import NotFoundMessage from "@/components/common/NotFoundMessage";

// Root-level 404 fallback for any unmatched route.
export default function RootNotFound() {
  return (
    <NotFoundMessage
      title="Page not found"
      message="The page you are looking for does not exist, was moved, or is temporarily unavailable."
      primaryHref="/products"
      primaryLabel="Browse Products"
    />
  );
}
