import ArticleHeader from "@/components/article/ArticleHeader";
import ArticleImage from "@/components/article/ArticleImage";
import ArticleBody from "@/components/article/ArticleBody";
import SocialActions from "@/components/article/SocialActions";
import Sidebar from "@/components/article/Sidebar";
import estimateReadTime from "@/utils/estimateReadTime";
import { getDictionary } from "@/utils/dictionaries";
import { notFound } from "next/navigation";
const ArticleDetailsPage = async ({ params }) => {
  const lang = params?.lang;
  const articleId = params.id;
  const data = await import("@/data/data.json");
  const articleData = data.default;
  const article = articleData.find(article => article.article_id === articleId);

  if (!article) {
    return notFound();
  }

  const readTime = estimateReadTime(article.content);
  const dict = await getDictionary(lang);
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <article className="lg:col-span-3">
          <ArticleHeader title={article.title} />

          <ArticleImage image={article.image_url} author={article.author} />

          <ArticleBody article={article} />

          <SocialActions dict={dict} readTime={readTime} />
        </article>

        <Sidebar lang={lang} dict={dict} article={article} />
      </div>
    </main>
  );
};

export default ArticleDetailsPage;
