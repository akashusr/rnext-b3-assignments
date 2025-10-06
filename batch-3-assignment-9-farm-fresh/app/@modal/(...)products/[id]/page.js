import React, { Suspense } from "react";
import ModalBackWrapper from "@/components/common/ModalBackWrapper";
import ProductDetailsModalContent from "@/components/products/details/ProductDetailsModalContent";
import Skeleton from "@/components/common/Skeleton";

export default function ProductDetailsInterceptModal({ params: { id } }) {
  return (
    <ModalBackWrapper
      title="Product Details"
      contentClassName="max-w-6xl"
      autoCloseOnRouteChange
    >
      <Suspense fallback={<ModalProductSkeleton />}>
        <ProductDetailsModalContent productId={id} />
      </Suspense>
    </ModalBackWrapper>
  );
}

function ModalProductSkeleton() {
  return (
    <div className="space-y-10" aria-busy="true">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Skeleton height={320} />
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} width={64} height={64} />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton variant="title" className="h-7 w-2/3" />
          <Skeleton variant="text" lines={3} />
          <Skeleton variant="badge" className="w-24" />
          <Skeleton variant="button" />
          <Skeleton variant="text" lines={2} />
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton variant="title" className="h-6 w-1/4" />
        <Skeleton variant="text" lines={4} />
      </div>
    </div>
  );
}
