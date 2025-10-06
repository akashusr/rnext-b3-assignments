import AddProductForm from "@/components/add-product/AddProductForm";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { getProductById } from "@/actions/productsAction";
import React from "react";

const EditProductPage = async ({ params }) => {
  const session = await auth();
  if (!session) {
    redirect(`/login?callbackUrl=${encodeURIComponent("/manage-products")}`);
  }
  if (session.user?.role !== "farmer") redirect("/");

  let product;
  try {
    product = await getProductById(params.id);
  } catch (e) {
    // Show 404 page if product truly not found
    if (e?.message?.toLowerCase().includes("not found")) {
      return notFound();
    }
    // Bubble other errors to route-level error boundary
    throw e;
  }
  // Handle case where action returns null/undefined without throwing
  if (!product) {
    return notFound();
  }

  // If product exists but does not belong to this user, treat as 404 to avoid leaking existence
  if (product.owner_id !== session.user.id) {
    return notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AddProductForm initialProduct={product} />
    </div>
  );
};

export default EditProductPage;
