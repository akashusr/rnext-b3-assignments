"use client";
import AddTOFavorite from "@/components/products/AddTOFavorite";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React, { useMemo } from "react";
import AddToCart from "./AddToCart";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

// session is not passed by parent components; rely on userId prop instead
const ProductCard = ({ product, userId }) => {
  let avgRating = null;
  let ratingsCount = 0;
  const farmerName = product.farmerName || null;
  const farmName = product.farmName || null;
  const farmerAddress = product.farmerAddress || null;

  const ratingDisplay =
    typeof avgRating === "number" && ratingsCount > 0
      ? avgRating.toFixed(1)
      : null;
  const farmerDisplay = farmName || farmerName || "Local Farmer";
  const locationDisplay = farmerAddress || "Location unknown";
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const loginCallbackParam = useMemo(() => {
    if (!pathname) return "/";
    const qs = searchParams?.toString();
    const full = pathname + (qs ? `?${qs}` : "");
    return encodeURIComponent(full);
  }, [pathname, searchParams]);

  const isLoggedIn = !!userId; // unified flag

  // membership now derived inside child components to avoid stale props

  const unpublished = product.publish === false;
  return (
    <>
      <div className="relative">
        <Link
          href={unpublished ? "#" : `/products/${product.id}`}
          aria-disabled={unpublished}
        >
          <Image
            src={product.product_image}
            alt={product.product_name}
            width={300}
            height={300}
            className={`w-full h-48 object-cover transition-transform duration-300 ${
              unpublished ? "opacity-60" : "group-hover:scale-105"
            }`}
          />
        </Link>
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            {product.organic ? "Organic" : "Non-Organic"}
          </span>
          {unpublished && (
            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow">
              Coming Soon
            </span>
          )}
        </div>
        {!unpublished && (
          <div className="absolute top-3 right-3">
            {isLoggedIn && (
              <AddTOFavorite
                productId={product._id.toString()}
                userId={userId}
              />
            )}
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span
            className={`font-semibold block ${
              unpublished
                ? "text-gray-500 dark:text-gray-400"
                : "text-gray-900 dark:text-white"
            }`}
          >
            {product.product_name}
          </span>
          <div className="flex items-center text-yellow-400">
            <FontAwesomeIcon icon={faStar} className="text-sm" />
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
              {ratingDisplay ?? "No ratings"}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          By {farmerDisplay} • {locationDisplay}
        </p>
        {unpublished ? (
          <div className="text-sm text-gray-500 dark:text-gray-400 italic">
            This product isn&apos;t published yet. Check back soon.
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  ৳{product.product_price_per_kg}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  /kg
                </span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Stock: {product.product_stock}kg
              </span>
            </div>
            {isLoggedIn ? (
              <AddToCart productId={product._id.toString()} userId={userId} />
            ) : (
              <Link
                href={`/login?callbackUrl=${loginCallbackParam}`}
                className="w-full inline-block text-center bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition"
              >
                Login to Add to Cart
              </Link>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ProductCard;
