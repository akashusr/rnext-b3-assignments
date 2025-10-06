import React from "react";
import ProductDescription from "@/components/products/details/ProductDescription";
import { getProductContext } from "../fetchProductContext";

export default async function DescriptionSlot({ params: { id } }) {
  const { product, owner, reviewsPaged } = await getProductContext(id);

  // Try to read a description if your model supports it; fallback to null
  const description = product?.description ?? null;

  return (
    <ProductDescription
      description={description}
      reviewCount={Number(reviewsPaged?.total || 0)}
      farmer={owner || null}
    />
  );
}
