import Image from "next/image";
import Link from "next/link";
import BookmarkIcon from "./icons/BookmarkIcon";
import stripHtml from "@/utils/stripHtml";
const Article = ({ blog }) => {
  // here we parse the description remove all html tags

  const parsedDescription = stripHtml(blog.description);

  return (
    <article className="mb-10 pb-10 border-b border-gray-200">
      <div className="flex items-center mb-4">
        <Image
          src={blog.author.avatar}
          alt="Author"
          className="h-6 w-6 rounded-full mr-2"
          height={20}
          width={20}
        />
        <span className="text-sm font-medium">Sumit Saha</span>
      </div>
      <Link
        href={`/blog/${blog.title}`}
        className="text-xl font-bold mb-2 hover:underline cursor-pointer"
      >
        {blog.title}
      </Link>
      <p className="text-gray-700 mb-4">{parsedDescription.slice(0, 150)}</p>
      <div className="flex justify-between items-center">
        <div className="flex items-center text-gray-500 text-sm">
          <span>{blog.date}</span>
          <span className="mx-1">·</span>
          <span className="bg-gray-100 px-2 py-1 rounded-full">
            {blog.category}
          </span>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <BookmarkIcon />
        </button>
      </div>
    </article>
  );
};

export default Article;
