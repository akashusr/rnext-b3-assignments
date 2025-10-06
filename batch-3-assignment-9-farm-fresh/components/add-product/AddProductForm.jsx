"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Reusable form for both creating and editing a product
// Props:
// - initialProduct?: product object to edit
// - onSuccess?: callback after successful save
const AddProductForm = ({ initialProduct = null, onSuccess }) => {
  const router = useRouter();

  // Form state
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState(""); // lowercase values for select
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // still allow URL fallback
  const [mainFile, setMainFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]); // up to 5
  const [existingGallery, setExistingGallery] = useState([]); // strings (urls) when editing
  const [description, setDescription] = useState("");
  const galleryInputRef = useRef();
  const mainInputRef = useRef();
  const [organic, setOrganic] = useState(false);

  const isEdit = Boolean(initialProduct?.id || initialProduct?._id);
  const productId = initialProduct?.id || initialProduct?._id || null;

  // Prefill on edit
  useEffect(() => {
    if (!initialProduct) return;
    setProductName(initialProduct.product_name ?? "");
    // Convert schema category (e.g., "Vegetables") to lowercase select value
    setCategory(initialProduct.category?.toLowerCase?.() ?? "");
    setPrice(String(initialProduct.product_price_per_kg ?? ""));
    setStock(String(initialProduct.product_stock ?? ""));
    setImageUrl(initialProduct.product_image ?? "");
    setOrganic(Boolean(initialProduct.organic));
    setExistingGallery(
      Array.isArray(initialProduct.gallery) ? initialProduct.gallery : []
    );
    setDescription(initialProduct.description ?? "");
  }, [initialProduct]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const toSchemaCategory = (val) =>
    val ? val.charAt(0).toUpperCase() + val.slice(1).toLowerCase() : "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (
      !productName ||
      !category ||
      !price ||
      !stock ||
      (!imageUrl && !mainFile)
    ) {
      setError(
        "Please fill all required fields (main image via upload or URL)"
      );
      return;
    }

    // Custom validation: if relying on existing or typed URL ensure it matches allowed pattern
    if (!mainFile && imageUrl) {
      const ok =
        /^(https?:\/\/|\/products\/).+\.(jpg|jpeg|png|webp|gif|heic|heif)$/i.test(
          imageUrl.trim()
        );
      if (!ok) {
        setError(
          "Main image URL must be an absolute http(s) URL or a stored /products/... path ending with an image extension"
        );
        return;
      }
    }

    const isEditMode = isEdit;
    const formData = new FormData();
    formData.append("product_name", productName.trim());
    formData.append("category", toSchemaCategory(category));
    formData.append("product_price_per_kg", Number(Number(price).toFixed(2)));
    formData.append("product_stock", Number(stock));
    formData.append("organic", Boolean(organic));
    if (description.trim()) formData.append("description", description.trim());
    if (imageUrl && !mainFile)
      formData.append("product_image", imageUrl.trim());
    if (mainFile) formData.append("mainImage", mainFile);
    // Keep currently retained existing gallery URLs (after deletions)
    existingGallery
      .slice(0, 5)
      .forEach((url) => formData.append("existing_gallery", url));
    galleryFiles
      .slice(0, 5 - existingGallery.length)
      .forEach((f) => formData.append("gallery", f));

    setSubmitting(true);
    try {
      const res = await fetch(
        isEditMode ? `/api/products/${productId}` : "/api/products",
        {
          method: isEditMode ? "PUT" : "POST",
          body: formData,
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({ message: "Failed" }));
        throw new Error(data.message || "Failed to save product");
      }
      const data = await res.json();
      if (onSuccess) onSuccess(data);
      // Go back to manage products
      router.push("/manage-products");
      router.refresh();
    } catch (err) {
      setError(err.message || "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-primary-600 text-white px-8 py-6">
          <h1 className="text-3xl font-bold">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="text-primary-100 mt-2">
            {isEdit
              ? "Update your product details"
              : "Share your fresh produce with customers"}
          </p>
        </div>

        {/* Form */}
        <form className="p-8 space-y-8" onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="productName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Product Name *
                </label>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Organic Tomatoes"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select Category</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="fruits">Fruits</option>
                  <option value="grains">Grains</option>
                  <option value="dairy">Dairy</option>
                  <option value="herbs">Herbs</option>
                  <option value="honey">Honey</option>
                </select>
              </div>

              {/* Main Image Upload or URL */}
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Main Product Image *
                </label>
                {isEdit && imageUrl && !mainFile && (
                  <div className="flex items-start gap-4 p-3 border rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div className="w-32 h-32 flex-shrink-0 overflow-hidden rounded-md border">
                      <Image
                        src={imageUrl}
                        alt="Current main"
                        className="object-cover w-full h-full"
                        width={128}
                        height={128}
                      />
                    </div>
                    <div className="flex-1 space-y-2 text-sm">
                      <p className="font-medium">Current Main Image</p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setImageUrl("");
                          }}
                          className="px-3 py-1 rounded bg-red-600 text-white text-xs hover:bg-red-700"
                        >
                          Remove
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (mainInputRef.current)
                              mainInputRef.current.click();
                          }}
                          className="px-3 py-1 rounded bg-primary-600 text-white text-xs hover:bg-primary-700"
                        >
                          Replace
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        If you remove it, you must upload a new image or provide
                        a URL before saving.
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      ref={mainInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => setMainFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                    {mainFile && (
                      <p className="text-xs mt-1 text-green-600">
                        Selected: {mainFile.name}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                    <span>OR</span>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="https://example.com/image.jpg or /products/..../file.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      disabled={Boolean(mainFile)}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Upload an image (preferred) or provide an absolute URL or an
                  existing stored path like /products/USERID/file.jpg.
                </p>
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Pricing & Inventory
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Price per kg (৳) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  step="0.01"
                  min="0"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="45.00"
                />
              </div>

              <div>
                <label
                  htmlFor="unit"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Unit
                </label>
                <select
                  id="unit"
                  name="unit"
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-500"
                >
                  <option value="kg">Kilogram (kg)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Currently only kilogram (kg) is supported.
                </p>
              </div>

              <div>
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Available Stock (kg) *
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  min="0"
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="100"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Description
            </h2>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Product Description (Optional)
              </label>
              <textarea
                id="description"
                rows={5}
                maxLength={1000}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your product: taste, origin, farming practices, storage tips..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-y"
              />
              <div className="text-xs text-gray-500 mt-1 flex justify-between">
                <span>Max 1000 characters.</span>
                <span>{description.length}/1000</span>
              </div>
            </div>
          </div>

          {/* Existing Gallery (Edit Mode) */}
          {isEdit && existingGallery.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Current Gallery
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                {existingGallery.map((url, idx) => (
                  <div
                    key={url}
                    className="relative group border rounded-lg overflow-hidden"
                  >
                    <Image
                      src={url}
                      alt={`Gallery ${idx + 1}`}
                      className="object-cover w-full h-32"
                      width={128}
                      height={128}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setExistingGallery(
                          existingGallery.filter((u) => u !== url)
                        )
                      }
                      className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-80 group-hover:opacity-100"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
              {existingGallery.length < 5 && (
                <p className="text-xs text-gray-500 mb-2">
                  You can add {5 - existingGallery.length} more image(s).
                </p>
              )}
            </div>
          )}

          {/* Gallery Upload */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Gallery Images (Optional)
            </h2>
            <div>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary-500 transition relative">
                <input
                  ref={galleryInputRef}
                  id="gallery"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    const remainingSlots = 5 - existingGallery.length;
                    const merged = [...galleryFiles, ...files].slice(
                      0,
                      remainingSlots
                    );
                    setGalleryFiles(merged);
                  }}
                  className="hidden"
                />
                <label htmlFor="gallery" className="cursor-pointer block">
                  <FontAwesomeIcon
                    icon={faCloudUploadAlt}
                    className="text-4xl text-gray-400 mb-4"
                  />
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    Click to select up to {5 - existingGallery.length} images
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    PNG, JPG, WEBP, GIF (max 4MB each)
                  </p>
                </label>
                {galleryFiles.length > 0 && (
                  <ul className="mt-4 text-left space-y-1 text-xs max-h-32 overflow-y-auto">
                    {galleryFiles.map((f, i) => (
                      <li
                        key={i}
                        className="flex justify-between items-center gap-2 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded"
                      >
                        <span className="truncate flex-1">{f.name}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setGalleryFiles(
                              galleryFiles.filter((_, idx) => idx !== i)
                            )
                          }
                          className="text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Product Features */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Product Features
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                <input
                  type="checkbox"
                  name="organic"
                  checked={organic}
                  onChange={(e) => setOrganic(e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm">Organic</span>
              </label>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm" role="alert">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary-600 disabled:opacity-70 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition"
            >
              {submitting
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : isEdit
                ? "Update Product"
                : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;
