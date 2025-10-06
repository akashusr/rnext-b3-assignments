import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/mongo";
import { ProductModel } from "@/models/productModel";
import {
  saveProductMainImage,
  saveProductGalleryImages,
} from "@/lib/saveProductImages";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    if (session.user?.role !== "farmer")
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    let data = null;
    let isMultipart = false;
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      data = await req.formData();
    } else {
      data = await req.json();
    }

    const getVal = (key) => (isMultipart ? data.get(key) : data[key]);

    const rawGallery = [];
    if (isMultipart) {
      // Accept fields named gallery or gallery[]
      for (const key of ["gallery", "gallery[]"]) {
        const val = data.getAll ? data.getAll(key) : [];
        if (val?.length) rawGallery.push(...val);
      }
    } else if (Array.isArray(data.gallery)) {
      rawGallery.push(...data.gallery);
    }

    const product_name = getVal("product_name");
    const category = getVal("category");
    const product_price_per_kg = Number(getVal("product_price_per_kg"));
    const product_stock = Number(getVal("product_stock"));
    const description = getVal("description") || "";
    const organic =
      String(getVal("organic")) === "true" || getVal("organic") === true;
    // If publish field not supplied, default to true (schema default) so new products are visible
    const rawPublish = getVal("publish");
    const publish =
      rawPublish == null
        ? true
        : String(rawPublish) === "true" || rawPublish === true;

    let product_image = getVal("product_image"); // fallback textual URL if provided
    let gallery = [];

    if (isMultipart) {
      const mainFile = getVal("mainImage") || getVal("product_image_file");
      if (mainFile instanceof File) {
        product_image = await saveProductMainImage(mainFile, session.user.id);
      }

      const galleryFiles = rawGallery.filter((f) => f instanceof File);
      if (galleryFiles.length) {
        gallery = await saveProductGalleryImages(
          galleryFiles,
          session.user.id,
          5
        );
      }
    }

    if (!product_image) {
      return NextResponse.json(
        { message: "Main image is required" },
        { status: 400 }
      );
    }

    await dbConnect();
    const created = await ProductModel.create({
      product_name,
      category,
      product_price_per_kg,
      product_stock,
      description,
      product_image,
      organic,
      gallery,
      // Only set publish explicitly to computed value (default true when omitted)
      publish: Boolean(publish),
      owner_id: session.user.id,
    });

    return NextResponse.json(
      { id: created._id.toString(), message: "Product created" },
      { status: 201 }
    );
  } catch (err) {
    const msg = err?.message || "Failed to create product";
    return NextResponse.json({ message: msg }, { status: 400 });
  }
}
