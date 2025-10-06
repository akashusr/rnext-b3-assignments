import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 },
      );
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload an image file." },
        { status: 400 },
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const fileName = `${uuidv4()}-${timestamp}-${file.name.replace(/\s/g, "_")}`;

    // Convert the buffer to base64 for immediate use with Gemini
    const base64Image = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";

    return NextResponse.json({
      success: true,
      // Return a unique identifier for the UI
      url: `upload-${fileName}`,
      // The base64 data is what will be used for both display and Gemini API
      base64Data: `data:${mimeType};base64,${base64Image}`,
      // Additional metadata
      fileName: file.name,
      fileSize: file.size,
      mimeType: mimeType,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { error: "Error processing image" },
      { status: 500 },
    );
  }
}
