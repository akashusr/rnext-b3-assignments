import getTimeAgo from "@/utils/getTimeAgo";
import Link from "next/link";

const Sidebar = async ({ article, dict, lang }) => {
  const publishDate = getTimeAgo(article?.pubDate,lang);

  return (
    <aside className="lg:col-span-1">
      <div className="sticky top-8 space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">{article.author}</h3>
          <p className="text-sm text-gray-600 mb-4">{publishDate}</p>
        </div>

        <div>
          <p className="text-lg font-medium mb-2">38 {dict.comments}</p>
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-black transition-colors"
          >
            {dict.discussion}
          </Link>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-1">{dict.category}</p>
          {article.category.map(category => (
            <p key={category} className="font-medium">
              {category}
            </p>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
