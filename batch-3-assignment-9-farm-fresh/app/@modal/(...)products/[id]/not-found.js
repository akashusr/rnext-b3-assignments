import React from "react";
import NotFoundMessage from "@/components/common/NotFoundMessage";

export default function ProductModalNotFound() {
  return (
    <NotFoundMessage
      title="Product not found"
      message="This product may have been removed or is no longer available."
      primaryHref="/products"
      primaryLabel="Back to Products"
    />
  );
}
