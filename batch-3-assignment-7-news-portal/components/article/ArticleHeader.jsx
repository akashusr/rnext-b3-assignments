const ArticleHeader = ({ title }) => {
  return (
    <header className="mb-8">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal leading-tight mb-6">
        {title}
      </h1>
    </header>
  );
};

export default ArticleHeader;
