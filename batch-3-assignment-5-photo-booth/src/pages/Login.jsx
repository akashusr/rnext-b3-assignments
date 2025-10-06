import { Link } from "react-router";
import LoginForm from "../components/auth/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="login-container rounded-md">
        {/* <!-- PhotoBooth Logo --> */}
        <div className="flex justify-center mb-8">
          <img src="/assets/logo.svg" alt="PhotoBooth" className="h-[51px]" />
        </div>

        {/* <!-- Login Form --> */}
        <div className="bg-white dark:bg-slate-900 p-6 border border-gray-300 dark:border-slate-800 mb-3 rounded-md">
          <LoginForm />
        </div>

        {/* <!-- Sign Up Box --> */}
        <div className="bg-white dark:bg-slate-900  p-6 border border-gray-300 dark:border-slate-800 text-center ">
          <p className="text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500 font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
