"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faUser,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { signOut } from "next-auth/react";
import Image from "next/image";

const NavbarMobile = ({ session }) => {
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href) => {
    if (!href) return false;
    const clean = (p) => (p || "").split("?")[0];
    const current = clean(path);
    const target = clean(href);
    return current === target || current.startsWith(target + "/");
  };

  const isLoggedIn = Boolean(session?.user);
  const role = session?.user?.role;

  // Build menu based on role (updated per requirement)
  // Farmer: products, add-product, manage-products, orders, manage-orders + favorites, cart, about, farmers
  // Customer: products, orders + favorites, cart, about, farmers
  let links = [];
  if (!isLoggedIn) {
    links = [
      { href: "/products?page=1", label: "Products" },
      { href: "/farmers", label: "Farmers" },
      { href: "/about", label: "About" },
    ];
  } else if (role === "farmer") {
    links = [
      { href: "/products?page=1", label: "Products" },
      { href: "/add-product", label: "Add Product" },
      { href: "/manage-products?page=1", label: "Manage Products" },
      { href: "/orders?page=1", label: "Orders" }, // farmer's own purchase orders
      { href: "/manage-orders", label: "Manage Orders" }, // orders for their products
      // { href: "/favorites", label: "Favorites" },
      // { href: "/cart", label: "Cart" },
      { href: "/farmers", label: "Farmers" },
      { href: "/about", label: "About" },
    ];
  } else {
    links = [
      { href: "/products?page=1", label: "Products" },
      { href: "/orders?page=1", label: "Orders" },
      // { href: "/favorites", label: "Favorites" },
      // { href: "/cart", label: "Cart" },
      { href: "/farmers", label: "Farmers" },
      { href: "/about", label: "About" },
    ];
  }

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [path]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest(".mobile-menu")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="md:hidden mobile-menu">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
        aria-label="Toggle mobile menu"
      >
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="text-xl" />
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="fixed top-16 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg z-50 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="px-4 py-6 space-y-4">
              {/* User info for logged in users */}
              {isLoggedIn && (
                <div className="flex items-center space-x-3 pb-4 border-b border-gray-200 dark:border-gray-700">
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
                      alt="Default Farmer"
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
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {session.user.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {session.user.role || "customer"}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="space-y-2">
                {links.map(({ href, label }) => {
                  const classes = isActive(href)
                    ? "block px-3 py-2 text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/20 rounded-md"
                    : "block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md";

                  return (
                    <Link key={href} href={href} className={classes}>
                      {label}
                    </Link>
                  );
                })}
              </nav>

              {/* User Actions */}
              {isLoggedIn ? (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <Link
                    href="/profile"
                    className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  >
                    <FontAwesomeIcon icon={faUser} className="mr-3" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      signOut();
                    }}
                    className="w-full flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <Link
                    href="/login"
                    className="block w-full text-center bg-green-800 text-white px-4 py-3 rounded-md font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block w-full text-center border border-green-800 text-green-800 px-4 py-3 rounded-md font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NavbarMobile;
