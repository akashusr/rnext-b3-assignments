import { stringify } from "postcss";

import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    product_name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["Vegetables", "Fruits", "Grains", "Dairy", "Honey", "Herbs"],
        message:
          "Category must be one of: Vegetables, Fruits, Grains, Dairy, Honey, Herbs",
      },
    },
    product_price_per_kg: {
      type: Number,
      required: [true, "Price per kg is required"],
      min: [0, "Price cannot be negative"],
      validate: {
        validator: function (v) {
          return Number(v.toFixed(2)) === v;
        },
        message: "Price can have maximum 2 decimal places",
      },
    },
    product_stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      // Allow fractional kilograms; validation of decimals left flexible
    },
    description: {
      type: String,
      required: false,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    owner_id: {
      type: String,
      required: [true, "Owner ID is required"],
      ref: "User", // Assuming you have a User model
    },
    product_image: {
      type: String,
      required: [true, "Product image URL is required"],
      validate: {
        validator: function (v) {
          // Accept either absolute http(s) URLs or local saved /products/... paths
          return (
            /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(v) ||
            /^\/products\/.+\.(jpg|jpeg|png|webp|gif|heic|heif)$/i.test(v)
          );
        },
        message: "Please provide a valid image URL",
      },
    },
    organic: {
      type: Boolean,
      required: [true, "Organic status is required"],
      default: false,
    },
    gallery: {
      type: [String],
      required: false,
      default: [],
      validate: {
        validator: function (arr) {
          return Array.isArray(arr) && arr.length <= 5; // enforce <=5 as per new feature spec
        },
        message: "Gallery can contain maximum 5 images",
      },
    },
    // Whether the product is published (visible in public listings)
    publish: {
      type: Boolean,
      required: false,
      default: true,
      index: true,
    },
    // Total purchased amount (e.g., total kg or count). Defaults to 0.
    purchase: {
      type: Number,
      required: false,
      default: 0,
      min: [0, "Purchased amount cannot be negative"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
export const ProductModel =
  mongoose.models?.Product ?? mongoose.model("Product", ProductSchema);
