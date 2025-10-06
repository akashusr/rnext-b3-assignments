"use server";

import { dbConnect } from "@/mongo";
import { ProductModel } from "@/models/productModel";

export const getProductsByIds = async (ids = []) => {
  if (!Array.isArray(ids) || ids.length === 0) return [];
  await dbConnect();
  const products = await ProductModel.find({ _id: { $in: ids } });
  return products.map((p) => ({
    ...p._doc,
    _id: p._id.toString(),
    id: p._id.toString(),
    owner_id: p._doc.owner_id?.toString?.() ?? String(p._doc.owner_id),
    createdAt: p._doc.createdAt?.toISOString?.() ?? null,
    updatedAt: p._doc.updatedAt?.toISOString?.() ?? null,
  }));
};
