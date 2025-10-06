import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/mongo";
import { ProductModel } from "@/models/productModel";
import {
  saveProductMainImage,
  saveProductGalleryImages,
} from "@/lib/saveProductImages";
import mongoose from "mongoose";

export async function PUT(_req, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (session.user?.role !== "farmer") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const id = params?.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    const contentType = _req.headers.get("content-type") || "";
    let update = {};
    if (contentType.includes("multipart/form-data")) {
      const form = await _req.formData();
      const getVal = (k) => form.get(k);
      const allowed = [
        "product_name",
        "category",
        "product_price_per_kg",
        "product_stock",
        "product_image",
        "description",
        "organic",
        "publish",
      ];
      for (const key of allowed) {
        const v = getVal(key);
        if (v !== null && v !== undefined && v !== "") {
          if (key === "product_price_per_kg" || key === "product_stock")
            update[key] = Number(v);
          else if (key === "organic" || key === "publish")
            update[key] = String(v) === "true" || v === true;
          else update[key] = v;
        }
      }
      const mainFile = getVal("mainImage") || getVal("product_image_file");
      if (mainFile instanceof File) {
        update.product_image = await saveProductMainImage(
          mainFile,
          session.user.id
        );
      }
      const retained = form
        .getAll("existing_gallery")
        .filter((v) => typeof v === "string");
      const galleryFiles = form
        .getAll("gallery")
        .filter((f) => f instanceof File);
      let newGallery = retained.slice(0, 5);
      if (galleryFiles.length) {
        const galleryUrls = await saveProductGalleryImages(
          galleryFiles,
          session.user.id,
          5 - newGallery.length
        );
        newGallery = [...newGallery, ...galleryUrls].slice(0, 5);
      }
      if (newGallery.length) update.gallery = newGallery;
    } else {
      const body = await _req.json();
      const allowed = [
        "product_name",
        "category",
        "product_price_per_kg",
        "product_stock",
        "product_image",
        "description",
        "organic",
        "gallery",
        "publish",
      ];
      for (const key of allowed) {
        if (key in body) update[key] = body[key];
      }
    }

    await dbConnect();
    // Ensure ownership
    const existing = await ProductModel.findById(id);
    if (!existing) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    if (String(existing.owner_id) !== String(session.user.id)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const updated = await ProductModel.findByIdAndUpdate(id, update, {
      new: true,
    });

    return NextResponse.json({
      id: updated._id.toString(),
      message: "Product updated",
    });
  } catch (err) {
    const msg = err?.message || "Failed to update product";
    return NextResponse.json({ message: msg }, { status: 400 });
  }
}
