import { cn } from "../../lib/utils";
import { useModal } from "../../stores/useModal";

const PostLikesCount = ({ post, className }) => {
  const { openModal, setActivePost } = useModal();

  return (
    <p
      onClick={(e) => {
        e.stopPropagation();
        setActivePost(post);
        openModal();
      }}
      className={cn("text-sm ml-2 cursor-pointer", className)}
    >
      <span className="font-semibold">
        {post.likesCount} {post.likesCount === 1 ? "like" : "likes"}
      </span>
    </p>
  );
};

export default PostLikesCount;
