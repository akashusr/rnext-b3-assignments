"use server";
import { FavoriteModel } from "@/models/FavoriteModel";
import { dbConnect } from "@/mongo";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { toActionError, ValidationError } from "@/errors";

export const addToFavorite = async (productId, userId) => {
  try {
    await dbConnect();
    if (!productId) throw new ValidationError("productId required");
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const favorite = await FavoriteModel.findOne({ user: userObjectId });
    let created = false;
    if (!favorite) {
      const newFavorite = new FavoriteModel({
        user: userId,
        products: [productId],
      });
      await newFavorite.save();
      created = true;
    } else if (!favorite.products.includes(productId)) {
      favorite.products.push(productId);
      await favorite.save();
    }
    try {
      revalidatePath("/");
      revalidatePath("/products");
      revalidatePath(`/products/${productId}`);
    } catch {}
    return { ok: true, data: { productId, created } };
  } catch (error) {
    console.error("Error adding to favorite:", error);
    return toActionError(error);
  }
};

export const removeFromFavorite = async (productId, userId) => {
  try {
    await dbConnect();
    if (!productId) throw new ValidationError("productId required");
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const favorite = await FavoriteModel.findOne({ user: userObjectId });
    if (!favorite) return { ok: true, data: { productId, removed: false } };
    const before = favorite.products.length;
    favorite.products = favorite.products.filter(
      (id) => id.toString() !== productId
    );
    const removed = favorite.products.length !== before;
    if (removed) {
      await favorite.save();
      try {
        revalidatePath("/");
        revalidatePath("/products");
        revalidatePath(`/products/${productId}`);
      } catch {}
    }
    return { ok: true, data: { productId, removed } };
  } catch (error) {
    console.error("Error removing from favorite:", error);
    return toActionError(error);
  }
};

export const getFavorite = async (userId) => {
  try {
    await dbConnect();
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const favorite = await FavoriteModel.findOne({ user: userObjectId });
    return favorite
      ? {
          user: favorite.user.toString(),
          products: favorite.products.map((id) => id.toString()),
        }
      : null;
  } catch (error) {
    console.error("Error getting favorite:", error);
    return null;
  }
};
