import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const page = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-800">
      {/* <!-- Modal Container --> */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <h2 className="text-2xl font-semibold mb-4">Write a Review</h2>
        <form className="space-y-4" id="reviewForm">
          <div>
            <label
              htmlFor="rating"
              className="block mb-2 font-medium text-gray-700 dark:text-gray-300"
            >
              Rate this product
            </label>
            <div
              className="star-rating flex items-center gap-1 mb-2"
              id="starRating"
            >
              <input
                type="radio"
                id="star5"
                name="rating"
                value="5"
                className="hidden"
              />
              <label
                htmlFor="star5"
                title="5 stars - Excellent"
                className="star-label cursor-pointer text-3xl transition-all duration-200 hover:scale-110 text-gray-300 dark:text-gray-600 hover:text-yellow-400 dark:hover:text-yellow-400"
              >
                <FontAwesomeIcon icon={faStar} />
              </label>
              <input
                type="radio"
                id="star4"
                name="rating"
                value="4"
                className="hidden"
              />
              <label
                htmlFor="star4"
                title="4 stars - Very Good"
                className="star-label cursor-pointer text-3xl transition-all duration-200 hover:scale-110 text-gray-300 dark:text-gray-600 hover:text-yellow-400 dark:hover:text-yellow-400"
              >
                <FontAwesomeIcon icon={faStar} />
              </label>
              <input
                type="radio"
                id="star3"
                name="rating"
                value="3"
                className="hidden"
              />
              <label
                htmlFor="star3"
                title="3 stars - Good"
                className="star-label cursor-pointer text-3xl transition-all duration-200 hover:scale-110 text-gray-300 dark:text-gray-600 hover:text-yellow-400 dark:hover:text-yellow-400"
              >
                <FontAwesomeIcon icon={faStar} />
              </label>
              <input
                type="radio"
                id="star2"
                name="rating"
                value="2"
                className="hidden"
              />
              <label
                htmlFor="star2"
                title="2 stars - Fair"
                className="star-label cursor-pointer text-3xl transition-all duration-200 hover:scale-110 text-gray-300 dark:text-gray-600 hover:text-yellow-400 dark:hover:text-yellow-400"
              >
                <FontAwesomeIcon icon={faStar} />
              </label>
              <input
                type="radio"
                id="star1"
                name="rating"
                value="1"
                className="hidden"
              />
              <label
                htmlFor="star1"
                title="1 star - Poor"
                className="star-label cursor-pointer text-3xl transition-all duration-200 hover:scale-110 text-gray-300 dark:text-gray-600 hover:text-yellow-400 dark:hover:text-yellow-400"
              >
                <FontAwesomeIcon icon={faStar} />
              </label>
            </div>
            <p
              className="text-sm text-gray-600 dark:text-gray-400 mb-1"
              id="ratingText"
            >
              Click to rate this product
            </p>
            <p className="text-red-500 text-xs italic hidden" id="ratingError">
              Please select a rating.
            </p>
          </div>
          <div>
            <label htmlFor="comment" className="block mb-1 font-medium">
              Comment
            </label>
            <textarea
              id="comment"
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Write your review here..."
              required
            ></textarea>
            <p className="text-red-500 text-xs italic hidden" id="commentError">
              Please enter your comment.
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-800 dark:hover:bg-green-900 text-white py-2 rounded-md font-semibold transition"
          >
            Submit Review
          </button>
        </form>
        {/* <!-- Close Button --> */}
        <button
          aria-label="Close modal"
          // onClick={() => window.history.back()}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default page;
