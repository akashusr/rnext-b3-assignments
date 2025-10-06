"use client";
import { addToCart, removeFromCart } from "@/actions/cartAction";
import { useCart } from "@/context/CartProvider";
import React, { useTransition } from "react";
import { useRouter } from "next/navigation";

const AddToCart = ({ productId, userId }) => {
  const { addToCartContext, removeFromCartContext, inCart } = useCart();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const present = inCart(productId);

  const handleCartToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) {
      router.push("/login");
      return;
    }
    startTransition(async () => {
      try {
        if (present) {
          removeFromCartContext(productId); // optimistic
          await removeFromCart(productId, userId);
        } else {
          addToCartContext(productId); // optimistic
          await addToCart(productId, userId);
        }
      } catch (err) {
        // Optionally refetch cart on error
      }
    });
  };

  return (
    <button
      onClick={handleCartToggle}
      disabled={isPending}
      className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white py-2 rounded-lg font-medium transition"
    >
      {present ? "Remove from Cart" : "Add to Cart"}
    </button>
  );
};

export default AddToCart;
