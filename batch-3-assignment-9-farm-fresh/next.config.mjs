/** @type {import('next').NextConfig} */
// Support one or many blob hosts via env vars.
// BLOB_PUBLIC_HOST: single host
// BLOB_PUBLIC_HOSTS: comma separated list
function collectBlobHosts() {
  const raw = [];
  if (process.env.BLOB_PUBLIC_HOST) raw.push(process.env.BLOB_PUBLIC_HOST);
  if (process.env.BLOB_PUBLIC_HOSTS)
    raw.push(...process.env.BLOB_PUBLIC_HOSTS.split(","));
  return Array.from(
    new Set(
      raw
        .map((h) => h && h.trim())
        .filter(Boolean)
        .map(
          (h) =>
            h
              .replace(/^https?:\/\//, "") // drop protocol
              .replace(/\/$/, "") // drop trailing slash
        )
    )
  );
}

const blobHosts = collectBlobHosts();

const nextConfig = {
  images: {
    domains: [
      "www.k12digest.com",
      "www.farmatma.in",
      "images.unsplash.com",
      "lh3.googleusercontent.com",
      "placehold.co",
      ...blobHosts,
    ],
  },
};

export default nextConfig;
