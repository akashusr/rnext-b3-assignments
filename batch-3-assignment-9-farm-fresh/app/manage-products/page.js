import FilterNSearch from "@/components/manage-products/FilterNSearch";
import ManageBreadcrumb from "@/components/manage-products/ManageBreadcrumb";
import ManageProducts from "@/components/manage-products/ManageProducts";
import ManageProductsHero from "@/components/manage-products/ManageProductsHero";
import ManageProductsPagination from "@/components/manage-products/ManageProductsPagination";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import { getProductsByOwner } from "@/actions/productsAction";

const ManageProductsPage = async ({ searchParams }) => {
  // Server-side guard: only allow authenticated farmers
  const session = await auth();
  if (!session) {
    redirect(`/login?callbackUrl=${encodeURIComponent("/manage-products")}`);
  }

  const role = session?.user?.role;
  if (role !== "farmer") {
    // Non-farmers are redirected to home (or show 403 page if available)
    redirect("/");
  }

  const userId = session?.user?.id;

  // parse search params

  const page = Number(searchParams?.page ?? 1) || 1;
  const sort = searchParams?.sort;
  const q = searchParams?.q;
  const category = searchParams?.category;
  const status = searchParams?.status;

  // fetch products for this owner via server action
  let { products, pagination } = await getProductsByOwner(userId, {
    page,
    sort,
    q,
    category,
  });

  // Filter by status on the client side (since status is not a DB field)
  if (status) {
    products = products.filter((p) => {
      if (status === "active") return p.product_stock > 5;
      if (status === "inactive")
        return p.product_stock > 0 && p.product_stock <= 5;
      if (status === "out-of-stock") return p.product_stock <= 0;
      return true;
    });
    // Optionally update pagination.totalProducts
    pagination = { ...pagination, totalProducts: products.length };
  }

  return (
    <>
      <ManageBreadcrumb />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ManageProductsHero />
        <FilterNSearch />
        <ManageProducts products={products} />
        <ManageProductsPagination pagination={pagination} />
      </div>
    </>
  );
};

export default ManageProductsPage;
