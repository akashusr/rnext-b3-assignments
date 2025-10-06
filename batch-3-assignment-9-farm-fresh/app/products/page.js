import { auth } from "@/auth";
import ProductsFilter from "@/components/products/filter/ProductsFilter";
import ProductsGrid from "@/components/products/ProductsGrid";
import ProductsHeader from "@/components/products/ProductsHeader";
import React from "react";
import { getCategoryCounts } from "@/lib/getCategoryCounts";

const ProductsPage = async ({
  searchParams: { category, page, q, price, location, organic, view, sort },
}) => {
  const session = await auth();
  // Pre-compute category counts excluding current category filter so user sees full distribution
  const counts = await getCategoryCounts({ q, price, location, organic });

  return (
    <>
      <ProductsHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <ProductsFilter
            category={category}
            price={price}
            q={q}
            page={page}
            location={location}
            organic={organic}
            categoryCounts={counts}
          />
          <ProductsGrid
            category={category}
            page={page}
            q={q}
            price={price}
            location={location}
            organic={organic}
            view={view}
            sort={sort}
          />
        </div>
      </div>
    </>
  );
};

export default ProductsPage;
