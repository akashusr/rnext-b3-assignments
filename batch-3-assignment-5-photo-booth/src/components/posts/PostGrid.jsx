import { Link } from "react-router";

const PostGrid = ({ posts }) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {posts?.length === 0 ? (
          <p className="text-gray-500 dark:text-slate-400">
            No posts available.
          </p>
        ) : (
          posts.map((post) => (
            <Link to={`/posts/${post._id}`} key={post._id}>
              <div className="relative">
                <img
                  src={`${import.meta.env.VITE_SERVER_BASE_URL}/${post.image}`}
                  alt="Grid image"
                  className="w-full grid-image"
                />
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  );
};

export default PostGrid;
