import PostGrid from "../../components/posts/PostGrid";
import AddComment from "../../components/comments/AddComment";
import PostActions from "../../components/posts/PostActions";
import Comments from "../../components/comments/Comments";
import PostHeader from "../../components/posts/PostHeader";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchPostById, fetchPostByUserId } from "../../queries/posts";
import Sidebar from "../../components/shared/Sidebar";
import Loader from "../../components/ui/Loader";
import ErrorMessage from "../../components/ui/ErrorMessage";

const PostDetails = () => {
  const { postId } = useParams();

  const {
    data: post,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: fetchPostById,
    retry: false,
  });

  const {
    data: userData,
    isLoading: isUserPostsLoading,
    isError: isUserPostsError,
  } = useQuery({
    queryKey: ["user-posts", post?.userId],
    queryFn: fetchPostByUserId,
    enabled: !!post?.userId, // Only run this query if userId is available
    retry: false,
  });

  if (isLoading || isUserPostsLoading) {
    return <Loader />;
  }

  if (isError || isUserPostsError) {
    return <ErrorMessage message={error?.message} />;
  }

  return (
    <section>
      <Sidebar />
      <div className="max-w-6xl w-full py-10 ml-[var(--sidebar-width)] px-4">
        {/* <!-- Post Details Section --> */}
        <div className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-sm overflow-hidden mb-8 mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row">
            {/* <!-- Left Side - Post Image --> */}
            <div className="w-full md:w-1/2 bg-slate-950 flex items-center">
              <img
                src={`${import.meta.env.VITE_SERVER_BASE_URL}/${post?.image}`}
                alt="Post image"
                className="w-full post-image"
              />
            </div>

            {/* <!-- Right Side - Post Info and Comments --> */}
            <div className="w-full md:w-1/2 flex flex-col">
              <PostHeader user={post?.user} />

              <div className="p-3">
                <p className="text-sm ">{post?.caption}</p>
              </div>

              <Comments comments={post?.comments} />
              <PostActions post={post} />
              <AddComment postId={post?._id} wrapClass={"p-3"} />
            </div>
          </div>
        </div>

        {/* <!-- More Posts Section --> */}
        <div className="mb-8 mx-auto max-w-5xl">
          <h2 className="text-sm text-gray-500 dark:text-slate-400 font-normal mb-4">
            More posts from{" "}
            <span className="font-semibold text-black dark:text-slate-200">
              {post?.user?.name}
            </span>
          </h2>

          <PostGrid
            posts={userData?.posts?.filter((p) => p._id !== post._id)}
          />
        </div>
      </div>
    </section>
  );
};

export default PostDetails;
