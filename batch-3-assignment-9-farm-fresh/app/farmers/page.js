import FarmerGrid from "@/components/farmer/FarmerGrid";
import FarmerHeader from "@/components/farmer/FarmerHeader";
import JoinAsAFarmer from "@/components/farmer/JoinAsAFarmer";
import React from "react";
import { getFarmers } from "@/actions/farmersAction";

export const revalidate = 60; // ISR: refresh every 60s
const FarmerPage = async () => {
  const { farmers, total } = await getFarmers({ page: 1, limit: 12 });
  // Basic derived stats (districts & organic percent placeholder)
  const districts = new Set(
    farmers
      .map((f) => f.address)
      .filter(Boolean)
      .map((a) => a.split(",")[0]?.trim())
  ).size;
  const productsTotal = farmers.reduce((acc, f) => acc + f.productCount, 0);
  return (
    <>
      <FarmerHeader />
      <FarmerGrid
        farmers={farmers}
        stats={{ total, districts, products: productsTotal, organicPercent: 0 }}
        showLoadMore={false}
      />
      <JoinAsAFarmer />
    </>
  );
};

export default FarmerPage;
