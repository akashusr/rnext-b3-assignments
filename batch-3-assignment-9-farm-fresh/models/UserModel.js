import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  firstName: {
    required: false,
    type: String,
  },
  lastName: {
    required: false,
    type: String,
  },
  name: {
    type: String,
  },
  email: {
    required: true,
    type: String,
    unique: true,
  },
  phone: {
    required: false,
    type: String,
  },
  address: {
    required: false,
    type: String,
  },
  bio: {
    required: false,
    type: String,
  },
  password: {
    required: false, // OAuth users may not have a password initially
    type: String,
  },
  role: {
    required: false,
    type: String,
    enum: ["customer", "farmer", "admin"],
    default: "customer",
  },
  image: {
    required: false,
    type: String,
  },
  // Password reset fields
  resetPasswordToken: {
    type: String,
    index: true,
    required: false,
    select: false, // never return by default
  },
  resetPasswordExpires: {
    type: Date,
    required: false,
    select: false,
  },
  // Farmer specific fields
  farmDetails: {
    farmName: String,
    specialization: {
      type: String,
      enum: ["vegetables", "fruits", "grains", "dairy", "mixed"],
    },
    farmSize: Number,
    farmSizeUnit: {
      type: String,
      enum: ["acres", "hectares", "sq_ft", "sq_m"],
    },
  },
});

// Pre-save middleware to combine firstName and lastName into name
userSchema.pre("save", function (next) {
  if (this.firstName && this.lastName) {
    this.name = `${this.firstName} ${this.lastName}`;
  }
  next();
});

export const User = mongoose.models?.User ?? mongoose.model("User", userSchema);
