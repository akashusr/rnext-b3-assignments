import fs from "fs";
import path from "path";

// NOTE: On Vercel the filesystem is read-only/ephemeral at runtime. We fall back to
// Vercel Blob storage when the VERCEL env var is present. Locally we still write
// into /public for instant preview.

/**
 * Save an uploaded user profile image into the public/users/<userId> folder.
 * Returns the public URL path (e.g. /users/<userId>/abc.png)
 *
 * @param {File} file Web File object from formData.get('profilePicture')
 * @param {string} userId Mongo user _id string used to namespace user folder
 */
export async function saveUserImage(file, userId) {
  if (!file) return null;

  try {
    console.log("[saveUserImage] incoming file", {
      name: file.name,
      type: file.type,
      size: file.size,
      userId,
    });
  } catch {}

  const maxBytes = 2 * 1024 * 1024; // 2MB
  if (file.size > maxBytes) {
    throw new Error("File too large (max 2MB)");
  }

  const allowedMime = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "image/webp",
    "image/heic",
    "image/heif",
  ];
  const allowedExt = [
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".heic",
    ".heif",
  ];

  let originalName = file.name || "profile";
  let ext = path.extname(originalName).toLowerCase();

  if (!allowedMime.includes(file.type || "") && !allowedExt.includes(ext)) {
    throw new Error("Unsupported file type");
  }

  // If mime OK but extension missing, fallback
  if (!ext) {
    switch (file.type) {
      case "image/png":
        ext = ".png";
        break;
      case "image/gif":
        ext = ".gif";
        break;
      case "image/webp":
        ext = ".webp";
        break;
      case "image/heic":
      case "image/heif":
        ext = ".heic";
        break;
      case "image/jpeg":
      case "image/jpg":
        ext = ".jpg";
        break;
      default:
        ext = ".png";
    }
  }

  // If running on Vercel use Blob storage instead of local FS
  if (process.env.VERCEL || process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { put } = await import("@vercel/blob");
      // Sanitize base name
      const safeBase =
        originalName.replace(/[^a-zA-Z0-9_.-]/g, "_").replace(ext, "") ||
        "profile";
      const key = `users/${userId}/${safeBase}_${Date.now()}${ext}`;
      const { url } = await put(key, file, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN, // ensure set in Vercel env vars
        addRandomSuffix: true,
      });
      return url; // already a full https URL
    } catch (err) {
      console.error("[saveUserImage] blob upload failed, falling back", err);
      // (Falls through to local fs attempt which will likely be ephemeral)
    }
  }

  // Local (dev) or fallback: write to public/users
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const usersDir = path.join(process.cwd(), "public", "users", userId);
  await fs.promises.mkdir(usersDir, { recursive: true });
  const safeBase =
    originalName.replace(/[^a-zA-Z0-9_.-]/g, "_").replace(ext, "") || "profile";
  const filename = `${safeBase}_${Date.now()}${ext}`;
  const fullPath = path.join(usersDir, filename);
  await fs.promises.writeFile(fullPath, buffer);
  return `/users/${userId}/${filename}`;
}
