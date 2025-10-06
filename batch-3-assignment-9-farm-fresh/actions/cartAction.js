"use server";
import { CartModel } from "@/models/CartModel";
import { dbConnect } from "@/mongo";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { toActionError, ValidationError } from "@/errors";

export const addToCart = async (productId, userId) => {
  try {
    await dbConnect();
    if (!productId) throw new ValidationError("productId required");
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const cart = await CartModel.findOne({ user: userObjectId });
    let created = false;
    if (!cart) {
      const newCart = new CartModel({ user: userId, products: [productId] });
      await newCart.save();
      created = true;
    } else if (!cart.products.includes(productId)) {
      cart.products.push(productId);
      await cart.save();
    }
    try {
      revalidatePath("/");
      revalidatePath("/products");
      revalidatePath(`/products/${productId}`);
    } catch {}
    return { ok: true, data: { productId, created } };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return toActionError(error);
  }
};

export const removeFromCart = async (productId, userId) => {
  try {
    await dbConnect();
    if (!productId) throw new ValidationError("productId required");
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const cart = await CartModel.findOne({ user: userObjectId });
    if (!cart) return { ok: true, data: { productId, removed: false } };
    const before = cart.products.length;
    cart.products = cart.products.filter((id) => id.toString() !== productId);
    const removed = cart.products.length !== before;
    if (removed) {
      await cart.save();
      try {
        revalidatePath("/");
        revalidatePath("/products");
        revalidatePath(`/products/${productId}`);
      } catch {}
    }
    return { ok: true, data: { productId, removed } };
  } catch (error) {
    console.error("Error removing from cart:", error);
    return toActionError(error);
  }
};

export const getCart = async (userId) => {
  try {
    await dbConnect();
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const cart = await CartModel.findOne({ user: userObjectId });
    return cart
      ? {
          user: cart.user.toString(),
          products: cart.products.map((id) => id.toString()),
        }
      : null; // read action: return null instead of throwing
  } catch (error) {
    console.error("Error getting cart:", error);
    return null;
  }
};
