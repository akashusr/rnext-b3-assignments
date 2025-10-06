import Button from "../ui/Button";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";
import { toast } from "react-toastify";
import useCurrentUser from "../../hooks/useCurrentUser";
import { useModal } from "../../stores/useModal";

const LikeButton = ({ className, post, queryKey = ["posts"] }) => {
  const user = useCurrentUser();
  const queryClient = useQueryClient();
  const { openModal, setAuthError } = useModal();
  const mutation = useMutation({
    mutationFn: (postId) => {
      return api.post(`/posts/${postId}/like`);
    },
    onSuccess: (data) => {
      console.log(data?.data?.message);
    },
    onError: (error) => {
      if (error.response?.status === 401 || error.response?.status === 400) {
        setAuthError("Authentication is required", "login");
        return openModal();
      }
      toast.error("Failed to like the post. Please try again.");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKey }),
  });

  const handleLike = () => {
    mutation.mutate(post._id);
  };

  const isLiked = post.likes.some((like) => like._id === user?._id);

  return (
    <Button className={className} onClick={handleLike}>
      {isLiked ? (
        <FaHeart size={20} color="#e95886" />
      ) : (
        <FaRegHeart size={20} />
      )}
    </Button>
  );
};

export default LikeButton;
