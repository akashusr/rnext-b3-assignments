import { useForm } from "react-hook-form";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../../validations";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useModal } from "../../stores/useModal";
import AccountCreatedDialog from "../dialog/AccountCreatedDialog";
import { useAuth } from "../../stores/useAuth";
import PasswordInput from "../ui/PasswordInput";
import useSocialLogin from "../../hooks/useSocialLogin";

const RegisterForm = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { handleGoogleLogin } = useSocialLogin();

  const { isOpen, openModal } = useModal((state) => state);
  const { setToken, setUser } = useAuth((state) => state);

  const mutation = useMutation({
    mutationFn: (data) => {
      return axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/auth/signup`,
        data
      );
    },
    onSuccess: (data) => {
      const { accessToken, refreshToken, user } = data.data;

      if (accessToken) {
        setToken({ accessToken, refreshToken });
        setUser(user);
      }
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

  if (mutation.isSuccess && isOpen) {
    return <AccountCreatedDialog />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      {/*  <!-- Email/Phone Field --> */}
      <div className="mb-3">
        <div className="relative">
          <Input
            {...register("email")}
            error={errors.email?.message}
            placeholder="Email"
            aria-label="Email"
          />
        </div>
      </div>

      {/* <!-- Full Name Field --> */}
      <div className="mb-2">
        <div className="relative">
          <Input
            {...register("name")}
            error={errors.name?.message}
            placeholder="Full Name"
            aria-label="Full Name"
          />
        </div>
      </div>

      {/* <!-- Password Field --> */}
      <div className="mb-3">
        <div className="relative">
          <PasswordInput
            {...register("password")}
            error={errors.password?.message}
            placeholder="Enter password"
          />
        </div>
      </div>
      <div className="mb-3">
        <div className="relative">
          <PasswordInput
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
            placeholder="Confirm password"
          />
        </div>
      </div>

      {/* <!-- Login Button --> */}
      <div className="mb-4">
        <Button
          type="submit"
          className="login-button"
          disabled={isSubmitting || mutation.isPending}
        >
          Sign up
        </Button>
      </div>

      {/* <!-- OR Separator --> */}
      <div className="or-separator">OR</div>

      <div className="mb-4">
        <Button
          type="button"
          onClick={handleGoogleLogin}
          className="login-button"
        >
          Sign up with Google
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;
