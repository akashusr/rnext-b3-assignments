import React from "react";
import { getProductContext } from "../fetchProductContext";
import ProductHeader from "@/components/products/details/ProductHeader";
import RatingsReviews from "@/components/products/details/RatingsReviews";

export default async function InfoSlot({ params: { id } }) {
  const { product, owner, reviewsPaged, session, canReview } =
    await getProductContext(id);
  const average = reviewsPaged?.total
    ? (
        reviewsPaged.items.reduce((s, r) => s + (r.rating || 0), 0) /
        reviewsPaged.items.length
      ).toFixed(1)
    : "0.0";

  return (
    <>
      <ProductHeader
        organic={product.organic}
        name={product.product_name}
        producerName={owner?.farmDetails?.farmName || owner?.name || "Unknown"}
      />
      <RatingsReviews
        average={average}
        count={reviewsPaged?.total || 0}
        productId={product.id}
        isLoggedIn={Boolean(session?.user?.id)}
        canReview={Boolean(canReview)}
      />
    </>
  );
}
