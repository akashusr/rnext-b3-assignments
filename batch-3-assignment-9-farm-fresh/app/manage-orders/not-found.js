import React from "react";
import NotFoundMessage from "@/components/common/NotFoundMessage";

// Specific 404 for manage-orders (e.g., invalid status/page beyond range)
export default function ManageOrdersNotFound() {
  return (
    <NotFoundMessage
      title="Orders not found"
      message="We couldn't find the orders you were looking for. They may have been removed or the filter is invalid."
      primaryHref="/products"
      primaryLabel="Browse Products"
    />
  );
}
