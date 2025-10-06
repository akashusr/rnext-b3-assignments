import { User } from "@/models/UserModel";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/mongo";
import { saveUserImage } from "@/lib/saveUserImage";

export async function POST(req) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let firstName,
      lastName,
      email,
      phone,
      address,
      password,
      farmDetails,
      imagePath,
      fileObj;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      firstName = formData.get("firstName") || undefined;
      lastName = formData.get("lastName") || undefined;
      email = formData.get("email") || undefined;
      phone = formData.get("phone") || undefined;
      address = formData.get("address") || undefined;
      password = formData.get("password") || undefined;
      const fd = formData.get("farmDetails");
      try {
        farmDetails = fd ? JSON.parse(fd) : undefined;
      } catch (_) {
        farmDetails = undefined;
      }
      fileObj = formData.get("profilePicture");
    } else {
      ({ firstName, lastName, email, phone, address, password, farmDetails } =
        await req.json());
    }

    // Connect to database
    await dbConnect();

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Clean empty specialization value to satisfy enum
    if (farmDetails && farmDetails.specialization === "") {
      delete farmDetails.specialization;
    }

    // Create farmer
    let farmer = await User.create({
      firstName,
      lastName,
      email,
      phone,
      address,
      password: hashedPassword,
      role: "farmer",
      farmDetails,
    });

    if (fileObj && typeof fileObj !== "string") {
      try {
        imagePath = await saveUserImage(fileObj, farmer._id.toString());
        farmer.image = imagePath;
        await farmer.save();
      } catch (e) {
        console.error("Farmer image save failed:", e);
      }
    }

    return NextResponse.json(
      {
        message: "Farmer registered successfully",
        user: {
          id: farmer._id,
          firstName: farmer.firstName,
          email: farmer.email,
          role: farmer.role,
          image: farmer.image || null,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Error registering farmer" },
      { status: 500 }
    );
  }
}
