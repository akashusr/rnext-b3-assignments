import Image from "next/image";
const ArticleImage = ({ image, author }) => {
  return (
    <div className="mb-8">
      {image !== null ? (
        <Image
          src={image}
          alt={author}
          className="w-full h-auto
                    rounded-lg shadow-sm"
          width={220}
          height={220}
        />
      ) : (
        <div className="w-full h-64 flex items-center justify-center">
          <p className="text-red-600">Image broken...</p>
        </div>
      )}
    </div>
  );
};

export default ArticleImage;
