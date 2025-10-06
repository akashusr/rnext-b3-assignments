"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavbarDesktop = ({ session }) => {
  const path = usePathname();

  const isActive = (href) => {
    // consider queryless path equality and startsWith for nested routes
    if (!href) return false;
    const clean = (p) => (p || "").split("?")[0];
    const current = clean(path);
    const target = clean(href);
    return current === target || current.startsWith(target + "/");
  };

  const isLoggedIn = Boolean(session?.user);
  const role = session?.user?.role; // 'farmer', 'customer', or 'admin'

  // Build menu based on role (updated per requirement)
  // Farmer: products, add-product, manage-products, orders, manage-orders + common favorites, cart, about, farmers
  // Customer: products, orders + common favorites, cart, about, farmers
  let links = [];
  if (!isLoggedIn) {
    // Keep guest minimal (can adjust if needed)
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
    // Customer
    links = [
      { href: "/products?page=1", label: "Products" },
      { href: "/orders?page=1", label: "Orders" },
      // { href: "/favorites", label: "Favorites" },
      // { href: "/cart", label: "Cart" },
      { href: "/farmers", label: "Farmers" },
      { href: "/about", label: "About" },
    ];
  }

  return (
    <div className="hidden md:flex items-center gap-6">
      {links.map(({ href, label }) => {
        const classes = isActive(href)
          ? "text-green-600 dark:text-green-400 font-medium whitespace-nowrap"
          : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition whitespace-nowrap";

        return (
          <Link key={href} href={href} className={classes} prefetch={false}>
            {label}
          </Link>
        );
      })}
    </div>
  );
};

export default NavbarDesktop;
