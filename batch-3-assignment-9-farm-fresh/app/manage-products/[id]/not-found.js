import React from "react";
import NotFoundMessage from "@/components/common/NotFoundMessage";

export default function EditProductNotFound() {
  return (
    <NotFoundMessage
      title="Product not found"
      message="The product you're trying to edit doesn't exist or you don't have access to it."
      primaryHref="/manage-products"
      primaryLabel="Back to My Products"
    />
  );
}
