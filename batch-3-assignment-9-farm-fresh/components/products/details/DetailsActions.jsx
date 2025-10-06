import { addToCart, removeFromCart } from "@/actions/cartAction";
import { addToFavorite, removeFromFavorite } from "@/actions/favoriteAction";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartProvider";
import { useFavorite } from "@/context/FavoriteProvider";
import {
  faBolt,
  faHeart,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

const DetailsActions = ({ product, quantity, session }) => {
  const { addToCartContext, removeFromCartContext } = useCart();
  const { addToFav, removeFromFav } = useFavorite();
  const router = useRouter();

  const [inCart, setInCart] = useState(product.isInCart);
  const [isFavorite, setIsFavorite] = useState(product.isFavorite);
  const [isBuying, setIsBuying] = useState(false);
  const handleBuyNow = () => {
    const goToPayment = async () => {
      if (!session?.user?.id) {
        router.push("/login");
        return;
      }
      // Prevent buying own product
      if (String(product.owner_id) === String(session.user.id)) {
        alert("You cannot buy your own product.");
        return;
      }
      // Basic validation
      if (!quantity || quantity <= 0) return;
      if (quantity > product.product_stock) {
        alert("Requested quantity exceeds available stock.");
        return;
      }
      try {
        setIsBuying(true);
        const params = new URLSearchParams({
          productId: String(product.id),
          qty: String(quantity),
          from: "details",
        });
        router.push(`/payment?${params.toString()}`);
      } finally {
        setIsBuying(false);
      }
    };
    goToPayment();
  };
  const handleAddToCart = () => {
    const addingtoCart = async () => {
      if (!session?.user?.id) {
        router.push("/login");
        return;
      }
      if (!inCart) {
        await addToCart(product.id, session.user.id);
        addToCartContext(product.id);
      } else {
        await removeFromCart(product.id, session.user.id);
        removeFromCartContext(product.id);
      }
      setInCart(!inCart);
    };
    addingtoCart();
  };
  const handleAddToFavorite = () => {
    const addingToFavorite = async () => {
      if (!session?.user?.id) {
        router.push("/login");
        return;
      }
      if (isFavorite) {
        await removeFromFavorite(product.id, session.user.id);
        removeFromFav(product.id);
      } else {
        await addToFavorite(product.id, session.user.id);
        addToFav(product.id);
      }
      setIsFavorite(!isFavorite);
    };
    addingToFavorite();
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleBuyNow}
        disabled={isBuying}
        className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed dark:bg-primary-700 dark:hover:bg-primary-800 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
      >
        <FontAwesomeIcon icon={faBolt} className="mr-2" />
        {isBuying ? "Processing..." : "Buy Now"}
      </button>
      <button
        onClick={handleAddToCart}
        className={`w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-3 px-6 rounded-lg font-medium transition ${
          inCart ? "opacity-50" : ""
        }`}
      >
        <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
        {inCart ? "Remove from Cart" : "Add to Cart"}
      </button>
      <button
        onClick={handleAddToFavorite}
        className={`w-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white py-3 px-6 rounded-lg font-medium transition ${
          isFavorite ? "opacity-50" : ""
        }`}
      >
        <FontAwesomeIcon icon={faHeart} className="mr-2" />
        {isFavorite ? "Remove from Favorite" : "Add to Favorite"}
      </button>
    </div>
  );
};

export default DetailsActions;
