import React from "react";
import { getProductContext } from "@/app/products/[id]/fetchProductContext";
import MainImage from "@/components/products/details/MainImage";
import ThumbnailImages from "@/components/products/details/ThumbnailImages";
import ProductHeader from "@/components/products/details/ProductHeader";
import RatingsReviews from "@/components/products/details/RatingsReviews";
import PriceStocks from "@/components/products/details/PriceStocks";
import QuantityAndAction from "@/components/products/details/QuantityAndAction";
import FarmerContacts from "@/components/products/details/FarmerContacts";
import ProductDescription from "@/components/products/details/ProductDescription";
import ReviewSection from "@/components/products/details/ReviewSection";
import RelatedProducts from "@/components/products/details/RelatedProducts";

// Server component composing the same info shown on full product details page, for modal usage.
export default async function ProductDetailsModalContent({ productId }) {
  const {
    product,
    owner,
    session,
    reviewsPaged,
    reviewStats,
    myReview,
    canReview,
  } = await getProductContext(productId);

  const average = reviewsPaged?.total
    ? (
        reviewsPaged.items.reduce((s, r) => s + (r.rating || 0), 0) /
        reviewsPaged.items.length
      ).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <MainImage img={product.product_image} />
          <ThumbnailImages
            images={product.gallery}
            name={product.product_name}
          />
        </div>
        <div className="space-y-6">
          <div>
            <ProductHeader
              organic={product.organic}
              name={product.product_name}
              producerName={
                owner?.farmDetails?.farmName || owner?.name || "Unknown"
              }
            />
            <div className="mt-2">
              <RatingsReviews
                average={average}
                count={reviewsPaged?.total || 0}
                productId={product.id}
                isLoggedIn={Boolean(session?.user?.id)}
                canReview={Boolean(canReview)}
              />
            </div>
          </div>
          <PriceStocks
            price={product.product_price_per_kg}
            stock={product.product_stock}
            location={owner?.address || "Not available"}
          />
          <QuantityAndAction session={session} product={product} />
          <FarmerContacts
            name={owner?.name || "Unknown"}
            image={owner?.image || undefined}
            since={undefined}
            farmName={owner?.farmDetails?.farmName || "Not available"}
          />
        </div>
      </div>
      <ProductDescription
        description={product?.description ?? null}
        reviewCount={Number(reviewsPaged?.total || 0)}
        farmer={owner || null}
      />
      <ReviewSection
        productId={product.id}
        session={session}
        canReview={Boolean(canReview)}
        reviewsPaged={reviewsPaged}
        reviewStats={reviewStats}
        myReview={myReview}
      />
      <RelatedProducts productId={product.id} />
    </div>
  );
}
