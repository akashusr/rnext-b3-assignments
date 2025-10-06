import React from "react";
import { getProductById } from "@/actions/productsAction";
import { absoluteUrl, buildDescription, SITE } from "@/lib/seo";
import { NotFoundError } from "@/errors";

// Provide dynamic metadata for each product (SEO + social cards)
export async function generateMetadata({ params: { id } }) {
  try {
    const product = await getProductById(id);
    if (!product || product.publish === false) {
      return {
        title: "Product Not Found",
        description: `The product you are looking for is not available on ${SITE.name}.`,
        robots: { index: false, follow: false },
      };
    }
    const title = `${product.product_name}`;
    const descFallback = `${
      product.product_name
    } - Fresh ${product.category.toLowerCase()} available at ৳${Number(
      product.product_price_per_kg
    ).toFixed(2)} per kg on ${SITE.name}. Order now.`;
    const description = buildDescription(product.description, descFallback);
    const image = product.product_image
      ? absoluteUrl(product.product_image)
      : absoluteUrl(SITE.defaultImage);
    const url = absoluteUrl(`/products/${product.id}`);
    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: {
        title,
        description,
        url,
        siteName: SITE.name,
        // Keeping default 'website' type implicitly; 'product' not supported by Next metadata validator.
        images: [
          {
            url: image,
            alt: title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
    };
  } catch (e) {
    if (e instanceof NotFoundError) {
      return {
        title: "Product Not Found",
        description: `The product you are looking for is not available on ${SITE.name}.`,
        robots: { index: false, follow: false },
      };
    }
    return {
      title: SITE.name,
      description: SITE.defaultDescription,
      robots: { index: false },
    };
  }
}

// Fallback content for the default slot; primary UI is assembled via parallel route slots in layout.js
export default async function ProductDetailsPage() {
  return null; // composed via parallel sub-routes
}
