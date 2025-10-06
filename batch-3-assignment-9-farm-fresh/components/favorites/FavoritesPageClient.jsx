"use client";
import React, { useEffect, useState } from "react";
import { useFavorite } from "@/context/FavoriteProvider";
import { getProductsByIds } from "@/actions/bulkProductsAction";
import { removeFromFavorite, addToFavorite } from "@/actions/favoriteAction";
import { addToCart } from "@/actions/cartAction";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartProvider";
import Image from "next/image";

const FavoritesPageClient = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { favorites, removeFromFav } = useFavorite();
  const { addToCartContext } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!session?.user?.id) return;
      setLoading(true);
      try {
        const prods = await getProductsByIds(favorites);
        setItems(prods);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [favorites, session]);

  if (!session?.user?.id)
    return <div className="max-w-4xl mx-auto p-6">Please login.</div>;

  const handleRemove = async (id) => {
    await removeFromFavorite(id, session.user.id);
    removeFromFav(id);
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddToCart = async (id) => {
    await addToCart(id, session.user.id);
    addToCartContext(id);
  };

  const handleBuyNow = (id) => {
    router.push(`/payment?productId=${id}&qty=1&from=favorites`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-6">Your Favorites</h1>
      {loading ? (
        <div>Loading...</div>
      ) : items.length === 0 ? (
        <div>No favorites yet.</div>
      ) : (
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
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handleBuyNow(p.id)}
                  className="text-sm bg-primary-600 text-white px-3 py-1 rounded"
                >
                  Buy Now
                </button>
                <button
                  onClick={() => handleAddToCart(p.id)}
                  className="text-sm border px-3 py-1 rounded"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleRemove(p.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FavoritesPageClient;
