import Image from "next/image";
const ArticleDetailsHeader = ({ content }) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
        {content.title}
      </h1>

      <div className="flex items-center mb-6">
        <Image
          src={content.author.avatar}
          alt={content.author.name}
          className="h-12 w-12 rounded-full mr-4"
          width={20}
          height={20}
        />
        <div>
          <div className="flex items-center">
            <span className="font-medium mr-2">{content.author.name}</span>
            <button className="text-green-600 text-sm font-medium">
              Follow
            </button>
          </div>
          <div className="flex items-center text-gray-500 text-sm mt-1">
            <span>{content.date}</span>
            <span className="mx-1">·</span>
            <span className="bg-gray-100 px-2 py-1 rounded-full">
              {content.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailsHeader;
