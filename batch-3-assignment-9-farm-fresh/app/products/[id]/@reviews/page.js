import React from "react";
// Using searchParams from the route to control auto-open behavior
import { getProductContext } from "../fetchProductContext";
import ReviewSection from "@/components/products/details/ReviewSection";

export default async function ReviewsSlot({ params: { id }, searchParams }) {
  const { product, session, reviewsPaged, reviewStats, myReview, canReview } =
    await getProductContext(id);
  const autoOpen = String(searchParams?.openReview || "") === "1";
  return (
    <ReviewSection
      productId={product.id}
      session={session}
      canReview={Boolean(canReview)}
      reviewsPaged={reviewsPaged}
      reviewStats={reviewStats}
      myReview={myReview}
      autoOpen={autoOpen}
    />
  );
}
