import React from "react";
import { getProductContext } from "../fetchProductContext";
import PriceStocks from "@/components/products/details/PriceStocks";

export default async function PriceSlot({ params: { id } }) {
  const { product, owner } = await getProductContext(id);
  return (
    <PriceStocks
      price={product.product_price_per_kg}
      stock={product.product_stock}
      location={owner?.address || "Not available"}
    />
  );
}
