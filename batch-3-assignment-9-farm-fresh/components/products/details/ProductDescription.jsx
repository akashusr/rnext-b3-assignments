"use client";
import React from "react";
import Link from "next/link";

// Lightweight tabbed section that swaps between Description, Reviews notice, and Farmer Info.
// Props:
// - description: string | null
// - reviewCount: number
// - farmer: { name, image, address, farmDetails?: { farmName, specialization, farmSize, farmSizeUnit } } | null
const tabs = ["description", "reviews", "farmer"];

const ProductDescription = ({
  description,
  reviewCount = 0,
  farmer = null,
}) => {
  const [active, setActive] = React.useState("description");

  const isActive = (key) =>
    active === key
      ? "border-b-2 border-primary-500 text-primary-600 dark:text-primary-400"
      : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300";

  // Farmer display fallbacks
  const farmName = farmer?.farmDetails?.farmName || "Local Community Farm";
  const farmerName = farmer?.name || "Anonymous Farmer";
  const specialization = farmer?.farmDetails?.specialization || "Mixed produce";
  const size = farmer?.farmDetails?.farmSize
    ? `${farmer.farmDetails.farmSize} ${
        farmer.farmDetails.farmSizeUnit || "acres"
      }`
    : null;
  const address = farmer?.address || "Location not specified";

  return (
    <div className="mt-16">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`${isActive(
              "description"
            )} py-4 px-1 text-sm font-medium`}
            onClick={() => setActive("description")}
          >
            Description
          </button>
          <button
            className={`${isActive("reviews")} py-4 px-1 text-sm font-medium`}
            onClick={() => setActive("reviews")}
          >
            Reviews ({reviewCount})
          </button>
          <button
            className={`${isActive("farmer")} py-4 px-1 text-sm font-medium`}
            onClick={() => setActive("farmer")}
          >
            Farmer Info
          </button>
        </nav>
      </div>

      <div className="py-8">
        {active === "description" && (
          <div className="prose prose-lg max-w-none dark:prose-invert">
            {description ? (
              <>
                <h3>About This Product</h3>
                <p className="whitespace-pre-line">{description}</p>
              </>
            ) : (
              <>
                <h3>About This Product</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  No detailed description is available for this product yet.
                </p>
              </>
            )}
          </div>
        )}

        {active === "reviews" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Reviews
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Here are the reviews. Scroll down to the reviews section or use
              the link below.
            </p>
            <Link
              href="#reviews"
              className="inline-block text-primary-600 dark:text-primary-400 hover:underline"
            >
              Jump to reviews ({reviewCount})
            </Link>
          </div>
        )}

        {active === "farmer" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Farmer Information
            </h3>
            <ul className="space-y-1 text-gray-700 dark:text-gray-300">
              <li>
                <span className="font-medium">Farm name:</span> {farmName}
              </li>
              <li>
                <span className="font-medium">Farmer:</span> {farmerName}
              </li>
              <li>
                <span className="font-medium">Specialization:</span>{" "}
                {specialization}
              </li>
              <li>
                <span className="font-medium">Location:</span> {address}
              </li>
              {size && (
                <li>
                  <span className="font-medium">Farm size:</span> {size}
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDescription;
