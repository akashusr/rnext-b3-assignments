import fs from "fs";
import path from "path";

// In production (Vercel) we prefer Blob storage; local dev keeps using /public

// Allowed lists (keep in sync with saveUserImage)
const ALLOWED_MIME = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/webp",
  "image/heic",
  "image/heif",
];
const ALLOWED_EXT = [
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".heic",
  ".heif",
];

function extFromMime(mime) {
  switch (mime) {
    case "image/png":
      return ".png";
    case "image/gif":
      return ".gif";
    case "image/webp":
      return ".webp";
    case "image/heic":
    case "image/heif":
      return ".heic";
    case "image/jpeg":
    case "image/jpg":
      return ".jpg";
    default:
      return ".png";
  }
}

async function saveOne(file, userId, kind = "img", idx = 0, { maxBytes }) {
  if (!file) return null;
  if (file.size > maxBytes)
    throw new Error(
      `File too large (max ${Math.round(maxBytes / 1024 / 1024)}MB)`
    );

  let originalName = file.name || `${kind}`;
  let ext = path.extname(originalName).toLowerCase();
  if (!ALLOWED_MIME.includes(file.type || "") && !ALLOWED_EXT.includes(ext)) {
    throw new Error("Unsupported file type");
  }
  if (!ext) ext = extFromMime(file.type);

  // Production path: Blob storage
  if (process.env.VERCEL || process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { put } = await import("@vercel/blob");
      const safeBase = (
        originalName.replace(/[^a-zA-Z0-9_.-]/g, "_").replace(ext, "") || kind
      ).slice(0, 40);
      const key = `products/${userId}/${safeBase}_${kind}_${idx}_${Date.now()}${ext}`;
      const { url } = await put(key, file, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
        addRandomSuffix: true,
      });
      return url; // full URL
    } catch (e) {
      console.error(
        "[saveProductImages] blob upload failed, fallback to fs",
        e
      );
    }
  }

  // Dev / fallback: local filesystem (non-persistent on Vercel)
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const dir = path.join(process.cwd(), "public", "products", userId);
  await fs.promises.mkdir(dir, { recursive: true });
  const safeBase = (
    originalName.replace(/[^a-zA-Z0-9_.-]/g, "_").replace(ext, "") || kind
  ).slice(0, 40);
  const filename = `${safeBase}_${kind}_${idx}_${Date.now()}${ext}`;
  const fullPath = path.join(dir, filename);
  await fs.promises.writeFile(fullPath, buffer);
  return `/products/${userId}/${filename}`; // relative public url
}

// Save single main image
export async function saveProductMainImage(file, userId) {
  return saveOne(file, userId, "main", 0, { maxBytes: 5 * 1024 * 1024 });
}

// Save gallery images (up to max, default 5)
export async function saveProductGalleryImages(files, userId, max = 5) {
  if (!Array.isArray(files)) return [];
  const limited = files.filter(Boolean).slice(0, max);
  const results = [];
  for (let i = 0; i < limited.length; i++) {
    const f = limited[i];
    const url = await saveOne(f, userId, "gallery", i, {
      maxBytes: 4 * 1024 * 1024,
    });
    if (url) results.push(url);
  }
  return results;
}
