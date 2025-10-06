import React from "react";
import { getFarmerById } from "@/actions/farmersAction";
import { getProductsByOwner } from "@/actions/productsAction";
import ProductCard from "@/components/products/ProductCard";
import Image from "next/image";
import { auth } from "@/auth";

export const revalidate = 60; // ISR

const FarmerProductsPage = async ({ params, searchParams }) => {
  const { id } = params;
  const page = parseInt(searchParams?.page) || 1;
  const view = searchParams?.view || "grid";
  const sort = searchParams?.sort;
  const q = searchParams?.q;
  const category = searchParams?.category;

  const farmer = await getFarmerById(id);
  if (!farmer) {
    return (
      <div className="max-w-5xl mx-auto py-20 px-4 text-center">
        <h1 className="text-3xl font-semibold mb-4">Farmer Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400">
          We couldn&apos;t find the farmer you are looking for.
        </p>
      </div>
    );
  }
  const session = await auth();
  const userId = session?.user?.id;

  const { products, pagination } = await getProductsByOwner(id, {
    page,
    view,
    sort,
    q,
    category,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8 mb-12 items-start">
        <div className="w-full md:w-72 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="relative h-56 w-full">
              <Image
                src={
                  farmer.image ||
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face"
                }
                alt={farmer.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <h1 className="text-2xl font-bold mb-1">{farmer.name}</h1>
              {farmer.address && (
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {farmer.address}
                </p>
              )}
              {farmer.farmDetails?.specialization && (
                <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                  Specialty: {farmer.farmDetails.specialization}
                </p>
              )}
              <div className="text-sm text-gray-500 dark:text-gray-400 flex flex-col gap-1">
                {farmer.farmDetails?.farmSize && (
                  <span>
                    Farm Size: {farmer.farmDetails.farmSize}{" "}
                    {farmer.farmDetails.farmSizeUnit || "acres"}
                  </span>
                )}
                <span>Products Listed: {farmer.productCount}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h2 className="text-3xl font-bold">Products</h2>
              {q && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Searching for: {q}
                </p>
              )}
            </div>
            {/* Future: add sort/filter controls here */}
          </div>
          {products.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-16">
              No products found{q ? " for this search." : "."}
            </div>
          ) : (
            <div
              className={
                view === "list"
                  ? "space-y-6"
                  : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              }
            >
              {products.map((p) => (
                <div
                  key={p.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group relative"
                >
                  {p.publish ? (
                    <ProductCard product={p} userId={userId} />
                  ) : (
                    <div className="flex flex-col h-full">
                      <div className="relative">
                        <Image
                          src={p.product_image}
                          alt={p.product_name}
                          width={300}
                          height={300}
                          className="w-full h-48 object-cover opacity-60"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="bg-yellow-500 text-white text-sm font-semibold px-3 py-1 rounded-full shadow">
                            Coming Soon
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2 line-clamp-1">
                            {p.product_name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            This product is not yet published.
                          </p>
                        </div>
                        <div className="mt-4 text-xs text-gray-400 dark:text-gray-500">
                          Check back soon for availability & pricing.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-12 gap-2 flex-wrap">
              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1
              ).map((pNum) => {
                const sp = new URLSearchParams({ ...searchParams });
                sp.set("page", pNum.toString());
                return (
                  <a
                    key={pNum}
                    href={`?${sp.toString()}`}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                      pNum === pagination.currentPage
                        ? "bg-primary-600 text-white border-primary-600"
                        : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                    }`}
                  >
                    {pNum}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerProductsPage;
