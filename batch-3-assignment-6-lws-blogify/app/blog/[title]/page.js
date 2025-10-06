import data from "@/data/data.json";
import ArticleDetailsHeader from "@/components/ArticleDetailsHeader";
import { notFound } from "next/navigation";
export default function DetailsPage({ params }) {
  const actualTitle = decodeURIComponent(params.title);
  const content = data.find(article => article.title === actualTitle);
  if (!content) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <ArticleDetailsHeader content={content} />
      <div
        className="prose-xl max-w-none article-content"
        dangerouslySetInnerHTML={{ __html: content.description }}
      ></div>
    </div>
  );
}
