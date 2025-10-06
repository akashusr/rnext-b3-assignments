"use client";
import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faChevronDown,
  faMoon,
  faSun,
  faBars,
  faHeart,
  faUser,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Search from "./Search";
import { useCart } from "@/context/CartProvider";
import { useFavorite } from "@/context/FavoriteProvider";
import { getProductsByIds } from "@/actions/bulkProductsAction";
import { removeFromCart } from "@/actions/cartAction";
import { removeFromFavorite } from "@/actions/favoriteAction";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useTheme } from "@/components/theme/ThemeProvider";

const NavbarActions = ({ session }) => {
  // console.log("Session:", session);

  const pathName = usePathname();
  const router = useRouter();
  const { cart, removeFromCartContext } = useCart();
  const { favorites, removeFromFav, addToFav } = useFavorite();

  const [showCartList, setShowCartList] = useState(false);
  const [showFavList, setShowFavList] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [cartItems, setCartItems] = useState([]); // detailed products
  const [favItems, setFavItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);

  // Lazy load details when dropdown toggled open
  useEffect(() => {
    const load = async () => {
      if (showCartList) {
        try {
          setLoadingCart(true);
          const prods = await getProductsByIds(cart);
          setCartItems(prods);
        } finally {
          setLoadingCart(false);
        }
      }
    };
    load();
  }, [showCartList, cart]);

  useEffect(() => {
    const load = async () => {
      if (showFavList) {
        try {
          setLoadingFav(true);
          const prods = await getProductsByIds(favorites);
          setFavItems(prods);
        } finally {
          setLoadingFav(false);
        }
      }
    };
    load();
  }, [showFavList, favorites]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".navbar-dropdown")) {
        setShowCartList(false);
        setShowFavList(false);
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRemoveFromCart = async (id) => {
    if (!session?.user?.id) return;
    removeFromCartContext(id); // optimistic
    setCartItems((prev) => prev.filter((p) => p.id !== id));
    try {
      await removeFromCart(id, session.user.id);
    } catch (e) {
      // revert on failure (simple approach: reload list)
      try {
        const prods = await getProductsByIds(cart);
        setCartItems(prods);
      } catch {}
    }
  };

  const handleRemoveFromFav = async (id) => {
    if (!session?.user?.id) return;
    removeFromFav(id); // optimistic
    setFavItems((prev) => prev.filter((p) => p.id !== id));
    try {
      await removeFromFavorite(id, session.user.id);
    } catch (e) {
      // best-effort revert
      try {
        const prods = await getProductsByIds(favorites);
        setFavItems(prods);
      } catch {}
    }
  };

  const goToPaymentCart = () => {
    router.push("/payment?from=cart");
    setShowCartList(false);
  };

  const handleFavAddToCart = (id) => {
    // Reuse addToFav not needed here; just push to cart via existing product UI; minimal for nav - route to product page
    router.push(`/products/${id}`);
    setShowFavList(false);
  };

  const handleFavBuyNow = (id) => {
    router.push(`/payment?productId=${id}&qty=1&from=favorites`);
    setShowFavList(false);
  };

  // Build callbackUrl for auth links (stay on same page after login unless already on auth pages)
  const callbackUrl = useMemo(() => {
    if (!pathName) return "/";
    if (
      ["/login", "/register", "/forget-password", "/reset-password"].includes(
        pathName
      )
    )
      return "/"; // avoid loops
    return (
      pathName + (typeof window !== "undefined" ? window.location.search : "")
    );
  }, [pathName]);

  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center space-x-4">
      {/* <!-- Search --> */}
      {pathName !== "/login" && pathName !== "/register" && (
        <>
          <Search />

          {session && session.user ? (
            <>
              {/* Favorites button - Show for all logged in users */}
              <div className="relative navbar-dropdown">
                <button
                  onClick={() => {
                    setShowFavList((p) => !p);
                    setShowCartList(false);
                    setShowUserDropdown(false);
                  }}
                  className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                  aria-label="favorites"
                >
                  <FontAwesomeIcon icon={faHeart} className="text-xl" />
                  {favorites?.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {favorites.length}
                    </span>
                  )}
                </button>
                {showFavList && (
                  <div className="absolute right-0 mt-2 w-72 max-h-96 overflow-auto bg-white dark:bg-gray-800 shadow-xl rounded-lg p-3 z-50 border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-sm">Favorites</h4>
                      <button
                        onClick={() => router.push("/favorites")}
                        className="text-xs text-primary-600 hover:underline"
                      >
                        View All
                      </button>
                    </div>
                    {loadingFav ? (
                      <div className="text-xs text-gray-500">Loading...</div>
                    ) : favItems.length === 0 ? (
                      <div className="text-xs text-gray-500">
                        No favorites yet.
                      </div>
                    ) : (
                      favItems.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center gap-2 py-2 border-b last:border-b-0 border-gray-100 dark:border-gray-700"
                        >
                          <Image
                            src={p.product_image || "/user.png"}
                            alt={p.product_name}
                            className="w-10 h-10 rounded object-cover"
                            width={40}
                            height={40}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium truncate">
                              {p.product_name}
                            </div>
                            <div className="text-[10px] text-gray-500">
                              ৳{p.product_price_per_kg}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => handleFavBuyNow(p.id)}
                              className="text-[10px] bg-primary-600 text-white px-2 py-1 rounded"
                            >
                              Buy
                            </button>
                            <button
                              onClick={() => handleFavAddToCart(p.id)}
                              className="text-[10px] border px-2 py-1 rounded"
                            >
                              Cart
                            </button>
                            <button
                              onClick={() => handleRemoveFromFav(p.id)}
                              className="text-[10px] text-red-600 hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Cart button - Show for all logged in users */}
              <div className="relative navbar-dropdown">
                <button
                  onClick={() => {
                    setShowCartList((p) => !p);
                    setShowFavList(false);
                    setShowUserDropdown(false);
                  }}
                  className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                  aria-label="cart"
                >
                  <FontAwesomeIcon icon={faShoppingCart} className="text-xl" />
                  {cart?.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </button>
                {showCartList && (
                  <div className="absolute right-0 mt-2 w-72 max-h-96 overflow-auto bg-white dark:bg-gray-800 shadow-xl rounded-lg p-3 z-50 border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-sm">Cart</h4>
                      <button
                        onClick={() => router.push("/cart")}
                        className="text-xs text-primary-600 hover:underline"
                      >
                        View All
                      </button>
                    </div>
                    {loadingCart ? (
                      <div className="text-xs text-gray-500">Loading...</div>
                    ) : cartItems.length === 0 ? (
                      <div className="text-xs text-gray-500">
                        Cart is empty.
                      </div>
                    ) : (
                      <>
                        {cartItems.map((p) => (
                          <div
                            key={p.id}
                            className="flex items-center gap-2 py-2 border-b last:border-b-0 border-gray-100 dark:border-gray-700"
                          >
                            <Image
                              src={p.product_image || "/user.png"}
                              alt={p.product_name}
                              className="w-10 h-10 rounded object-cover"
                              width={40}
                              height={40}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium truncate">
                                {p.product_name}
                              </div>
                              <div className="text-[10px] text-gray-500">
                                ৳{p.product_price_per_kg}
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveFromCart(p.id)}
                              className="text-[10px] text-red-600 hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={goToPaymentCart}
                          className="mt-2 w-full bg-primary-600 text-white text-xs py-2 rounded"
                        >
                          Buy All
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div className="relative navbar-dropdown">
                <button
                  onClick={() => {
                    setShowUserDropdown((p) => !p);
                    setShowCartList(false);
                    setShowFavList(false);
                  }}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {session?.user.image ? (
                    <Image
                      src={session.user.image}
                      alt="User"
                      height={40}
                      width={40}
                      className="rounded-full"
                    />
                  ) : session.user.role === "farmer" ? (
                    <Image
                      src="/chinese.png"
                      alt="Default User"
                      height={40}
                      width={40}
                      className="rounded-full"
                    />
                  ) : (
                    <Image
                      src="/user.png"
                      alt="Default User"
                      height={40}
                      width={40}
                      className="rounded-full"
                    />
                  )}
                  <span className="hidden text-sm sm:block">
                    {session.user.name}
                  </span>
                  <FontAwesomeIcon icon={faChevronDown} className="text-sm" />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-xl rounded-lg py-2 z-50 border border-gray-200 dark:border-gray-700">
                    <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 capitalize">
                      {session.user.role || "customer"}
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FontAwesomeIcon icon={faUser} className="mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        signOut();
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Link
                href={{ pathname: "/login", query: { callbackUrl } }}
                className="bg-green-800 text-white px-4 py-2 rounded"
              >
                Login
              </Link>
              <Link
                href={{ pathname: "/register", query: { callbackUrl } }}
                className="border border-green-800 text-green-800 px-4 py-2 rounded"
              >
                Signup
              </Link>
            </div>
          )}
        </>
      )}

      {/* <!-- Dark Mode Toggle --> */}
      <button
        id="darkToggle"
        aria-label="Toggle dark mode"
        onClick={toggleTheme}
        className="p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        <FontAwesomeIcon icon={faMoon} className="dark:hidden" />
        <FontAwesomeIcon icon={faSun} className="hidden dark:block" />
      </button>
    </div>
  );
};

export default NavbarActions;
