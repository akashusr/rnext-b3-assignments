"use client";
import React, { useEffect, useState } from "react";
import { useCart } from "@/context/CartProvider";
import { getProductsByIds } from "@/actions/bulkProductsAction";
import { removeFromCart } from "@/actions/cartAction";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const CartPageClient = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { cart, removeFromCartContext } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!session?.user?.id) return;
      setLoading(true);
      try {
        const prods = await getProductsByIds(cart);
        setItems(prods);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [cart, session]);

  if (!session?.user?.id)
    return <div className="max-w-4xl mx-auto p-6">Please login.</div>;

  const handleRemove = async (id) => {
    await removeFromCart(id, session.user.id);
    removeFromCartContext(id);
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const goToPaymentAll = () => {
    router.push("/payment?from=cart");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      {loading ? (
        <div>Loading...</div>
      ) : items.length === 0 ? (
        <div>Your cart is empty.</div>
      ) : (
        <>
          <ul className="space-y-4">
            {items.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
              >
                <Image
                  src={p.product_image || "/user.png"}
                  alt={p.product_name}
                  className="w-20 h-20 object-cover rounded"
                  width={80}
                  height={80}
                />
                <div className="flex-1">
                  <div className="font-semibold">{p.product_name}</div>
                  <div className="text-sm text-gray-500">
                    ৳{p.product_price_per_kg} / kg
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(p.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={goToPaymentAll}
            className="mt-6 w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-medium"
          >
            Buy All
          </button>
        </>
      )}
    </div>
  );
};

export default CartPageClient;
