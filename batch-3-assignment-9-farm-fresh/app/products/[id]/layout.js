import React from "react";
import ScrollTopOnMount from "./scroll-top-client";
import ProductDetailsHeader from "@/components/products/details/ProductDetailsBreadcrumb";
import { getProductContext } from "./fetchProductContext";

export default async function ProductDetailsLayout({
  params: { id },
  children,
  header,
  images,
  info,
  price,
  actions,
  contact,
  description,
  reviews,
  related,
}) {
  const { product } = await getProductContext(id);
  return (
    <>
      <ScrollTopOnMount />
      {header || <ProductDetailsHeader name={product.product_name} />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">{images}</div>
          <div className="space-y-6">
            {info}
            {price}
            {actions}
            {contact}
          </div>
        </div>
        {description}
        {reviews}
        {related}
        {children}
      </div>
    </>
  );
}
