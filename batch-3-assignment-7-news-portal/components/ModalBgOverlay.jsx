import ArticleHeader from "@/components/article/ArticleHeader";
import ArticleImage from "@/components/article/ArticleImage";
import ArticleBody from "@/components/article/ArticleBody";
import SocialActions from "@/components/article/SocialActions";
import Sidebar from "@/components/article/Sidebar";
import estimateReadTime from "@/utils/estimateReadTime";
import { getDictionary } from "@/utils/dictionaries";
const ModalBgOverlay = async ({ parameters }) => {
  const lang = parameters?.lang;
  const articleId = parameters.id;
  const data = await import("@/data/data.json");
  const articleData = data.default;
  const article = articleData.find(article => article.article_id === articleId);

  const readTime = estimateReadTime(article?.content);
  const dict = await getDictionary(lang);

  return (
    <article className="p-6">
      <ArticleHeader title={article?.title} />

      <ArticleImage image={article?.image_url} author={article?.author} />

      <ArticleBody article={article} />

      <SocialActions dict={dict} readTime={readTime} />
    </article>
  );
};

export default ModalBgOverlay;
