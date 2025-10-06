import { Link } from "react-router";
import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";
import ShareButton from "./ShareButton";
import { useAvatar } from "../../hooks/useAvatar";
import Button from "../ui/Button";
import { useState } from "react";
import { VscSend } from "react-icons/vsc";
import AddComment from "../comments/AddComment";
import { formatDate } from "../../utils";
import PostLikesCount from "./PostLikesCount";
import PostSaveButton from "./PostSaveButton";

const PostCard = ({ post }) => {
  const { avatarURL, getAvatar } = useAvatar(post);
  const [showMore, setShowMore] = useState(false);

  return (
    <article className="border-b border-gray-200 dark:border-slate-800 dark:bg-slate-900 pb-4 mb-4 max-w-[560px] mx-auto border rounded-md">
      {/* <!-- Post Header --> */}
      <div className="flex items-center p-3">
        <Link
          to={`/profile/${post.userId}`}
          className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-white text-xs"
        >
          <img src={avatarURL} className="w-full h-full object-cover" />
        </Link>
        <div className="ml-2">
          <Link
            to={`/profile/${post.userId}`}
            className="font-semibold text-sm"
          >
            {post.user?.name}
          </Link>
          <span className="text-gray-500 dark:text-slate-400 text-xs">
            {" "}
            • {formatDate(post.createdAt)}
          </span>
        </div>
      </div>

      {/* <!-- Post Image --> */}
      <div className="relative">
        <Link to={`/posts/${post._id}`}>
          <img
            src={`${import.meta.env.VITE_SERVER_BASE_URL}/${post.image}`}
            alt="Post image"
            className="w-full object-cover max-h-[1000px]"
          />
        </Link>
      </div>

      {/* <!-- Post Actions --> */}
      <div className="flex justify-between p-3">
        <div className="flex space-x-4">
          <LikeButton className={"like-button"} post={post} />
          <Link to={`/posts/${post._id}`}>
            <CommentButton />
          </Link>
        </div>
        <div className="flex space-x-4">
          <ShareButton post={post} />
          <PostSaveButton post={post} />
        </div>
      </div>

      {/* <!-- Likes --> */}
      {post.likesCount > 0 && (
        <div className="px-3">
          <div className="flex items-center">
            <div className="h-6 flex -space-x-2">
              {post.likes.map((like) => (
                <img
                  key={like._id}
                  src={getAvatar(like.avatar)}
                  alt="User avatar"
                  className="w-6 h-6 rounded-full"
                />
              ))}
            </div>
            <PostLikesCount post={post} />
          </div>
        </div>
      )}

      {/* <!-- Caption --> */}
      <div className="px-3 mt-2">
        <p className="text-sm">
          <span className="font-semibold">
            {showMore
              ? post.caption
              : post.caption.length > 65
              ? post.caption.substring(0, 65) + "..."
              : post.caption}
          </span>
          {/* <span className="caption-text"> #AD</span> */}
          {/* <span className="text-gray-500">... </span> */}
          {post.caption.length > 65 && (
            <Button
              className="text-gray-500 dark:text-slate-400 text-sm cursor-pointer ml-1"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? " show less" : "show more"}
            </Button>
          )}
        </p>
      </div>

      {/* <!-- Comments --> */}
      {post.commentsCount > 0 && (
        <div className="px-3 mt-1">
          <Link
            to={`/posts/${post._id}`}
            className="text-gray-500 dark:text-slate-400 text-sm"
          >
            View all {post.commentsCount}{" "}
            {post.commentsCount === 1 ? "comment" : "comments"}
          </Link>
        </div>
      )}

      {/* <!-- Add Comment --> */}
      <AddComment
        postId={post._id}
        showAvatar={false}
        icon={<VscSend />}
        wrapClass={"px-3 mt-2 flex justify-between items-center"}
        inputClass={"text-sm w-full outline-none"}
      />
    </article>
  );
};

export default PostCard;
