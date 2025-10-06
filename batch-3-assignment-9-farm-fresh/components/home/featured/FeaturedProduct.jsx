import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { getFeaturedProducts } from "@/actions/productsAction";
import ProductCard from "@/components/products/ProductCard";
import { auth } from "@/auth";

const FeaturedProduct = async () => {
  const session = await auth();
  const featured = await getFeaturedProducts(session?.user?.id);

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Featured Products
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Fresh picks from our local farmers
            </p>
          </div>
          <Link
            href="/products?page=1"
            className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300"
          >
            View All <FontAwesomeIcon icon={faArrowRight} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured?.length ? (
            featured.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
                {/* ProductCard internally handles navigation with its own Links */}
                <ProductCard product={product} userId={session?.user?.id} />
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">
              No featured products
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProduct;
