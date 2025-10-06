import { useForm } from "react-hook-form";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../validations";
import { cn } from "../../lib/utils";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../stores/useAuth";
import { useNavigate } from "react-router";
import useSocialLogin from "../../hooks/useSocialLogin";
import { useGlobalStore } from "../../stores/useGlobalStore";

const LoginForm = ({ onLoginSuccess }) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting, errors },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleGoogleLogin } = useSocialLogin();

  const { setToken, setUser } = useAuth((state) => state);
  const { setUser: setUserProfile } = useGlobalStore((state) => state);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data) => {
      return axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/auth/login`,
        data
      );
    },
    onSuccess: (data) => {
      const { accessToken, refreshToken, user } = data.data;

      if (accessToken) {
        setUserProfile(null);
        setToken({ accessToken, refreshToken });
        setUser(user);
        if (onLoginSuccess) {
          onLoginSuccess();
        }
        navigate("/");
      }
    },
    onError: (err) => {
      setError("root.random", {
        type: "random",
        message: err?.response?.data?.message,
      });
    },
  });

  const onSubmit = async (values) => {
    mutation.mutate(values);

    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      {/* <!-- Username/Email Field --> */}
      <div className="mb-3">
        <div className="relative">
          <Input
            {...register("email")}
            error={errors.email?.message}
            placeholder="Enter your email"
            aria-label="Email"
          />
        </div>
      </div>

      {/* <!-- Password Field --> */}
      <div className="mb-3">
        <div className="relative">
          <Input
            {...register("password")}
            error={errors.password?.message}
            type="password"
            placeholder="Password"
            aria-label="Password"
          />
          <Button
            className={cn(
              "absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-slate-400 text-xs",
              errors.password?.message && "-top-5"
            )}
          >
            Show
          </Button>
        </div>
      </div>

      {errors?.root?.random?.message && (
        <p className="text-red-400 bg-red-50 text-sm mb-3 p-2 rounded-md font-normal">
          {errors?.root?.random?.message}
        </p>
      )}

      {/* <!-- Login Button --> */}
      <div className="mb-4">
        <Button
          type="submit"
          className="login-button"
          disabled={isSubmitting || mutation.isPending}
        >
          Log in
        </Button>
      </div>

      {/* <!-- OR Separator --> */}
      <div className="or-separator">OR</div>

      <div className="mb-4">
        <Button
          type="button"
          className={"login-button"}
          onClick={handleGoogleLogin}
        >
          Log in with Google
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
