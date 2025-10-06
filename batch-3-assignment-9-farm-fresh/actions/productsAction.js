"use server";

import { ProductModel } from "@/models/productModel";
import { User } from "@/models/UserModel";
import mongoose from "mongoose";
import { dbConnect } from "@/mongo";
import { getFavorite } from "@/actions/favoriteAction";
import { getCart } from "@/actions/cartAction";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import {
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ValidationError,
  toActionError,
} from "@/errors";

export const getProductsSize = async () => {
  try {
    await dbConnect();
    const products = await ProductModel.find();
    return products.length; // read action: propagate error as typed
  } catch (error) {
    console.error("getProductsSize failed", error);
    throw new Error("Failed to fetch products size");
  }
};

const getActualCategory = (categories) => {
  return categories.map(
    (cat) => cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()
  );
};

const getActualLocation = (location) => {
  return location.charAt(0).toUpperCase() + location.slice(1).toLowerCase();
};

export const getProductsWithPagination = async (
  page = 1,
  view,
  sort,
  category,
  q,
  price,
  location,
  organic
) => {
  try {
    await dbConnect();

    if (page === 0 || page === "0") page = 1;

    // Determine items per page based on view mode
    const itemsPerPage = view === "list" ? 12 : 6;
    const skip = (page - 1) * itemsPerPage;

    // Build filter object
    const filter = { publish: true }; // only show published products publicly

    // Search filter (product name)
    if (q) {
      filter.product_name = { $regex: q, $options: "i" };
    }

    // Category filter (handle pipe-separated values)
    if (category) {
      const categories = getActualCategory(
        category.split("|").map(decodeURIComponent)
      );
      filter.category = { $in: categories };
    }

    // Price filter
    if (price) {
      switch (price) {
        case "under-30":
          filter.product_price_per_kg = { $lt: 30 };
          break;
        case "30-50":
          filter.product_price_per_kg = { $gte: 30, $lte: 50 };
          break;
        case "50-100":
          filter.product_price_per_kg = { $gte: 50, $lte: 100 };
          break;
        case "over-100":
          filter.product_price_per_kg = { $gt: 100 };
          break;
      }
    }

    // Organic filter
    if (organic === "true") {
      filter.organic = true;
    }

    // Build sort object
    let sortObject = { createdAt: -1 }; // Default: newest first

    if (sort) {
      switch (sort) {
        case "price-low-high":
          sortObject = { product_price_per_kg: 1 };
          break;
        case "price-high-low":
          sortObject = { product_price_per_kg: -1 };
          break;
        case "name-asc":
          sortObject = { product_name: 1 };
          break;
        case "name-desc":
          sortObject = { product_name: -1 };
          break;
        case "newest":
          sortObject = { updatedAt: -1 };
          break;
        case "oldest":
          sortObject = { updatedAt: 1 };
          break;
      }
    }

    // Handle location filter by looking up farmers in specific locations
    if (location) {
      const nLocation = getActualLocation(location);

      // Find farmers in the specified location
      const farmersInLocation = await User.find({
        role: "farmer",
        address: { $regex: nLocation, $options: "i" },
      }).select("_id");

      const farmerIds = farmersInLocation.map((farmer) =>
        farmer._id.toString()
      );

      if (farmerIds.length > 0) {
        filter.owner_id = { $in: farmerIds };
      } else {
        // No farmers found in this location, return empty results
        return {
          products: [],
          pagination: {
            currentPage: parseInt(page),
            totalPages: 0,
            itemsPerPage,
            totalProducts: 0,
          },
        };
      }
    }

    // Get products for current page with filters
    const productsDocs = await ProductModel.find(filter)
      .sort(sortObject)
      .skip(skip)
      .limit(itemsPerPage)
      .lean();

    // Fetch owner info for displayed products in one go
    const rawOwnerIds = [...new Set(productsDocs.map((p) => p.owner_id))];
    const normalizeId = (val) => {
      if (!val) return null;
      if (typeof val === "string") {
        // Already a plain 24-hex ObjectId string
        if (/^[0-9a-fA-F]{24}$/.test(val)) return val;
        // Pattern like ObjectId('...') accidentally persisted as string
        const m = val.match(/ObjectId\(['"]([0-9a-fA-F]{24})['"]\)/);
        if (m) return m[1];
        return null; // not usable
      }
      // If somehow an ObjectId instance
      if (val instanceof mongoose.Types.ObjectId) return val.toString();
      // If object with _id
      if (val?._id) return normalizeId(val._id);
      return null;
    };
    const ownerIds = rawOwnerIds
      .map(normalizeId)
      .filter((id) => id && mongoose.Types.ObjectId.isValid(id));
    let owners = [];
    if (ownerIds.length) {
      owners = await User.find({ _id: { $in: ownerIds } })
        .select(
          "_id name firstName lastName address farmDetails.farmName farmDetails.specialization"
        )
        .lean();
    }
    const ownerMap = owners.reduce((acc, o) => {
      const fullName =
        o.name || [o.firstName, o.lastName].filter(Boolean).join(" ") || null;
      acc[o._id.toString()] = {
        farmerName: fullName,
        farmName: o.farmDetails?.farmName || null,
        farmerAddress: o.address || null,
        specialization: o.farmDetails?.specialization || null,
      };
      return acc;
    }, {});

    const toIso = (d) => {
      if (!d) return null;
      try {
        return d instanceof Date ? d.toISOString() : new Date(d).toISOString();
      } catch {
        return null;
      }
    };
    const products = productsDocs.map((p) => {
      const meta = ownerMap[p.owner_id?.toString()] || {};
      return {
        ...p,
        _id: p._id.toString(),
        id: p._id.toString(),
        owner_id: p.owner_id.toString(),
        createdAt: toIso(p.createdAt),
        updatedAt: toIso(p.updatedAt),
        ...meta,
      };
    });

    // Get total count of filtered products
    const totalProducts = await ProductModel.countDocuments(filter);

    // Calculate total pages
    const totalPages = Math.ceil(totalProducts / itemsPerPage);
    let newPage = page === 0 || page === "0" ? 1 : page;

    const response = {
      products,
      pagination: {
        currentPage: newPage,
        totalPages,
        itemsPerPage,
        totalProducts,
      },
    };
    // console.log("REsponse: ", response);

    return response;
  } catch (error) {
    console.error("Error fetching products with pagination:", error);
    throw error; // allow route boundary to handle
  }
};

export const getProductById = async (id) => {
  try {
    await dbConnect();

    const product = await ProductModel.findById(id);
    if (!product) {
      throw new NotFoundError("Product not found");
    }

    return {
      ...product._doc,
      _id: product._doc._id.toString(),
      id: product._doc._id.toString(),
      owner_id: product._doc.owner_id.toString(),
      createdAt: product._doc.createdAt.toISOString(),
      updatedAt: product._doc.updatedAt.toISOString(),
    };
  } catch (error) {
    // Re-throw not found errors so callers can differentiate 404 vs generic error
    if (error instanceof NotFoundError) throw error;
    console.error("Error fetching product by ID:", error);
    throw error;
  }
};

// Get featured products: highest 'purchased' first; if none have purchases, fallback to newest. Limit 8.
export const getFeaturedProducts = async (userId) => {
  try {
    await dbConnect();

    // First try by purchase desc
    let productDocs = await ProductModel.find({ publish: true })
      .sort({ purchase: -1, createdAt: -1 })
      .limit(8)
      .lean();

    // If all purchase are zero, fallback effectively keeps newest due to tie-breaker,
    // but we also explicitly check for all zeros when we have results.
    if (
      productDocs.length > 0 &&
      productDocs.every((p) => (p.purchase ?? 0) === 0)
    ) {
      productDocs = await ProductModel.find({ publish: true })
        .sort({ createdAt: -1 })
        .limit(8)
        .lean();
    }

    // Attach isFavorite/isInCart flags if user provided
    let fav = null;
    let cart = null;
    if (userId) {
      fav = await getFavorite(userId);
      cart = await getCart(userId);
    }

    // Owner meta map
    const rawOwnerIds = [...new Set(productDocs.map((p) => p.owner_id))];
    const normalizeId = (val) => {
      if (!val) return null;
      if (typeof val === "string") {
        if (/^[0-9a-fA-F]{24}$/.test(val)) return val;
        const m = val.match(/ObjectId\(['"]([0-9a-fA-F]{24})['"]\)/);
        if (m) return m[1];
        return null;
      }
      if (val instanceof mongoose.Types.ObjectId) return val.toString();
      if (val?._id) return normalizeId(val._id);
      return null;
    };
    const ownerIds = rawOwnerIds
      .map(normalizeId)
      .filter((id) => id && mongoose.Types.ObjectId.isValid(id));
    let owners = [];
    if (ownerIds.length) {
      owners = await User.find({ _id: { $in: ownerIds } })
        .select(
          "_id name firstName lastName address farmDetails.farmName farmDetails.specialization"
        )
        .lean();
    }
    const ownerMap = owners.reduce((acc, o) => {
      const fullName =
        o.name || [o.firstName, o.lastName].filter(Boolean).join(" ") || null;
      acc[o._id.toString()] = {
        farmerName: fullName,
        farmName: o.farmDetails?.farmName || null,
        farmerAddress: o.address || null,
        specialization: o.farmDetails?.specialization || null,
      };
      return acc;
    }, {});

    const toIso = (d) => {
      if (!d) return null;
      try {
        return d instanceof Date ? d.toISOString() : new Date(d).toISOString();
      } catch {
        return null;
      }
    };

    const featured = productDocs.map((p) => {
      const base = {
        ...p,
        _id: p._id.toString(),
        id: p._id.toString(),
        owner_id: p.owner_id.toString(),
        createdAt: toIso(p.createdAt),
        updatedAt: toIso(p.updatedAt),
        ...(ownerMap[p.owner_id?.toString()] || {}),
      };
      const isFavorite = fav?.products?.includes(base.id) ?? false;
      const isInCart = cart?.products?.includes(base.id) ?? false;
      return { ...base, isFavorite, isInCart };
    });

    return featured;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    throw error;
  }
};

// Fetch products that belong to a specific owner (farmer) with pagination and optional sorting/search
export const getProductsByOwner = async (
  ownerId,
  { page = 1, view, sort, q, category } = {}
) => {
  try {
    await dbConnect();

    if (!ownerId) throw new ValidationError("Owner ID is required");

    if (page === 0 || page === "0") page = 1;

    // Determine items per page based on view mode (grid/list)
    const itemsPerPage = view === "list" ? 12 : 9;
    const skip = (page - 1) * itemsPerPage;

    // Build filter: must match owner
    const filter = { owner_id: ownerId };

    // Optional name search
    if (q) {
      filter.product_name = { $regex: q, $options: "i" };
    }

    // Optional category filter (single value from UI)
    if (category) {
      const actual =
        category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
      filter.category = actual;
    }

    // Sorting
    let sortObject = { updatedAt: -1 };
    switch (sort) {
      case "price-low-high":
        sortObject = { product_price_per_kg: 1 };
        break;
      case "price-high-low":
        sortObject = { product_price_per_kg: -1 };
        break;
      case "name-asc":
        sortObject = { product_name: 1 };
        break;
      case "name-desc":
        sortObject = { product_name: -1 };
        break;
      case "newest":
        sortObject = { createdAt: -1 };
        break;
      case "oldest":
        sortObject = { createdAt: 1 };
        break;
    }

    const productDocs = await ProductModel.find(filter)
      .sort(sortObject)
      .skip(skip)
      .limit(itemsPerPage)
      .lean();

    // Owner meta (single owner)
    const owner = await User.findById(ownerId)
      .select(
        "_id name firstName lastName address farmDetails.farmName farmDetails.specialization"
      )
      .lean();
    const meta = owner
      ? {
          farmerName:
            owner.name ||
            [owner.firstName, owner.lastName].filter(Boolean).join(" ") ||
            null,
          farmName: owner.farmDetails?.farmName || null,
          farmerAddress: owner.address || null,
          specialization: owner.farmDetails?.specialization || null,
        }
      : {};

    const toIso = (d) => {
      if (!d) return null;
      try {
        return d instanceof Date ? d.toISOString() : new Date(d).toISOString();
      } catch {
        return null;
      }
    };
    const products = productDocs.map((p) => ({
      ...p,
      _id: p._id.toString(),
      id: p._id.toString(),
      owner_id: p.owner_id.toString(),
      createdAt: toIso(p.createdAt),
      updatedAt: toIso(p.updatedAt),
      ...meta,
    }));

    const totalProducts = await ProductModel.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / itemsPerPage);

    return {
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        itemsPerPage,
        totalProducts,
      },
    };
  } catch (error) {
    console.error("Error fetching products by owner:", error);
    throw error;
  }
};

// Delete a product by id (only the owner or admin). Server Action to be used in forms.
export const deleteProduct = async (formData) => {
  "use server";
  try {
    const session = await auth();
    if (!session) throw new UnauthorizedError();

    const id =
      typeof formData?.get === "function" ? formData.get("id") : formData?.id;
    if (!id) throw new ValidationError("Product id is required");

    await dbConnect();

    const product = await ProductModel.findById(id);
    if (!product) throw new NotFoundError("Product not found");

    const isOwner = product.owner_id?.toString() === session.user?.id;
    const isAdmin = session.user?.role === "admin";
    if (!isOwner && !isAdmin) throw new ForbiddenError();

    await ProductModel.findByIdAndDelete(id);

    revalidatePath("/manage-products");
    revalidatePath(`/products/${id}`);

    return { ok: true, data: { id } };
  } catch (error) {
    console.error("deleteProduct action failed:", error);
    return toActionError(error);
  }
};

// Toggle publish state (only owner or admin)
export const togglePublishProduct = async (formData) => {
  "use server";
  try {
    const session = await auth();
    if (!session) throw new UnauthorizedError();

    const id =
      typeof formData?.get === "function" ? formData.get("id") : formData?.id;
    if (!id) throw new ValidationError("Product id is required");

    await dbConnect();
    const product = await ProductModel.findById(id)
      .select("_id owner_id publish")
      .lean();
    if (!product) throw new NotFoundError("Product not found");

    const isOwner = product.owner_id?.toString() === session.user?.id;
    const isAdmin = session.user?.role === "admin";
    if (!isOwner && !isAdmin) throw new ForbiddenError();

    const currentPublish = Boolean(product.publish);
    const nextPublish = !currentPublish;

    const updRes = await ProductModel.updateOne(
      { _id: id, publish: currentPublish },
      { $set: { publish: nextPublish } },
      { runValidators: false }
    );

    const verify = await ProductModel.findById(id).select("publish").lean();
    const finalState = Boolean(verify?.publish);

    revalidatePath("/manage-products");
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${id}`);

    return {
      ok: true,
      data: {
        id,
        publish: finalState,
        matched: updRes.matchedCount,
        modified: updRes.modifiedCount,
      },
    };
  } catch (error) {
    console.error("togglePublishProduct action failed:", error);
    return toActionError(error);
  }
};
