"use server";

import { dbConnect } from "@/mongo";
import { User } from "@/models/UserModel";
import { ProductModel } from "@/models/productModel";

/**
 * Fetch farmers with public fields and product counts.
 * @param {Object} opts
 * @param {number} [opts.page=1] 1-based page index
 * @param {number} [opts.limit=12] page size
 * @returns {Promise<{farmers: Array, page: number, limit: number, total: number, hasMore: boolean}>}
 */
export const getFarmers = async ({ page = 1, limit = 12 } = {}) => {
  try {
    await dbConnect();

    const skip = (page - 1) * limit;

    const [farmers, total] = await Promise.all([
      User.find({ role: "farmer" })
        .select(
          "firstName lastName name address image farmDetails.farmName farmDetails.specialization farmDetails.farmSize farmDetails.farmSizeUnit"
        )
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments({ role: "farmer" }),
    ]);

    const productCountsAgg = await ProductModel.aggregate([
      { $match: { publish: true } },
      { $group: { _id: "$owner_id", productCount: { $sum: 1 } } },
    ]);
    const productCountMap = productCountsAgg.reduce((acc, cur) => {
      acc[cur._id] = cur.productCount;
      return acc;
    }, {});

    const shaped = farmers.map((f) => {
      const fullName =
        f.name ||
        [f.firstName, f.lastName].filter(Boolean).join(" ") ||
        "Unnamed Farmer";
      return {
        id: f._id.toString(),
        name: fullName,
        address: f.address || null,
        image: f.image || null,
        farmDetails: f.farmDetails
          ? {
              farmName: f.farmDetails.farmName || null,
              specialization: f.farmDetails.specialization || null,
              farmSize: f.farmDetails.farmSize || null,
              farmSizeUnit: f.farmDetails.farmSizeUnit || null,
            }
          : null,
        productCount: productCountMap[f._id.toString()] || 0,
      };
    });

    return {
      farmers: shaped,
      page,
      limit,
      total,
      hasMore: skip + shaped.length < total,
    };
  } catch (e) {
    console.error("getFarmers error", e);
    return { farmers: [], page: 1, limit: 0, total: 0, hasMore: false };
  }
};

/** Fetch a single farmer's public profile (basic fields + product count) */
export const getFarmerById = async (id) => {
  try {
    await dbConnect();
    if (!id) return null;
    const f = await User.findOne({ _id: id, role: "farmer" })
      .select(
        "firstName lastName name address image farmDetails.farmName farmDetails.specialization farmDetails.farmSize farmDetails.farmSizeUnit"
      )
      .lean();
    if (!f) return null;
    const productCount = await ProductModel.countDocuments({
      owner_id: id,
      publish: true,
    });
    const fullName =
      f.name ||
      [f.firstName, f.lastName].filter(Boolean).join(" ") ||
      "Unnamed Farmer";
    return {
      id: f._id.toString(),
      name: fullName,
      address: f.address || null,
      image: f.image || null,
      farmDetails: f.farmDetails
        ? {
            farmName: f.farmDetails.farmName || null,
            specialization: f.farmDetails.specialization || null,
            farmSize: f.farmDetails.farmSize || null,
            farmSizeUnit: f.farmDetails.farmSizeUnit || null,
          }
        : null,
      productCount,
    };
  } catch (e) {
    console.error("getFarmerById error", e);
    return null;
  }
};
