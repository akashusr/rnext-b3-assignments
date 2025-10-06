import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";
import ShareButton from "./ShareButton";
import { formatDate } from "../../utils";
import PostLikesCount from "./PostLikesCount";
import PostSaveButton from "./PostSaveButton";

const PostActions = ({ post }) => {
  return (
    <div className="p-3 border-b border-gray-200 dark:border-slate-800">
      <div className="flex justify-between mb-2">
        <div className="flex space-x-4">
          <LikeButton post={post} queryKey={["post", post._id]} />
          <CommentButton />
          <ShareButton post={post} />
        </div>
        <PostSaveButton post={post} />
      </div>

      {/* <!-- Likes --> */}
      <div className="mb-1">
        <PostLikesCount post={post} className={"ml-0"} />
      </div>

      {/* <!-- Post Time --> */}
      <div className="mb-2">
        <p className="text-xs text-gray-500 dark:text-slate-400">
          {formatDate(post.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default PostActions;
