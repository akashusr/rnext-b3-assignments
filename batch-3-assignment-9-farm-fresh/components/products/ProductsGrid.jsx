import React from "react";
import { getProductsWithPagination } from "@/actions/productsAction";
import ProductsPagination from "./ProductsPagination";
import ProductsSortAndView from "./ProductsSort&View";
import ProductCard from "./ProductCard";
import { getFavorite } from "@/actions/favoriteAction";
import { auth } from "@/auth";
import { getCart } from "@/actions/cartAction";
// import Link from "next/link";

const ProductsGrid = async ({
  category,
  page,
  q,
  price,
  location,
  organic,
  view,
  sort,
}) => {
  const products = await getProductsWithPagination(
    page,
    view,
    sort,
    category,
    q,
    price,
    location,
    organic
  );
  const productsLength = products.pagination.totalProducts;

  let newProducts = [];

  const session = await auth();
  const userId = session?.user?.id;

  // console.log("Products Length:", productsLength);

  let favoriteProducts = { products: [] };
  let cartProducts = { products: [] };
  if (userId) {
    try {
      favoriteProducts = (await getFavorite(userId)) ?? { products: [] };
    } catch (_) {
      favoriteProducts = { products: [] };
    }
    try {
      cartProducts = (await getCart(userId)) ?? { products: [] };
    } catch (_) {
      cartProducts = { products: [] };
    }
  }

  newProducts = products.products.map((product) => {
    // product is already a plain object from the action (lean + manual mapping)
    const id = product.id || (product._id && product._id.toString());
    const createdAt =
      typeof product.createdAt === "string"
        ? product.createdAt
        : product.createdAt?.toISOString?.() ?? null;
    const updatedAt =
      typeof product.updatedAt === "string"
        ? product.updatedAt
        : product.updatedAt?.toISOString?.() ?? null;

    const normalized = {
      ...product,
      id,
      _id: id, // keep both for components expecting either
      owner_id: product.owner_id?.toString?.() ?? product.owner_id,
      createdAt,
      updatedAt,
    };

    const isInCart = cartProducts?.products.includes(normalized.id);
    const isFavorite = favoriteProducts?.products.includes(normalized.id);
    return { ...normalized, isInCart, isFavorite };
  });
  // console.log("New Products:", newProducts);

  return (
    <div className="lg:col-span-3">
      <ProductsSortAndView page={page} productsLength={productsLength} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productsLength ? (
          newProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
            >
              <ProductCard product={product} userId={userId} />
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">
            <h1 className="text-2xl font-bold">No products found</h1>
          </div>
        )}
      </div>

      <ProductsPagination
        page={page}
        totalPages={products.pagination.totalPages}
        category={category}
        price={price}
        q={q}
        location={location}
        organic={organic}
      />
    </div>
  );
};

export default ProductsGrid;
