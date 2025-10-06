"use server";

import { User } from "@/models/UserModel";
import { dbConnect } from "@/mongo";
import mongoose from "mongoose";

export const getUserPublicProfile = async (userId) => {
  try {
    await dbConnect();
    if (!userId) return null;
    const _id = new mongoose.Types.ObjectId(userId);
    const user = await User.findById(_id);
    if (!user) return null;

    // Build a safe, plain object with only necessary fields
    return {
      id: user._id.toString(),
      name:
        user.name ||
        `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
        null,
      address: user.address || null,
      image: user.image || null,
      farmDetails: user.farmDetails
        ? {
            farmName: user.farmDetails.farmName || null,
            specialization: user.farmDetails.specialization || null,
            farmSize: user.farmDetails.farmSize || null,
            farmSizeUnit: user.farmDetails.farmSizeUnit || null,
          }
        : null,
    };
  } catch (error) {
    console.error("Error fetching user public profile:", error);
    return null;
  }
};
