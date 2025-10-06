import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    // Quantity in kilograms to align with product_price_per_kg
    quantityKg: {
      type: Number,
      required: true,
      min: [0.1, "Quantity must be at least 0.1 kg"],
    },
    unitPrice: {
      type: Number,
      required: true,
      min: [0, "Unit price cannot be negative"],
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, "Total price cannot be negative"],
    },
    status: {
      type: String,
      enum: [
        "pending", // created by buyer, awaiting farmer confirmation (stock already reserved)
        "confirmed", // farmer accepted the order (was previously called 'accepted')
        // 'accepted' kept for backward compatibility / legacy data
        "accepted",
        "shipped", // farmer has shipped the order
        "delivered", // order has been delivered
        "cancelled_by_buyer", // buyer cancelled prior to farmer confirmation
        "cancelled_by_farmer", // farmer cancelled (stock should be restored if not shipped)
        "cancelled", // general cancelled status / legacy
      ],
      default: "pending",
      index: true,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const BookingModel =
  mongoose.models?.Booking ?? mongoose.model("Booking", BookingSchema);
