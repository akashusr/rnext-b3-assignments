"use client";
import React, { useState } from "react";
import Quantity from "./Quantity";
import DetailsActions from "./DetailsActions";

const QuantityAndAction = ({ session, product }) => {
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, product.product_stock));
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  return (
    <>
      {/* <!-- Quantity and Date Selection --> */}
      <Quantity
        stock={product.product_stock}
        quantity={quantity}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
      />

      {/* <!-- Action Buttons --> */}
      <DetailsActions product={product} quantity={quantity} session={session} />
    </>
  );
};

export default QuantityAndAction;
