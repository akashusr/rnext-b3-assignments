import React from "react";
import { auth } from "@/auth";
import { dbConnect } from "@/mongo";
import { ProductModel } from "@/models/productModel";
import ProductCard from "@/components/products/ProductCard";
import { getFavorite } from "@/actions/favoriteAction";
import { getCart } from "@/actions/cartAction";

const RelatedProducts = async ({ productId }) => {
  // Fetch current product and then other products by same owner
  await dbConnect();

  const current = await ProductModel.findById(productId);
  if (!current) return null;

  const ownerId = current.owner_id?.toString();
  // Fetch all products from same farmer excluding current product
  const allProducts = await ProductModel.find({
    owner_id: ownerId,
    _id: { $ne: current._id },
    publish: true,
  });

  // Randomly shuffle and select up to 5 products
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const products = shuffleArray(allProducts).slice(0, 4);

  if (!products.length) return null;

  // annotate with fav/cart for logged-in users so ProductCard can show buttons states
  const session = await auth();
  const userId = session?.user?.id;
  let fav = { products: [] };
  let cart = { products: [] };
  if (userId) {
    try {
      fav = (await getFavorite(userId)) ?? { products: [] };
    } catch (_) {}
    try {
      cart = (await getCart(userId)) ?? { products: [] };
    } catch (_) {}
  }

  const items = products.map((p) => {
    const plain = {
      ...p._doc,
      _id: p._id.toString(),
      id: p._id.toString(),
      owner_id: p.owner_id.toString(),
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    };
    const isFavorite = fav?.products?.includes(plain.id) ?? false;
    const isInCart = cart?.products?.includes(plain.id) ?? false;
    return { ...plain, isFavorite, isInCart };
  });

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        More from this farmer
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
          >
            <ProductCard product={product} userId={userId} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
