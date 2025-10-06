import { Link } from "react-router";
import RegisterForm from "../components/auth/RegisterForm";

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-8 sm:px-6 lg:px-8">
      <div className="signup-container">
        {/* <!-- PhotoBooth Logo --> */}
        <div className="flex justify-center mb-4">
          <img src="/assets/logo-2.svg" alt="PhotoBooth" className="h-[51px]" />
        </div>

        {/* <!-- Sign Up Form --> */}
        <div className="bg-white dark:bg-slate-900 p-6 border border-gray-300 dark:border-slate-800 mb-3">
          {/* <!-- Headline --> */}
          <h2 className="text-center font-semibold text-gray-500 dark:text-slate-300 text-lg mb-4">
            Sign up to see photos and videos from your friends.
          </h2>

          <RegisterForm />
        </div>

        {/* <!-- Login Box --> */}
        <div className="bg-white dark:bg-slate-900 p-6 border border-gray-300 dark:border-slate-800 text-center mb-4 rounded-md">
          <p className="text-sm">
            Have an account?{" "}
            <Link to="/login" className="text-blue-500 font-semibold">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
