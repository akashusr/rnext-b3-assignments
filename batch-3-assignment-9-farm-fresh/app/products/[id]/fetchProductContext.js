import { cache } from "react";
import { getProductById } from "@/actions/productsAction";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getFavorite } from "@/actions/favoriteAction";
import { getCart } from "@/actions/cartAction";
import { getUserPublicProfile } from "@/actions/usersAction";
import {
  getProductReviews,
  getUserReviewForProduct,
  canUserReviewProduct,
  getProductReviewStats,
} from "@/actions/reviewActions";

// Memoized loader so all parallel slots share the same fetch work per request
export const getProductContext = cache(async (id) => {
  let product;
  try {
    product = await getProductById(id);
  } catch (e) {
    // Distinguish not found vs other errors based on message
    if (e?.message?.toLowerCase().includes("not found")) {
      return notFound();
    }
    throw e; // bubble to route error boundary
  }
  // If the action returned null/undefined without throwing, still treat as 404
  if (!product) {
    return notFound();
  }
  const session = await auth();
  const owner = await getUserPublicProfile(product.owner_id);

  const [reviewsPaged, reviewStats, myReview, canReview] = await Promise.all([
    getProductReviews(id, { page: 1, limit: 5 }),
    getProductReviewStats(id),
    session?.user?.id
      ? getUserReviewForProduct({ userId: session.user.id, productId: id })
      : Promise.resolve(null),
    session?.user?.id
      ? canUserReviewProduct({ userId: session.user.id, productId: id })
      : Promise.resolve(false),
  ]);

  if (session?.user?.id) {
    try {
      const [favlist, cartList] = await Promise.all([
        getFavorite(session.user.id),
        getCart(session.user.id),
      ]);

      product.isFavorite = Boolean(favlist?.products?.includes?.(product.id));
      product.isInCart = Boolean(cartList?.products?.includes?.(product.id));
    } catch (e) {
      product.isFavorite = false;
      product.isInCart = false;
    }
  } else {
    product.isFavorite = false;
    product.isInCart = false;
  }

  return {
    product,
    session,
    owner,
    reviewsPaged,
    reviewStats,
    myReview,
    canReview,
  };
});
