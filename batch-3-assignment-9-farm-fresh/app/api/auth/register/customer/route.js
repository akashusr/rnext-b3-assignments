import { dbConnect } from "@/mongo";
import { User } from "@/models/UserModel";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
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
      fileObj = formData.get("profilePicture"); // may be File or empty string
    } else {
      ({ firstName, lastName, email, phone, address, password } =
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

    // Create customer initially (image might be added later if multipart)
    let customer = await User.create({
      firstName,
      lastName,
      email,
      phone,
      address,
      password: hashedPassword,
      role: "customer",
    });

    // If multipart with image, save now using the created _id then update
    if (fileObj && typeof fileObj !== "string") {
      try {
        imagePath = await saveUserImage(fileObj, customer._id.toString());
        customer.image = imagePath;
        await customer.save();
      } catch (e) {
        console.error("Image save failed (customer):", e);
      }
    }

    return NextResponse.json(
      {
        message: "Customer registered successfully",
        user: {
          id: customer._id,
          firstName: customer.firstName,
          email: customer.email,
          role: customer.role,
          image: customer.image || null,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Error registering customer" },
      { status: 500 }
    );
  }
}
