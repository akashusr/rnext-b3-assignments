import Button from "../ui/Button";
import PasswordInput from "../ui/PasswordInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "../../validations";
import { useMutation } from "@tanstack/react-query";
import api from "../../lib/api";
import { toast } from "react-toastify";
import { getActiveBars, getPasswordStrength } from "../../utils";
import { PasswordStrengthIndicator } from "../ui/PasswordStrengthIndicator";
import { useModal } from "../../stores/useModal";
import PasswordUpdatedDialog from "../dialog/PasswordUpdatedDialog";

const ChangePasswordForm = () => {
  const {
    handleSubmit,
    register,
    reset,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { openModal, isOpen } = useModal();

  const passwordValue = watch("newPassword");

  const strength = getPasswordStrength(passwordValue);
  const activeBars = getActiveBars(strength);

  const mutation = useMutation({
    mutationFn: (data) => {
      return api.patch("/users/me/password", data);
    },
    onSuccess: () => {
      openModal();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message);
    },
  });

  const onSubmit = async (values) => {
    mutation.mutate(values);
    reset();
  };

  if (isOpen) {
    return <PasswordUpdatedDialog />;
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg p-6 mb-6">
      <h2 className="font-medium text-lg mb-4">Change Password</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* <!-- Current Password --> */}
        <div className="mb-4">
          <PasswordInput
            label={"Current Password"}
            {...register("currentPassword")}
            error={errors.currentPassword?.message}
            placeholder="Enter your current password"
            className={"pr-10"}
          />
        </div>

        {/* <!-- New Password --> */}
        <div className="mb-4">
          <PasswordInput
            label={"New Password"}
            {...register("newPassword")}
            error={errors.newPassword?.message}
            placeholder="Enter new password"
            className={"pr-10"}
          />

          {/* <!-- Password Strength Indicator --> */}
          {passwordValue && (
            <PasswordStrengthIndicator activeBars={activeBars} />
          )}
          <p className="text-xs text-gray-500 mt-1 mb-3">
            For a strong password, use at least 8 characters with a mix of
            letters, numbers, and symbols.
          </p>
        </div>

        {/* <!-- Confirm New Password --> */}
        <div className="mb-4">
          <PasswordInput
            label={"Confirm New Password"}
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
            placeholder="Confirm New Password"
            className={"pr-10"}
          />
        </div>

        {/* <!-- Password Change Button --> */}
        <Button
          disabled={isSubmitting}
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition"
        >
          Change Password
        </Button>
      </form>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-800">
        <p className="text-xs text-gray-500 dark:text-slate-400">
          After changing your password, you'll be logged out of all devices
          except the ones you're using now.
        </p>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
