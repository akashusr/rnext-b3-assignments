import Button from "../ui/Button";
import { IoBookmarkOutline, IoBookmark } from "react-icons/io5";
import { useSavedPosts } from "../../stores/useSavedPosts";
import useCurrentUser from "../../hooks/useCurrentUser";
import { toast } from "react-toastify";

const PostSaveButton = ({ post }) => {
  const user = useCurrentUser();
  const { getUserSavedPosts, savePost, removeSavedPost } = useSavedPosts(
    (state) => state
  );

  const posts = getUserSavedPosts(user?._id);

  const toggleSave = (post) => {
    if (!user) {
      return toast.error("Login is required to save post.");
    }

    const isSaved = posts.find((p) => p._id === post._id);

    if (isSaved) {
      removeSavedPost(user?._id, post._id);
      toast.success("Post unsaved");
    } else {
      savePost(user?._id, post);
      toast.success("Post has been saved");
    }
  };

  return (
    <Button onClick={() => toggleSave(post)}>
      {posts?.find((p) => p._id === post._id) ? (
        <IoBookmark size={20} color="#e95886" />
      ) : (
        <IoBookmarkOutline size={20} />
      )}
    </Button>
  );
};

export default PostSaveButton;
