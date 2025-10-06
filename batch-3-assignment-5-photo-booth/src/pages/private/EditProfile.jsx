import { IoIosArrowDown } from "react-icons/io";
import ChangePasswordForm from "../../components/profile/ChangePasswordForm";
import useCurrentUser from "../../hooks/useCurrentUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Button from "../../components/ui/Button";
import UpdateAvatar from "../../components/profile/UpdateAvatar";
import Input from "../../components/ui/Input";
import { useMutation } from "@tanstack/react-query";
import api from "../../lib/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { profileSchema } from "../../validations";

const EditProfile = () => {
  const user = useCurrentUser();
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      bio: user?.bio || "",
      website: user?.website || "",
      gender: user?.gender || "male",
    },
  });

  const bio = watch("bio");

  const mutation = useMutation({
    mutationFn: (data) => {
      return api.patch("/users/me", data);
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      navigate("/profile");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message);
    },
  });

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="bg-gray-50 dark:bg-slate-900/20">
      <div className="edit-container">
        <h1 className="text-2xl font-bold mb-8">Edit profile</h1>

        {/* <!-- Profile Picture Section --> */}
        <UpdateAvatar />

        {/* <!-- Website Section --> */}
        <div className="bg-white dark:bg-slate-900 rounded-lg p-6 mb-6">
          <Input
            label={"Website"}
            {...register("website")}
            error={errors.website?.message}
            placeholder="website url"
            aria-label="website url"
          />
          <p className="text-gray-500 mt-1 text-xs">
            Editing your links is only available on mobile. Visit the PhotoBooth
            app and edit your profile to change the websites in your bio.
          </p>
        </div>

        {/* <!-- Bio Section --> */}
        <div className="bg-white dark:bg-slate-900 rounded-lg p-6 mb-6">
          <label className="block mb-2 font-medium">Bio</label>
          <textarea
            className="form-input resize-none h-24 mb-1"
            {...register("bio")}
            defaultValue={user?.bio || ""}
          />

          <div className="flex justify-end">
            <span className="text-gray-500 text-xs">
              {bio?.length || 0} / 150
            </span>
          </div>
        </div>

        {/* <!-- Gender Section --> */}
        <div className="bg-white dark:bg-slate-900 rounded-lg p-6 mb-6">
          <label className="block mb-2 font-medium">Gender</label>
          <div className="relative">
            <select
              className="form-input appearance-none pr-8"
              {...register("gender")}
              defaultValue={user?.gender || "male"}
            >
              <option value={"male"}>Male</option>
              <option value={"female"}>Female</option>
              <option value={"prefer-not-to-say"}>Prefer not to say</option>
              <option value={"custom"}>Custom</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <IoIosArrowDown size={16} stroke="1" />
            </div>
          </div>
          <p className="text-gray-500 text-xs mt-2">
            This won't be part of your public profile.
          </p>
        </div>

        {/* <!-- Password Change Section --> */}

        <ChangePasswordForm />

        {/* <!-- Privacy Note --> */}
        <div className="mb-6">
          <p className="text-gray-500 dark:text-slate-400 text-sm">
            Certain profile info, like your name, bio and links, is visible to
            everyone.
            <a href="#" className="text-blue-500 dark:text-blue-400">
              See what profile info is visible
            </a>
          </p>
        </div>

        {/* <!-- Submit Button --> */}
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="bg-blue-100 dark:bg-slate-800 text-blue-500 dark:text-blue-400 px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-200 transition"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
