const ArticleBody = ({ article }) => {
  return (
    <div className="prose prose-lg max-w-none">
      <p className="text-lg leading-relaxed mb-6">{article.description}</p>

      <p className="text-lg leading-relaxed mb-8">{
      article.content}        
      </p>
    </div>
  );
};

export default ArticleBody;
