import AddProductBreadCrumb from "@/components/add-product/AddProductBreadCrumb";
import AddProductForm from "@/components/add-product/AddProductForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

const AddProduct = async () => {
  const session = await auth();
  if (!session) {
    redirect(`/login?callbackUrl=${encodeURIComponent("/add-product")}`);
  }

  const role = session?.user?.role;
  if (role !== "farmer") {
    redirect("/");
  }

  return (
    <>
      <AddProductBreadCrumb />
      <AddProductForm initialProduct={null} />
    </>
  );
};

export default AddProduct;
