import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef } from "react";
import { GrEmoji, GrLocation } from "react-icons/gr";
import { HiOutlineUsers } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
import { postSchema } from "../../validations";
import { useForm } from "react-hook-form";
import useCurrentUser from "../../hooks/useCurrentUser";
import useFileUpload from "../../hooks/useFileUpload";
import Button from "../../components/ui/Button";
import { useMutation } from "@tanstack/react-query";
import api from "../../lib/api";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router";
import { useAvatar } from "../../hooks/useAvatar";

const CreatePost = () => {
  const user = useCurrentUser();
  const { getAvatar } = useAvatar();

  const { preview, handleFileSelect, file } = useFileUpload();
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const {
    register,
    watch,
    getValues,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      image: file,
      caption: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data) => {
      return api.post("posts", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      toast.success("Post created successfully");

      navigate("/");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message);
    },
  });

  const captionValue = watch("caption");

  const handleSubmit = () => {
    const data = {
      image: file,
      caption: getValues("caption"),
    };

    if (!data.image || !data.caption)
      return toast.error("Image & Caption is required.");

    mutation.mutate(data);
  };

  return (
    <>
      {/* <!-- Header --> */}
      <header className="h-14 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-4">
        <button className="p-1"></button>
        <h1 className="text-base font-semibold">Create new post</h1>
        <Button
          className="text-blue-500 font-semibold"
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          Post
        </Button>
      </header>

      {/* <!-- Main Content --> */}
      <div className="upload-container flex flex-col md:flex-row">
        {/* <!-- Left Side - Image Preview --> */}
        <div className="w-full md:w-1/2 bg-gray-100 dark:bg-slate-900 flex items-center justify-center relative">
          {preview && (
            <img src={preview} alt="Upload preview" className="image-preview" />
          )}

          {/* <!-- Tag People Button --> */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Button
              onClick={() => inputRef.current?.click()}
              className="bg-black/75 text-white text-sm py-1 px-3 rounded-md"
            >
              Click photo to upload
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

        {/* <!-- Right Side - Post Details --> */}
        <div className="w-full md:w-1/2 bg-white dark:bg-slate-950 flex flex-col">
          {/* <!-- User Info --> */}
          <Link
            to={"/profile"}
            className="flex items-center p-4 border-b border-gray-200 dark:border-slate-800"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300">
              <img
                src={getAvatar(user.avatar)}
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="ml-3 font-semibold text-sm">{user?.name}</span>
          </Link>

          {/* <!-- Caption Section --> */}
          <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex-grow">
            <div className="mb-2">
              <p className="font-medium text-base mb-2">Caption Section</p>
              <textarea
                className="w-full caption-input border-0 outline-none text-sm dark:placeholder:text-slate-400"
                placeholder="Write a caption..."
                {...register("caption")}
              />
            </div>

            {/* <!-- Character Count --> */}
            <div className="flex justify-between items-center">
              <button className="text-gray-400">
                <GrEmoji size={22} />
              </button>
              <span className="text-gray-400 text-xs">
                {captionValue?.length || 0}/2,200
              </span>
            </div>
          </div>

          {/* <!-- Additional Options --> */}
          <div className="flex flex-col">
            {/* <!-- Add Location --> */}
            <button className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-800">
              <span className="text-base text-gray-600 dark:text-slate-300">
                Add location
              </span>
              <GrLocation size={20} />
            </button>

            {/* <!-- Add Collaborators --> */}
            <button className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-800">
              <span className="text-base text-gray-600 dark:text-slate-300">
                Add collaborators
              </span>
              <HiOutlineUsers size={20} />
            </button>

            {/* <!-- Accessibility --> */}
            <button className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-800">
              <span className="text-base text-gray-600 dark:text-slate-300">
                Accessibility
              </span>
              <IoIosArrowDown size={20} />
            </button>

            {/* <!-- Advanced Settings --> */}
            <button className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-800">
              <span className="text-base text-gray-600 dark:text-slate-300">
                Advanced settings
              </span>
              <IoIosArrowDown size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
