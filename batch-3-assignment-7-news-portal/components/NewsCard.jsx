import estimateReadTime from "@/utils/estimateReadTime";
import getTimeAgo from "@/utils/getTimeAgo";
import Image from "next/image";
import Link from "next/link";
const NewsCard = ({ article }) => {
  const publishDate = getTimeAgo(article.pubDate);
  const { minutes, seconds } = estimateReadTime(article.content);
  return (
    <Link href={`/news/${article.article_id}`}>
      <article className="bg-white rounded-lg shadow-sm overflow-hidden news-card">
        {article.image_url !== null ? (
          <Image
            src={article.image_url}
            alt="Technology news"
            className="w-full h-48 object-cover"
            width={160}
            height={160}
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center">
            <p>Image broken...</p>
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-3">
            {article.category?.length > 0 &&
              article.category.map((category) => (
                <span
                  key={category}
                  className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
                >
                  {category}
                </span>
              ))}
            <span className="text-xs text-gray-500">
              {`${minutes > 0 ? minutes + "m" : ""} ${seconds}s read`}
            </span>
          </div>
          <h3 className="text-xl font-medium mb-3 leading-tight">
            {article?.title?.length > 70
              ? article?.title?.slice(0, 70) + "..."
              : article.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            {article.description?.length > 150
              ? article.description.slice(0, 150) + "..."
              : article.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full">
                <Image
                  src="/assets/avatar/avatar-2.png"
                  alt={article.author}
                  width={30}
                  height={30}
                />
              </div>
              <span className="text-xs text-gray-500">{article.author}</span>
            </div>
            <span className="text-xs text-gray-400">{publishDate}</span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default NewsCard;
