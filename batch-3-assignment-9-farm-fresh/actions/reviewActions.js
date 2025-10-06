"use server";

import mongoose from "mongoose";
import { dbConnect } from "@/mongo";
import { ReviewModel } from "@/models/ReviewModel";
import { BookingModel } from "@/models/BookingModel";
import {
  ValidationError,
  ForbiddenError,
  NotFoundError,
  toActionError,
} from "@/errors";

const asObjectId = (value, field = "id") => {
  if (!value) throw new ValidationError(`${field} is required`);
  if (value instanceof mongoose.Types.ObjectId) return value;
  if (typeof value === "object" && value._id)
    return asObjectId(value._id, field);
  if (typeof value === "string") {
    if (!mongoose.Types.ObjectId.isValid(value))
      throw new ValidationError(`Invalid ${field}`);
    return new mongoose.Types.ObjectId(value);
  }
  throw new ValidationError(`Invalid ${field}`);
};

// Ensure user has a delivered booking for this product
export async function canUserReviewProduct({ userId, productId }) {
  const booking = await BookingModel.findOne({
    buyer: asObjectId(userId, "userId"),
    product: asObjectId(productId, "productId"),
    status: "delivered",
  }).lean();
  return Boolean(booking);
}

export async function upsertReview({ userId, productId, rating, comment }) {
  try {
    await dbConnect();
    if (!(await canUserReviewProduct({ userId, productId }))) {
      throw new ForbiddenError(
        "You can only review products you've received (delivered)."
      );
    }
    const doc = await ReviewModel.findOneAndUpdate(
      {
        product: asObjectId(productId, "productId"),
        user: asObjectId(userId, "userId"),
      },
      { $set: { rating: Number(rating), comment: comment?.trim() ?? "" } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return { ok: true, data: serialize(doc) };
  } catch (error) {
    console.error("upsertReview failed", error);
    return toActionError(error);
  }
}

export async function deleteReview({ userId, productId }) {
  try {
    await dbConnect();
    const res = await ReviewModel.findOneAndDelete({
      product: asObjectId(productId, "productId"),
      user: asObjectId(userId, "userId"),
    });
    if (!res) throw new NotFoundError("Review not found");
    return { ok: true, data: { deleted: true } };
  } catch (error) {
    console.error("deleteReview failed", error);
    return toActionError(error);
  }
}

export async function getProductReviews(
  productId,
  { page = 1, limit = 10 } = {}
) {
  await dbConnect();
  const safePage = Math.max(1, Number(page) || 1);
  const pageSize = Math.max(1, Math.min(50, Number(limit) || 10));
  const skip = (safePage - 1) * pageSize;

  const [items, total] = await Promise.all([
    ReviewModel.find({ product: asObjectId(productId, "productId") })
      .populate("user", "name image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean(),
    ReviewModel.countDocuments({ product: asObjectId(productId, "productId") }),
  ]);

  return {
    items: items.map(serialize),
    total,
    page: safePage,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getProductReviewStats(productId) {
  await dbConnect();
  const pid = asObjectId(productId, "productId");
  const [res] = await ReviewModel.aggregate([
    { $match: { product: pid } },
    {
      $group: {
        _id: "$product",
        count: { $sum: 1 },
        avg: { $avg: "$rating" },
        r1: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
        r2: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
        r3: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
        r4: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
        r5: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
      },
    },
  ]);
  const count = res?.count || 0;
  const avg = res?.avg ? Number(res.avg.toFixed(1)) : 0;
  const breakdown = {
    5: res?.r5 || 0,
    4: res?.r4 || 0,
    3: res?.r3 || 0,
    2: res?.r2 || 0,
    1: res?.r1 || 0,
  };
  return { count, avg, breakdown };
}

export async function getUserReviewForProduct({ userId, productId }) {
  await dbConnect();
  const doc = await ReviewModel.findOne({
    product: asObjectId(productId, "productId"),
    user: asObjectId(userId, "userId"),
  })
    .populate("user", "name image")
    .lean();
  return doc ? serialize(doc) : null;
}

function serialize(doc) {
  if (!doc) return null;
  const d = doc._id ? doc : { ...doc, _id: doc._id };
  return {
    id: String(d._id),
    product: String(d.product),
    user:
      typeof d.user === "object" && d.user?._id
        ? {
            id: String(d.user._id),
            name: d.user.name || "",
            image: d.user.image || "",
          }
        : String(d.user),
    rating: Number(d.rating),
    comment: d.comment || "",
    createdAt: new Date(d.createdAt).toISOString(),
    updatedAt: new Date(d.updatedAt).toISOString(),
  };
}
