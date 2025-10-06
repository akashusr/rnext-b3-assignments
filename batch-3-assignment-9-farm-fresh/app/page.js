import Category from "@/components/home/category/Category";
import FeaturedProduct from "@/components/home/featured/FeaturedProduct";
import Hero from "@/components/home/hero/Hero";
import NewsLetter from "@/components/home/newsLetter/NewsLetter";
import WhyFarmFresh from "@/components/home/whyFarmFresh/WhyFarmFresh";
import { SITE, absoluteUrl } from "@/lib/seo";

export function generateMetadata() {
  const title = "Fresh Organic Produce, Direct from Local Farmers";
  const description = SITE.defaultDescription;
  // Override global default image just for the root homepage
  const imageUrl = absoluteUrl("/default.png");
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200, // Recommended OG size
          height: 630,
          alt: SITE.tagline,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function Home() {
  // const session = await auth();
  // console.log("User session:", session);

  return (
    <>
      <Hero />
      <Category />
      <FeaturedProduct />
      <WhyFarmFresh />
      <NewsLetter />
    </>
  );
}
