"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getCart } from "@/actions/cartAction";

const CartContext = createContext([]);

const CartProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const allCart = async () => {
      if (session) {
        const cartData = await getCart(session.user.id);
        setCart(cartData?.products);
      }
    };
    allCart();
  }, [session]);

  const addToCartContext = (product) => {
    // console.log("Adding to cart:", product);
    setCart((prev) => [...prev, product]);
  };

  const removeFromCartContext = (productId) => {
    setCart((prev) => prev.filter((item) => item !== productId));
  };

  const inCart = (productId) => {
    if (!productId) return false;
    return cart?.includes(productId.toString());
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCartContext, removeFromCartContext, inCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};

export default CartProvider;
