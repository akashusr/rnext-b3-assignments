"use server";

import mongoose from "mongoose";
import { dbConnect } from "@/mongo";
import { BookingModel } from "@/models/BookingModel";
import { ProductModel } from "@/models/productModel";
// (Email sending removed here to avoid duplicate emails; invoice endpoint handles emailing.)
import {
  NotFoundError,
  ValidationError,
  ForbiddenError,
  UnauthorizedError,
  toActionError,
} from "@/errors";

// Normalize and validate ObjectId values robustly
const asObjectId = (value, field = "id") => {
  // Accept strings, mongoose ObjectIds, and objects with _id
  if (!value) throw new Error(`${field} is required`);
  // If already an ObjectId
  if (value instanceof mongoose.Types.ObjectId) return value;
  // If object with _id
  if (typeof value === "object" && value._id) {
    return asObjectId(value._id, field);
  }
  // If string, validate
  if (typeof value === "string") {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error(`Invalid ${field}`);
    }
    return new mongoose.Types.ObjectId(value);
  }
  throw new Error(`Invalid ${field}`);
};

// Create a booking (buyer orders a product)
// Inputs: { productId, buyerId, quantityKg, notes? }
export const createBooking = async ({
  productId,
  buyerId,
  quantityKg,
  notes,
}) => {
  try {
    await dbConnect();
    const buyer = asObjectId(buyerId, "buyerId");
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ValidationError("Invalid productId");
    }
    const product = await ProductModel.findById(productId);
    if (!product) throw new NotFoundError("Product not found");
    if (String(product.owner_id) === String(buyerId)) {
      throw new ForbiddenError("You cannot buy your own product");
    }
    const farmer = asObjectId(product.owner_id, "farmerId");
    const unitPrice = Number(product.product_price_per_kg);
    const qty = Number(quantityKg);
    if (!qty || qty <= 0)
      throw new ValidationError("Quantity must be greater than 0");

    const updatedProduct = await ProductModel.findOneAndUpdate(
      { _id: productId, product_stock: { $gte: qty } },
      { $inc: { product_stock: -qty, purchase: qty } },
      { new: true }
    );
    if (!updatedProduct)
      throw new ForbiddenError("Insufficient stock available");

    const totalPrice = Number((unitPrice * qty).toFixed(2));
    const booking = await BookingModel.create({
      buyer,
      farmer,
      product: product._id,
      quantityKg: qty,
      unitPrice,
      totalPrice,
      status: "pending",
      notes,
    });
    return {
      ok: true,
      data: {
        id: booking._id.toString(),
        buyer: booking.buyer.toString(),
        farmer: booking.farmer.toString(),
        product: booking.product.toString(),
        quantityKg: booking.quantityKg,
        unitPrice: booking.unitPrice,
        totalPrice: booking.totalPrice,
        status: booking.status,
        notes: booking.notes,
        createdAt: booking.createdAt.toISOString(),
        updatedAt: booking.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("createBooking failed", error);
    return toActionError(error);
  }
};

// Buyer: list my orders
export const getBookingsForBuyer = async ({ buyerId, status }) => {
  await dbConnect();
  const filter = { buyer: asObjectId(buyerId, "buyerId") };
  if (status) {
    if (status === "confirmed") {
      filter.status = { $in: ["confirmed", "accepted"] };
    } else {
      filter.status = status;
    }
  }
  const list = await BookingModel.find(filter)
    .populate(
      "product",
      "product_name product_image product_price_per_kg owner_id product_stock"
    )
    .sort({ createdAt: -1 });
  const iso = (v) => (v ? new Date(v).toISOString() : null);
  return list.map((b) => ({
    id: b._id.toString(),
    buyer: b.buyer.toString(),
    farmer: b.farmer.toString(),
    product: b.product?._id
      ? {
          id: b.product._id.toString(),
          product_name: b.product.product_name,
          product_image: b.product.product_image,
          product_price_per_kg: b.product.product_price_per_kg,
          product_stock: b.product.product_stock,
          owner_id:
            b.product.owner_id?.toString?.() ?? String(b.product.owner_id),
        }
      : { id: b.product?.toString() ?? "unknown" },
    quantityKg: b.quantityKg,
    unitPrice: b.unitPrice,
    totalPrice: b.totalPrice,
    status: b.status === "accepted" ? "confirmed" : b.status,
    notes: b.notes,
    createdAt: iso(b.createdAt),
    updatedAt: iso(b.updatedAt),
  }));
};

// Buyer: list my orders with pagination
// Inputs: { buyerId, status?, page=1, limit=10 }
// Returns: { items, total, page, pageSize, totalPages }
export const getBookingsForBuyerPaginated = async ({
  buyerId,
  status,
  page = 1,
  limit = 10,
}) => {
  await dbConnect();
  const filter = { buyer: asObjectId(buyerId, "buyerId") };
  if (status) {
    if (status === "confirmed") {
      filter.status = { $in: ["confirmed", "accepted"] };
    } else {
      filter.status = status;
    }
  }

  const safePage = Math.max(1, Number(page) || 1);
  const pageSize = Math.max(1, Math.min(50, Number(limit) || 10));
  const skip = (safePage - 1) * pageSize;

  const [list, total] = await Promise.all([
    BookingModel.find(filter)
      .populate(
        "product",
        "product_name product_image product_price_per_kg owner_id product_stock"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize),
    BookingModel.countDocuments(filter),
  ]);

  const iso = (v) => (v ? new Date(v).toISOString() : null);
  const items = list.map((b) => ({
    id: b._id.toString(),
    buyer: b.buyer.toString(),
    farmer: b.farmer.toString(),
    product: b.product?._id
      ? {
          id: b.product._id.toString(),
          product_name: b.product.product_name,
          product_image: b.product.product_image,
          product_price_per_kg: b.product.product_price_per_kg,
          product_stock: b.product.product_stock,
          owner_id:
            b.product.owner_id?.toString?.() ?? String(b.product.owner_id),
        }
      : { id: b.product?.toString() ?? "unknown" },
    quantityKg: b.quantityKg,
    unitPrice: b.unitPrice,
    totalPrice: b.totalPrice,
    status: b.status === "accepted" ? "confirmed" : b.status,
    notes: b.notes,
    createdAt: iso(b.createdAt),
    updatedAt: iso(b.updatedAt),
  }));

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const clampedPage = Math.min(safePage, totalPages);

  return { items, total, page: clampedPage, pageSize, totalPages };
};

// Farmer: list orders for my products
export const getBookingsForFarmer = async ({ farmerId, status }) => {
  await dbConnect();
  const filter = { farmer: asObjectId(farmerId, "farmerId") };
  if (status) {
    if (status === "confirmed") {
      filter.status = { $in: ["confirmed", "accepted"] };
    } else {
      filter.status = status;
    }
  }
  const list = await BookingModel.find(filter)
    .populate(
      "product",
      "product_name product_image product_price_per_kg owner_id product_stock"
    )
    .sort({ createdAt: -1 });
  const iso = (v) => (v ? new Date(v).toISOString() : null);
  return list.map((b) => ({
    id: b._id.toString(),
    buyer: b.buyer.toString(),
    farmer: b.farmer.toString(),
    product: b.product?._id
      ? {
          id: b.product._id.toString(),
          product_name: b.product.product_name,
          product_image: b.product.product_image,
          product_price_per_kg: b.product.product_price_per_kg,
          product_stock: b.product.product_stock,
          owner_id:
            b.product.owner_id?.toString?.() ?? String(b.product.owner_id),
        }
      : { id: b.product?.toString() ?? "unknown" },
    quantityKg: b.quantityKg,
    unitPrice: b.unitPrice,
    totalPrice: b.totalPrice,
    status: b.status === "accepted" ? "confirmed" : b.status,
    notes: b.notes,
    createdAt: iso(b.createdAt),
    updatedAt: iso(b.updatedAt),
  }));
};

// Farmer: list orders for my products with pagination
// Inputs: { farmerId, status?, page=1, limit=10 }
// Returns: { items, total, page, pageSize, totalPages }
export const getBookingsForFarmerPaginated = async ({
  farmerId,
  status,
  page = 1,
  limit = 10,
}) => {
  await dbConnect();
  const filter = { farmer: asObjectId(farmerId, "farmerId") };
  if (status) {
    if (status === "confirmed") {
      filter.status = { $in: ["confirmed", "accepted"] };
    } else {
      filter.status = status;
    }
  }

  const safePage = Math.max(1, Number(page) || 1);
  const pageSize = Math.max(1, Math.min(50, Number(limit) || 10));
  const skip = (safePage - 1) * pageSize;

  const [list, total] = await Promise.all([
    BookingModel.find(filter)
      .populate(
        "product",
        "product_name product_image product_price_per_kg owner_id product_stock"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize),
    BookingModel.countDocuments(filter),
  ]);

  const iso = (v) => (v ? new Date(v).toISOString() : null);
  const items = list.map((b) => ({
    id: b._id.toString(),
    buyer: b.buyer.toString(),
    farmer: b.farmer.toString(),
    product: b.product?._id
      ? {
          id: b.product._id.toString(),
          product_name: b.product.product_name,
          product_image: b.product.product_image,
          product_price_per_kg: b.product.product_price_per_kg,
          product_stock: b.product.product_stock,
          owner_id:
            b.product.owner_id?.toString?.() ?? String(b.product.owner_id),
        }
      : { id: b.product?.toString() ?? "unknown" },
    quantityKg: b.quantityKg,
    unitPrice: b.unitPrice,
    totalPrice: b.totalPrice,
    status: b.status === "accepted" ? "confirmed" : b.status,
    notes: b.notes,
    createdAt: iso(b.createdAt),
    updatedAt: iso(b.updatedAt),
  }));

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const clampedPage = Math.min(safePage, totalPages);

  return { items, total, page: clampedPage, pageSize, totalPages };
};

// Farmer: accept an order (only if pending and owned by farmer)
export const confirmBooking = async ({ bookingId, farmerId }) => {
  try {
    await dbConnect();
    const booking = await BookingModel.findOne({
      _id: asObjectId(bookingId, "bookingId"),
      farmer: asObjectId(farmerId, "farmerId"),
    });
    if (!booking) throw new NotFoundError("Booking not found");
    if (booking.status !== "pending")
      throw new ForbiddenError("Only pending bookings can be confirmed");
    // IMPORTANT: Stock was already decremented at booking creation time.
    // Removing second stock decrement here to avoid double-deduction and
    // false 'Insufficient stock' errors when accepting.
    // If older legacy bookings exist that did NOT decrement on create,
    // you could reintroduce a conditional decrement detect flag here.
    booking.status = "confirmed";
    await booking.save();
    return {
      ok: true,
      data: {
        id: booking._id.toString(),
        status: booking.status,
        updatedAt: booking.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("confirmBooking failed", error);
    return toActionError(error);
  }
};

// Backward compatibility alias (legacy name used in front-end)
export const acceptBooking = async (args) => confirmBooking(args);

// Buyer: cancel my pending order
export const cancelBookingByBuyer = async ({ bookingId, buyerId }) => {
  try {
    await dbConnect();
    const booking = await BookingModel.findOne({
      _id: asObjectId(bookingId, "bookingId"),
      buyer: asObjectId(buyerId, "buyerId"),
    });
    if (!booking) throw new NotFoundError("Booking not found");
    if (!["pending", "confirmed", "accepted"].includes(booking.status))
      throw new ForbiddenError(
        "Only pending or confirmed bookings can be cancelled by buyer"
      );
    const wasConfirmed = ["confirmed", "accepted"].includes(booking.status);
    booking.status = "cancelled_by_buyer";
    await booking.save();
    if (wasConfirmed) {
      try {
        const prod = await ProductModel.findById(booking.product);
        if (prod) {
          const newPurchase = Math.max(
            0,
            (prod.purchase ?? 0) - booking.quantityKg
          );
          const newStock = (prod.product_stock ?? 0) + booking.quantityKg;
          prod.purchase = newPurchase;
          prod.product_stock = newStock;
          await prod.save();
        }
      } catch (e) {
        console.error(
          "Failed to rollback product purchase on buyer cancel:",
          e
        );
      }
    }
    return {
      ok: true,
      data: { id: booking._id.toString(), status: booking.status },
    };
  } catch (error) {
    console.error("cancelBookingByBuyer failed", error);
    return toActionError(error);
  }
};

// Farmer: cancel an order (pending or accepted)
export const cancelBookingByFarmer = async ({ bookingId, farmerId }) => {
  try {
    await dbConnect();
    const booking = await BookingModel.findOne({
      _id: asObjectId(bookingId, "bookingId"),
      farmer: asObjectId(farmerId, "farmerId"),
    });
    if (!booking) throw new NotFoundError("Booking not found");
    if (!["pending", "confirmed", "accepted"].includes(booking.status))
      throw new ForbiddenError(
        "Only pending or confirmed bookings can be cancelled by farmer"
      );
    const wasConfirmed = ["confirmed", "accepted"].includes(booking.status);
    booking.status = "cancelled_by_farmer";
    await booking.save();
    if (wasConfirmed) {
      try {
        const prod = await ProductModel.findById(booking.product);
        if (prod) {
          const newPurchase = Math.max(
            0,
            (prod.purchase ?? 0) - booking.quantityKg
          );
          const newStock = (prod.product_stock ?? 0) + booking.quantityKg;
          prod.purchase = newPurchase;
          prod.product_stock = newStock;
          await prod.save();
        }
      } catch (e) {
        console.error("Failed to rollback product purchase on cancel:", e);
      }
    }
    return {
      ok: true,
      data: { id: booking._id.toString(), status: booking.status },
    };
  } catch (error) {
    console.error("cancelBookingByFarmer failed", error);
    return toActionError(error);
  }
};

// Get single booking by id (for success page)
export const getBookingById = async (bookingId) => {
  await dbConnect();
  const b = await BookingModel.findById(asObjectId(bookingId, "bookingId"))
    .populate(
      "product",
      "product_name product_image product_price_per_kg owner_id"
    )
    .exec();
  if (!b) return null;
  const iso = (v) => (v ? new Date(v).toISOString() : null);
  return {
    id: b._id.toString(),
    buyer: b.buyer.toString(),
    farmer: b.farmer.toString(),
    product: b.product?._id
      ? {
          id: b.product._id.toString(),
          product_name: b.product.product_name,
          product_image: b.product.product_image,
          product_price_per_kg: b.product.product_price_per_kg,
          owner_id:
            b.product.owner_id?.toString?.() ?? String(b.product.owner_id),
        }
      : { id: b.product?.toString() ?? "unknown" },
    quantityKg: b.quantityKg,
    unitPrice: b.unitPrice,
    totalPrice: b.totalPrice,
    status: b.status,
    notes: b.notes,
    createdAt: iso(b.createdAt),
    updatedAt: iso(b.updatedAt),
  };
};

// Get multiple bookings by ids (array of string ids)
export const getBookingsByIds = async (ids = []) => {
  await dbConnect();
  if (!Array.isArray(ids) || ids.length === 0) return [];
  const objIds = ids
    .filter((id) => mongoose.Types.ObjectId.isValid(id))
    .map((id) => new mongoose.Types.ObjectId(id));
  if (objIds.length === 0) return [];
  const list = await BookingModel.find({ _id: { $in: objIds } })
    .populate(
      "product",
      "product_name product_image product_price_per_kg owner_id"
    )
    .exec();
  const iso = (v) => (v ? new Date(v).toISOString() : null);
  return list.map((b) => ({
    id: b._id.toString(),
    buyer: b.buyer.toString(),
    farmer: b.farmer.toString(),
    product: b.product?._id
      ? {
          id: b.product._id.toString(),
          product_name: b.product.product_name,
          product_image: b.product.product_image,
          product_price_per_kg: b.product.product_price_per_kg,
          owner_id:
            b.product.owner_id?.toString?.() ?? String(b.product.owner_id),
        }
      : { id: b.product?.toString() ?? "unknown" },
    quantityKg: b.quantityKg,
    unitPrice: b.unitPrice,
    totalPrice: b.totalPrice,
    status: b.status,
    notes: b.notes,
    createdAt: iso(b.createdAt),
    updatedAt: iso(b.updatedAt),
  }));
};

// Process payment and finalize booking immediately
// Inputs: { productId, buyerId, quantityKg, deliveryAddress?, paymentMethod? }
// - Validates stock and not buying own item
// - Atomically decrements stock and increments purchase
// - Creates booking with status 'accepted' and stores address in notes
export const processPayment = async ({
  productId,
  buyerId,
  quantityKg,
  deliveryAddress,
  paymentMethod,
}) => {
  try {
    await dbConnect();
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ValidationError("Invalid productId");
    }
    const product = await ProductModel.findById(productId);
    if (!product) throw new NotFoundError("Product not found");
    if (String(product.owner_id) === String(buyerId)) {
      throw new ForbiddenError("You cannot buy your own product");
    }
    const qty = Number(quantityKg);
    if (!qty || qty <= 0)
      throw new ValidationError("Quantity must be greater than 0");
    const buyer = asObjectId(buyerId, "buyerId");
    const farmer = asObjectId(product.owner_id, "farmerId");
    const unitPrice = Number(product.product_price_per_kg);
    const totalPrice = Number((unitPrice * qty).toFixed(2));
    const updatedProduct = await ProductModel.findOneAndUpdate(
      { _id: productId, product_stock: { $gte: qty } },
      { $inc: { product_stock: -qty, purchase: qty } },
      { new: true }
    );
    if (!updatedProduct)
      throw new ForbiddenError("Insufficient stock to complete this purchase");
    const booking = await BookingModel.create({
      buyer,
      farmer,
      product: product._id,
      quantityKg: qty,
      unitPrice,
      totalPrice,
      status: "pending",
      notes: deliveryAddress || "",
    });
    return {
      ok: true,
      data: {
        id: booking._id.toString(),
        buyer: booking.buyer.toString(),
        farmer: booking.farmer.toString(),
        product: booking.product.toString(),
        quantityKg: booking.quantityKg,
        unitPrice: booking.unitPrice,
        totalPrice: booking.totalPrice,
        status: booking.status,
        notes: booking.notes,
        createdAt: booking.createdAt.toISOString(),
        updatedAt: booking.updatedAt.toISOString(),
        paymentMethod: paymentMethod || "card",
      },
    };
  } catch (error) {
    console.error("processPayment failed", error);
    return toActionError(error);
  }
};

// Process payment for multiple cart items at once.
// Inputs: { items: [{ productId, quantityKg }], buyerId, deliveryAddress, paymentMethod }
// Behavior: validates each item, creates individual accepted bookings atomically per item (best-effort),
// reduces stock & increments purchase per product. Returns array of booking summaries & errors for failed items.
export const processCartPayment = async ({
  items = [],
  buyerId,
  deliveryAddress,
  paymentMethod,
}) => {
  try {
    await dbConnect();
    if (!Array.isArray(items) || items.length === 0) {
      throw new ValidationError("No items to process");
    }
    const results = [];
    for (const raw of items) {
      try {
        const { productId, quantityKg } = raw || {};
        if (!mongoose.Types.ObjectId.isValid(productId)) {
          throw new ValidationError("Invalid productId");
        }
        const product = await ProductModel.findById(productId);
        if (!product) throw new NotFoundError("Product not found");
        if (String(product.owner_id) === String(buyerId)) {
          throw new ForbiddenError("Cannot buy own product");
        }
        const qty = Number(quantityKg);
        if (!qty || qty <= 0)
          throw new ValidationError("Quantity must be greater than 0");
        const buyer = asObjectId(buyerId, "buyerId");
        const farmer = asObjectId(product.owner_id, "farmerId");
        const unitPrice = Number(product.product_price_per_kg);
        const totalPrice = Number((unitPrice * qty).toFixed(2));
        const updatedProduct = await ProductModel.findOneAndUpdate(
          { _id: productId, product_stock: { $gte: qty } },
          { $inc: { product_stock: -qty, purchase: qty } },
          { new: true }
        );
        if (!updatedProduct) {
          throw new ForbiddenError("Insufficient stock");
        }
        const booking = await BookingModel.create({
          buyer,
          farmer,
          product: product._id,
          quantityKg: qty,
          unitPrice,
          totalPrice,
          status: "pending",
          notes: deliveryAddress || "",
        });
        results.push({
          success: true,
          booking: {
            id: booking._id.toString(),
            product: booking.product.toString(),
            quantityKg: booking.quantityKg,
            totalPrice: booking.totalPrice,
          },
        });
      } catch (e) {
        results.push({ success: false, error: e.message, item: raw });
      }
    }
    const bookingIds = results
      .filter((r) => r.success && r.booking?.id)
      .map((r) => r.booking.id);
    return {
      ok: true,
      data: { results, bookingIds, paymentMethod: paymentMethod || "card" },
    };
  } catch (error) {
    console.error("processCartPayment failed", error);
    return toActionError(error);
  }
};

// Update order status (for farmers)
export const updateOrderStatus = async ({ bookingId, farmerId, status }) => {
  try {
    await dbConnect();
    const booking = await BookingModel.findOne({
      _id: asObjectId(bookingId, "bookingId"),
      farmer: asObjectId(farmerId, "farmerId"),
    });
    if (!booking) throw new NotFoundError("Booking not found");
    const validStatuses = ["confirmed", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      throw new ValidationError("Invalid status");
    }
    if (status === "confirmed" && booking.status !== "pending") {
      throw new ForbiddenError("Only pending orders can be confirmed");
    }
    booking.status = status;
    await booking.save();
    return {
      ok: true,
      data: {
        id: booking._id.toString(),
        status: booking.status,
        updatedAt: booking.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("updateOrderStatus failed", error);
    return toActionError(error);
  }
};
