import { auth } from "@/auth";
import { dbConnect } from "@/mongo";
import { User } from "@/models/UserModel";
import { NextResponse } from "next/server";
import { saveUserImage } from "@/lib/saveUserImage";
import mongoose from "mongoose";

export async function PUT(request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const contentType = request.headers.get("content-type") || "";
    let firstName, lastName, phone, address, bio, farmDetails, imagePath, role;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      firstName = formData.get("firstName");
      lastName = formData.get("lastName");
      phone = formData.get("phone");
      address = formData.get("address");
      bio = formData.get("bio");
      const fd = formData.get("farmDetails");
      if (fd) {
        try {
          farmDetails = JSON.parse(fd);
        } catch (_) {}
      }
      role = formData.get("role") || undefined;
      const file = formData.get("profilePicture");
      if (file && typeof file !== "string" && file.name) {
        try {
          imagePath = await saveUserImage(file, session.user.id.toString());
        } catch (e) {
          console.error("Profile image save failed:", e.message);
          // Do not abort full update on image failure
        }
      }
    } else {
      const body = await request.json();
      ({ firstName, lastName, phone, address, bio, farmDetails, role } = body);
    }

    // Build update object
    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (bio !== undefined) updateData.bio = bio;
    if (farmDetails !== undefined) {
      // Clean empty enum values to avoid Mongoose enum validation on ''
      if (farmDetails && typeof farmDetails === "object") {
        if (farmDetails.specialization === "")
          delete farmDetails.specialization; // ignore empty selection
      }
      updateData.farmDetails = farmDetails;
    }

    // Controlled role upgrade: allow customer -> farmer ONLY when farmDetails has required fields
    if (role && role === "farmer") {
      // Fetch current user role
      const currentUser = await User.findById(session.user.id).select("role");
      if (currentUser && currentUser.role !== "farmer") {
        const fd = farmDetails || currentUser.farmDetails || {};
        const missing = [];
        if (!fd?.farmName) missing.push("farmName");
        if (!fd?.specialization) missing.push("specialization");
        if (fd?.farmSize === undefined || fd?.farmSize === null)
          missing.push("farmSize");
        if (missing.length === 0) {
          updateData.role = "farmer";
        } else {
          return NextResponse.json(
            {
              error:
                "Cannot upgrade role to farmer. Missing fields: " +
                missing.join(", "),
            },
            { status: 400 }
          );
        }
      }
    }

    if (imagePath) updateData.image = imagePath;

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password -resetPasswordToken -resetPasswordExpires");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findById(session.user.id).select(
      "-password -resetPasswordToken -resetPasswordExpires"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
