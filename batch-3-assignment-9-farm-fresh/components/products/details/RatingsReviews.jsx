"use client";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback } from "react";
import { useRouter } from "next/navigation";

const RatingsReviews = ({
  average = "0.0",
  count = 0,
  productId,
  isLoggedIn = false,
  canReview = false,
}) => {
  const router = useRouter();

  const onWriteReview = useCallback(() => {
    if (!productId) return;
    if (!isLoggedIn) {
      // Redirect unauthenticated users to login, then back to product page with the form open
      const redirect = encodeURIComponent(
        `/products/${productId}?openReview=1#reviews`
      );
      router.push(`/login?redirect=${redirect}`);
      return;
    }
    if (!canReview) return; // Safety: hide button when cannot review, so shouldn't hit
    router.push(`/products/${productId}?openReview=1#reviews`);
  }, [productId, isLoggedIn, canReview, router]);

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-1">
        <div className="flex text-yellow-400">
          <FontAwesomeIcon icon={faStar} />
          <FontAwesomeIcon icon={faStar} />
          <FontAwesomeIcon icon={faStar} />
          <FontAwesomeIcon icon={faStar} />
          <FontAwesomeIcon icon={faStar} />
        </div>
        <span className="text-lg font-semibold text-gray-900 dark:text-white">
          {average}
        </span>
      </div>
      <span className="text-gray-500 dark:text-gray-400">
        ({count} reviews)
      </span>
      {(!isLoggedIn || canReview) && (
        <button
          onClick={onWriteReview}
          className="text-primary-600 dark:text-primary-400 hover:underline"
        >
          Write a review
        </button>
      )}
    </div>
  );
};

export default RatingsReviews;
