import useCurrentUser from "../../hooks/useCurrentUser";
import Button from "../ui/Button";
import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "../../lib/api";
import { toast } from "react-toastify";
import { useGlobalStore } from "../../stores/useGlobalStore";
import useFileUpload from "../../hooks/useFileUpload";
import { useAvatar } from "../../hooks/useAvatar";

const UpdateAvatar = () => {
  const user = useCurrentUser();
  const inputRef = useRef(null);
  const { setUser } = useGlobalStore((state) => state);
  const { getAvatar } = useAvatar();

  const mutation = useMutation({
    mutationFn: (file) => {
      return api.patch(
        "/users/me/avatar",
        { avatar: file },
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    },
    onSuccess: (data) => {
      setPreview(null);
      setUser(data?.data?.user);
      toast.success(data?.data?.message || "Avatar updated successfully");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message);
    },
  });

  const { preview, handleFileSelect, setPreview } = useFileUpload(
    mutation.mutate
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg p-6 mb-6">
      <div className="flex items-center">
        <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
          <img
            src={
              preview ||
              (user?.avatar && getAvatar(user.avatar)) ||
              "/assets/avatar.svg"
            }
            alt={user?.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="font-semibold text-base">{user?.name}</h2>
          <p className="text-gray-500 dark:text-slate-400">
            {user?.username || "@devmuhib"}
          </p>
        </div>
        <Button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="ml-auto bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition"
        >
          Change photo
        </Button>
      </div>

      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
        ref={(e) => {
          inputRef.current = e;
        }}
      />
    </div>
  );
};

export default UpdateAvatar;
