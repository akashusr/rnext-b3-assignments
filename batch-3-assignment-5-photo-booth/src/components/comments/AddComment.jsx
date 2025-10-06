import { GrEmoji } from "react-icons/gr";
import useCurrentUser from "../../hooks/useCurrentUser";
import { cn } from "../../lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";
import { useModal } from "../../stores/useModal";
import { toast } from "react-toastify";
import { commentSchema } from "../../validations";
import { useAvatar } from "../../hooks/useAvatar";

const AddComment = ({
  postId,
  showAvatar = true,
  icon,
  inputClass,
  wrapClass,
}) => {
  const user = useCurrentUser();
  const { getAvatar } = useAvatar();
  const { openModal, setAuthError } = useModal();
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      text: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data) => {
      return api.post(`posts/${postId}/comment`, data);
    },
    onSuccess: () => {
      toast.success("Comment posted successfully");
    },
    onError: (err) => {
      if (err.response?.status === 401 || err.response?.status === 400) {
        setAuthError("Authentication is required");
        return openModal();
      }
      toast.error(err?.response?.data?.message);
    },
    onSettled: () => queryClient.invalidateQueries(["post", postId]),
  });

  const onSubmit = (values) => {
    mutation.mutate(values);
    reset();
  };

  return (
    <div className={cn("flex items-center", wrapClass)}>
      {showAvatar && (
        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-300 mr-2">
          <img
            src={user?.avatar ? getAvatar(user.avatar) : "/assets/avatar.svg"}
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1">
        <div className="flex items-center justify-between">
          <input
            {...register("text")}
            error={errors.text?.message}
            placeholder="Add a comment..."
            className={cn(
              "text-sm w-full outline-none !border-none !bg-transparent !p-0 dark:placeholder:text-slate-400",
              inputClass
            )}
          />
          {icon ? icon : <GrEmoji size={20} />}
        </div>
        {errors?.text?.message && (
          <p className="text-xs text-red-400 mt-1">{errors?.text?.message}</p>
        )}
      </form>
    </div>
  );
};

export default AddComment;
