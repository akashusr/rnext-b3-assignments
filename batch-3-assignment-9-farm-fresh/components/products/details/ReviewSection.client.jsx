"use client";

/**
 * ReviewSection Client Component
 *
 * Features:
 * - Shows 5 reviews initially
 * - "Load More" button to load 5 additional reviews at a time
 * - Reviews are loaded via API call to /api/products/[id]/reviews
 * - Maintains proper star rating statistics from server
 * - User's own review appears first if they have one
 *
 * Props:
 * - initialReviewsPaged: Initial 5 reviews from server
 * - reviewStats: Complete review statistics (count, avg, breakdown)
 * - Other props for product info, session, and actions
 */

import {
  faEllipsisV,
  faStar,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import Image from "next/image";
import ReviewFormDetails from "./ReviewFormDetails.client";

function Stars({ value = 0 }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex text-yellow-400">
      {stars.map((s) => (
        <svg
          key={s}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`w-4 h-4 ${
            s <= value ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
          }`}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.035a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.035a1 1 0 00-1.176 0l-2.802 2.035c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const ReviewSectionClient = ({
  productId,
  session,
  canReview,
  initialReviewsPaged,
  reviewStats,
  myReview,
  submitReview,
  removeReview,
  autoOpen = false,
}) => {
  const [reviews, setReviews] = useState(initialReviewsPaged?.items || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(
    (reviewStats?.count || 0) > (initialReviewsPaged?.items?.length || 0)
  );

  const loadMoreReviews = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/products/${productId}/reviews?page=${currentPage + 1}&limit=5`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          setReviews((prev) => [...prev, ...data.items]);
          setCurrentPage((prev) => prev + 1);
          setHasMore(
            reviews.length + data.items.length < (reviewStats?.count || 0)
          );
        } else {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Error loading more reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const total = reviewStats?.count || 0;
  const avg = reviewStats?.avg?.toFixed(1) || "0.0";

  // order reviews so the logged-in user's review appears first
  const orderedItems = Array.isArray(reviews)
    ? [...reviews].sort((a, b) => {
        const uid = String(session?.user?.id || "");
        const aMine = String(a.user?.id || a.user?._id || "") === uid;
        const bMine = String(b.user?.id || b.user?._id || "") === uid;
        if (aMine && !bMine) return -1;
        if (!aMine && bMine) return 1;
        // fallback: newest first
        return new Date(b.createdAt) - new Date(a.createdAt);
      })
    : [];

  return (
    <div className="mt-16" id="reviews">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Customer Reviews
        </h2>
        {session?.user?.id && (canReview || myReview) && (
          <ReviewFormDetails
            show={true}
            productId={productId}
            myReview={myReview}
            submitReview={submitReview}
            removeReview={removeReview}
            autoOpen={autoOpen}
          />
        )}
      </div>

      {/* <!-- Review Summary --> */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                {avg}
              </span>
              <div>
                <Stars value={Number(avg)} />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Based on {total} reviews
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const n = reviewStats?.breakdown?.[star] || 0;
              const pct = total ? Math.round((n / total) * 100) : 0;
              return (
                <div key={star} className="flex items-center space-x-2">
                  <span className="text-sm w-8">{star}★</span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 w-8">
                    {n}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* <!-- Individual Reviews --> */}
      <div className="space-y-6">
        {orderedItems?.length ? (
          orderedItems.map((r) => (
            <div
              key={r.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6"
            >
              <div className="flex items-start space-x-4">
                <Image
                  src={r.user?.image || "/user.png"}
                  alt={r.user?.name || "User"}
                  className="w-12 h-12 rounded-full object-cover"
                  width={48}
                  height={48}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {r.user?.name || "Anonymous"}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <div className="flex text-yellow-400 text-sm">
                          <Stars value={r.rating} />
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {session?.user?.id &&
                      String(session.user.id) === String(r.user?.id) && (
                        <form action={removeReview}>
                          <input
                            type="hidden"
                            name="productId"
                            value={productId}
                          />
                          <button className="text-red-500 hover:text-red-600 text-sm">
                            Delete
                          </button>
                        </form>
                      )}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-1 whitespace-pre-line">
                    {r.comment}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-600 dark:text-gray-400">
            No reviews yet.
          </div>
        )}
      </div>

      {/* <!-- Load More Reviews --> */}
      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMoreReviews}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            {loading ? "Loading..." : "Load More Reviews"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewSectionClient;
