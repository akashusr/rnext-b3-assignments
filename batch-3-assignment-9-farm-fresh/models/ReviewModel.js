import mongoose, { Schema } from "mongoose";

const ReviewSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
      default: "",
    },
  },
  { timestamps: true }
);

// One review per user per product
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

export const ReviewModel =
  mongoose.models?.Review ?? mongoose.model("Review", ReviewSchema);
