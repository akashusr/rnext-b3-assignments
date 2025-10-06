"use client";
import React, { useEffect, useRef } from "react";

export default function ReviewFormDetails({
  show,
  productId,
  myReview,
  submitReview,
  removeReview,
  autoOpen = false,
}) {
  const detailsRef = useRef(null);

  const closeDetails = () => {
    try {
      detailsRef.current?.removeAttribute("open");
    } catch {}
  };

  useEffect(() => {
    if (autoOpen) {
      try {
        // Open the details element to show the form immediately
        detailsRef.current?.setAttribute("open", "open");
        // Focus the first form element for better UX
        const el = detailsRef.current?.querySelector(
          'select[name="rating"], textarea[name="comment"]'
        );
        el?.focus?.();
      } catch {}
    }
  }, [autoOpen]);

  if (!show) return null;

  return (
    <details ref={detailsRef} className="w-full md:w-auto">
      <summary className="list-none">
        <span className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition cursor-pointer inline-block">
          {myReview ? "Edit Review" : "Write a Review"}
        </span>
      </summary>
      <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <form
          action={submitReview}
          className="space-y-3"
          onSubmit={closeDetails}
        >
          <input type="hidden" name="productId" value={productId} />
          <label className="block text-sm font-medium">Rating</label>
          <select
            name="rating"
            defaultValue={myReview?.rating || 5}
            className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <label className="block text-sm font-medium">Comment</label>
          <textarea
            name="comment"
            defaultValue={myReview?.comment || ""}
            rows={3}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            placeholder="Share your experience"
          />
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition">
            {myReview ? "Update Review" : "Submit Review"}
          </button>
        </form>
        {myReview && (
          <form action={removeReview} className="mt-3" onSubmit={closeDetails}>
            <input type="hidden" name="productId" value={productId} />
            <button className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg font-medium transition">
              Delete
            </button>
          </form>
        )}
      </div>
    </details>
  );
}
