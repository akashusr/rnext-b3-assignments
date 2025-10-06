// SEO utility helpers for constructing consistent metadata across pages.
// Centralizes site branding values so they can be reused.

export function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    process.env.NEXTAUTH_URL?.replace(/\/$/, "") ||
    process.env.APP_BASE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

export function absoluteUrl(path = "") {
  const base = getBaseUrl();
  if (!path) return base;
  if (/^https?:\/\//i.test(path)) return path; // already absolute
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildDescription(raw, fallback) {
  const text = (raw || fallback || "").trim();
  if (text.length <= 160) return text;
  return text.slice(0, 157).trimEnd() + "...";
}

export const SITE = {
  name: "FarmFresh",
  tagline: "Fresh Organic Produce Direct from Farmers",
  defaultDescription:
    "Buy fresh organic vegetables, fruits, grains, dairy, honey & herbs directly from local farmers. Fair prices, secure checkout, fast delivery.",
  defaultImage: "/chinese.png", // ensure this image exists for OG fallback
};
