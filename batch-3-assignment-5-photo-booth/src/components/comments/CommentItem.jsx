import { formatDate } from "../../utils";
import { HiCheck, HiDotsVertical } from "react-icons/hi";
import Button from "../ui/Button";
import { useEffect } from "react";
import useCurrentUser from "../../hooks/useCurrentUser";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema } from "../../validations";
import { motion, AnimatePresence } from "motion/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "../../lib/api";
import { Link } from "react-router";
import { useAvatar } from "../../hooks/useAvatar";

const CommentItem = ({
  comment,
  selectedCommentId,
  setSelectedCommentId,
  editCommentId,
  setEditCommentId,
}) => {
  const user = useCurrentUser();
  const queryClient = useQueryClient();
  const { getAvatar } = useAvatar();

  const isMe = comment.userId === user?._id;
  const showPopover = selectedCommentId === comment?._id;
  const isEditing = editCommentId === comment?._id;

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      text: comment?.text || "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data) => {
      return api.patch(`/posts/comment/${comment?._id}`, data);
    },
    onSuccess: () => {
      toast.success("Comment updated successfully");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message);
    },
    onSettled: () => queryClient.invalidateQueries(["post", comment.postId]),
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId) => {
      return api.delete(`/posts/comment/${commentId}`);
    },
    onSuccess: () => {
      toast.success("Comment deleted");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message);
    },
    onSettled: () => queryClient.invalidateQueries(["post", comment.postId]),
  });

  useEffect(() => {
    // Update form input when switching edit comment
    if (editCommentId === comment?._id) {
      reset({ text: comment.text });
    }
  }, [editCommentId, comment, reset]);

  const onSubmit = (values) => {
    mutation.mutate(values);
    setEditCommentId(null); // close edit mode after submit
    reset();
  };

  const handleDeleteComment = (commentId) => {
    deleteMutation.mutate(commentId);
  };

  return (
    <div className="flex mb-4">
      <Link to={`/profile/${comment.user._id}`}>
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-r mr-2">
          <div className="w-full h-full rounded-full overflow-hidden bg-white p-[1px] mr-2">
            <img
              src={getAvatar(comment?.user?.avatar)}
              alt={comment?.user?.name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
      </Link>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to={`/profile/${comment.user._id}`}>
              <span className="font-semibold text-sm">
                {comment?.user?.name}
              </span>
            </Link>
            <span className="text-xs text-gray-500 dark:text-slate-400 ml-2">
              {formatDate(comment?.createdAt)}
            </span>
          </div>
          <div className="relative">
            {isMe && (
              <Button
                onClick={() =>
                  setSelectedCommentId(showPopover ? null : comment._id)
                }
              >
                <HiDotsVertical />
              </Button>
            )}

            <AnimatePresence>
              {isMe && showPopover && (
                <motion.div
                  key="popover"
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-3 right-4 z-20 w-max h-auto p-3 rounded-md bg-white dark:bg-slate-800 shadow-md flex flex-col items-start gap-2"
                >
                  <Button
                    onClick={() => {
                      setEditCommentId(comment._id);
                      setSelectedCommentId(null);
                    }}
                    className="text-sm"
                  >
                    Edit
                  </Button>
                  <Button
                    className="text-sm"
                    onClick={() => handleDeleteComment(comment?._id)}
                  >
                    Delete
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {!isEditing && (
          <p className="text-sm mt-2 text-gray-800 dark:text-slate-300">
            {comment?.text}
          </p>
        )}

        {isMe && isEditing && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center gap-2 max-w-2/3">
              <input {...register("text")} className="form-input flex-1" />
              <Button type="submit">
                <HiCheck />
              </Button>
            </div>
            {errors?.text?.message && (
              <p className="text-xs text-red-400 mt-1">
                {errors?.text?.message}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
