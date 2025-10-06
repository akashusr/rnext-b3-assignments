import React from "react";
import { getProductContext } from "../fetchProductContext";
import QuantityAndAction from "@/components/products/details/QuantityAndAction";

export default async function ActionsSlot({ params: { id } }) {
  const { product, session } = await getProductContext(id);
  return <QuantityAndAction session={session} product={product} />;
}
