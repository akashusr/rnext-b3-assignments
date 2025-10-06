"use client";

import React, { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSeedling,
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();

  // Derive safe callback URL (same-site path only) once per render
  const callbackUrl = useMemo(() => {
    const raw = searchParams?.get("callbackUrl");
    if (!raw) return "/"; // default homepage
    try {
      // Only allow internal navigations (prevent open redirect)
      const decoded = decodeURIComponent(raw);
      if (decoded.startsWith("/")) return decoded;
    } catch (_) {}
    return "/";
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const togglePasswordVisibility = () => setShowPassword((p) => !p);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false, // we will manually redirect to preserve callbackUrl handling
      });
      if (result.error) {
        alert(`Error: ${result.error}`);
      } else {
        window.location.href = callbackUrl || "/";
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  const handleGoogleSignIn = () => {
    // Let NextAuth handle redirect, but pass along callbackUrl so user returns to originating page.
    signIn("google", { callbackUrl });
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-primary-500 p-3 rounded-full">
            <FontAwesomeIcon icon={faSeedling} className="text-white text-xl" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back
        </h2>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Sign in to your FarmFresh account
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 py-6 px-5 shadow-xl rounded-2xl">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="john@example.com"
              />
              <FontAwesomeIcon
                icon={faEnvelope}
                className="absolute left-3 top-3.5 text-gray-400"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="••••••••"
              />
              <FontAwesomeIcon
                icon={faLock}
                className="absolute left-3 top-3.5 text-gray-400"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  className="text-gray-400 hover:text-gray-600"
                />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                checked={formData.remember}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                Remember me
              </span>
            </label>
            <Link
              href="/forget-password"
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition duration-200"
          >
            Sign In
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>
        </form>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="mt-4 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition duration-200 flex items-center justify-center space-x-2"
        >
          <FontAwesomeIcon icon={faGoogle} className="text-red-500" />
          <span>Continue with Google</span>
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?
            <Link
              href="/register"
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              {" "}
              Create account
            </Link>
          </p>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
          Demo Accounts:
        </h3>
        <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
          <div>
            <strong>Customer:</strong> customer@demo.com / password123
          </div>
          <div>
            <strong>Farmer:</strong> farmer@demo.com / password123
          </div>
        </div>
      </div>
    </div>
  );
}
