import React from "react";
import { getProductContext } from "../fetchProductContext";
import FarmerContacts from "@/components/products/details/FarmerContacts";

export default async function ContactSlot({ params: { id } }) {
  const { owner } = await getProductContext(id);
  return (
    <FarmerContacts
      name={owner?.name || "Unknown"}
      image={owner?.image || undefined}
      since={undefined}
      farmName={owner?.farmDetails?.farmName || "Not available"}
    />
  );
}
