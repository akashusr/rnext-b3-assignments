import {
  faEdit,
  faEye,
  faEyeSlash,
  faHeart,
  faStar,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { deleteProduct, togglePublishProduct } from "@/actions/productsAction";

const ManageProducts = ({ products = [] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.length === 0 && (
        <div className="col-span-full text-center text-gray-600 dark:text-gray-300 py-10">
          You haven&apos;t added any products yet.
        </div>
      )}
      {products.map((p) => {
        const status =
          p.product_stock <= 0
            ? "Out of Stock"
            : p.product_stock <= 5
            ? "Low Stock"
            : "Active";
        const statusColor =
          p.product_stock <= 0
            ? "bg-red-500"
            : p.product_stock <= 5
            ? "bg-yellow-500"
            : "bg-green-500";
        return (
          <div
            key={p.id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="relative">
              <Link href={`/products/${p.id}`}>
                <Image
                  src={p.product_image}
                  alt={p.product_name}
                  className="w-full h-48 object-cover hover:opacity-90 transition"
                  width={400}
                  height={200}
                />
              </Link>
              <div className="absolute top-3 left-3">
                <span
                  className={`${statusColor} text-white px-2 py-1 rounded-full text-xs font-medium`}
                >
                  {status}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <button
                  className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  aria-label="favorite"
                >
                  <FontAwesomeIcon
                    icon={faHeart}
                    className="text-gray-600 dark:text-gray-400"
                  />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Link
                  href={`/products/${p.id}`}
                  className="font-semibold text-gray-900 dark:text-white hover:underline"
                >
                  {p.product_name}
                </Link>
                <div className="flex items-center text-yellow-400">
                  <FontAwesomeIcon icon={faStar} className="text-sm" />
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                    0.0
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {p.organic ? "Organic" : "Conventional"} • {p.category}
              </p>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    ৳{p.product_price_per_kg}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {" "}
                    /kg
                  </span>
                </div>
                <span
                  className={`text-sm ${
                    p.product_stock <= 0
                      ? "text-red-500"
                      : p.product_stock <= 5
                      ? "text-yellow-600"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  Stock: {p.product_stock}kg
                </span>
              </div>
              <div className="flex space-x-2">
                <Link
                  href={`/manage-products/${p.id}`}
                  className="flex-1 text-center bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition text-sm"
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-1" />
                  Edit
                </Link>
                <form action={togglePublishProduct} className="flex-1">
                  <input type="hidden" name="id" value={p.id} />
                  <button
                    type="submit"
                    className={`w-full px-4 py-2 border  rounded-lg transition inline-flex items-center justify-center ${
                      p.publish
                        ? "border-green-300 text-green-600 hover:bg-green-50 dark:hover:bg-green-900"
                        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                    aria-label={
                      p.publish ? "Unpublish product" : "Publish product"
                    }
                    title={
                      p.publish
                        ? "Click to unpublish (hide)"
                        : "Click to publish (show)"
                    }
                  >
                    <FontAwesomeIcon icon={p.publish ? faEye : faEyeSlash} />
                  </button>
                </form>
                <form action={deleteProduct}>
                  <input type="hidden" name="id" value={p.id} />
                  <button
                    type="submit"
                    className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition"
                    aria-label="Delete product"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ManageProducts;
