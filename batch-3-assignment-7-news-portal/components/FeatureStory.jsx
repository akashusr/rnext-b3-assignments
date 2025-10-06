import estimateReadTime from "@/utils/estimateReadTime";
import getTimeAgo from "@/utils/getTimeAgo";
import Image from "next/image";
import Link from "next/link";
const FeatureStory = async ({ lang }) => {
  const data = await import("../data/data.json");
  const articleData = data.default;
  const filteredData = articleData.filter(
    (article) => article.image_url && article.title && article.description
  );
  const randomNum = Math.floor(Math.random() * filteredData.length);
  const article = filteredData[randomNum];
  const publishDate = getTimeAgo(article?.pubDate, lang);
  const { minutes, seconds } = estimateReadTime(article.content);
  return (
    <section className="mb-12">
      <article className="bg-white rounded-lg shadow-sm overflow-hidden news-card">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="order-2 lg:order-1 p-8">
            <div className="flex items-center space-x-4 mb-4">
              <span className="px-3 py-1 bg-black text-white text-xs rounded-full">
                Featured
              </span>
              <span className="text-sm text-gray-600">
                {`${minutes > 0 ? minutes + "m" : ""} ${seconds}s
              read`}
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-normal leading-tight mb-4">
              {article.title}
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {article.description.length > 200
                ? article.description.slice(0, 200) + "..."
                : article.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full">
                  <Image
                    src="/assets/avatar/avatar-1.png"
                    alt={article.author}
                    width={40}
                    height={40}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">{article.author}</p>
                  <p className="text-xs text-gray-500">{publishDate}</p>
                </div>
              </div>
              <Link
                href={`/${lang}/news/${article.article_id}`}
                scroll={false}
                className="text-sm hover:text-gray-600 transition-colors"
              >
                Read more →
              </Link>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <Image
              src={article.image_url ?? null}
              alt={article.author}
              className="w-full h-64 lg:h-full object-cover"
              width={300}
              height={300}
            />
          </div>
        </div>
      </article>
    </section>
  );
};

export default FeatureStory;
