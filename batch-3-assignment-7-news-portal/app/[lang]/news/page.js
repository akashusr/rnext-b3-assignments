import FeatureStory from "@/components/FeatureStory";
import NewsSection from "@/components/NewsSection";
export default function Home({ params }) {
  const lang = params?.lang;
  return (
    <>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <FeatureStory lang={lang} />

        <NewsSection />
      </main>
    </>
  );
}
