import React from "react";
import { getProductContext } from "../fetchProductContext";
import MainImage from "@/components/products/details/MainImage";
import ThumbnailImages from "@/components/products/details/ThumbnailImages";

export default async function ImagesSlot({ params: { id } }) {
  const { product } = await getProductContext(id);
  return (
    <div className="space-y-4">
      <MainImage img={product.product_image} />
      <ThumbnailImages images={product.gallery} name={product.product_name} />
    </div>
  );
}
