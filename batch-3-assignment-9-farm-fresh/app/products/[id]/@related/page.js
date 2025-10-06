import React from "react";
import RelatedProducts from "@/components/products/details/RelatedProducts";

export default async function RelatedSlot({ params: { id } }) {
  return <RelatedProducts productId={id} emptyFallback={<NoRelated />} />;
}

function NoRelated() {
  return (
    <div className="mt-12">
      <h3 className="text-lg font-semibold mb-2">Related Products</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        No related products found.
      </p>
    </div>
  );
}
