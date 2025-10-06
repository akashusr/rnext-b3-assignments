import NewsCard from "./NewsCard";
const NewsSection = async () => {
  const data = await import("../data/data.json");
  const articleData = data.default;
  return (
    <section>
      <h2 className="text-2xl font-bold mb-8">Latest Stories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articleData.map(article => (
          <NewsCard key={article.article_id} article={article} />
        ))}
      </div>
    </section>
  );
};

export default NewsSection;
