"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPaperPlane,
  faCheckCircle,
  faArrowAltCircleLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ResetPasswordFormModal = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok && data?.error) {
        setError(data.error);
      } else {
        setSent(true);
      }
    } catch (e) {
      setError("Request failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.replace("/login");
  };

  return (
    <div className="bg-white dark:bg-gray-800 py-6 px-5 shadow-xl rounded-2xl">
      <form className="space-y-5" onSubmit={handleSubmit} id="resetForm">
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
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="john@example.com"
            />
            <FontAwesomeIcon
              icon={faEnvelope}
              className="absolute left-3 top-3.5 text-gray-400"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white py-3 px-4 rounded-lg font-medium transition duration-200"
        >
          <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
          {loading ? "Sending..." : sent ? "Sent" : "Send Reset Link"}
        </button>

        {sent && (
          <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4">
            <div className="flex items-center">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-green-500 mr-3"
              />
              <div>
                <h4 className="text-green-800 dark:text-green-200 font-medium">
                  Email sent successfully!
                </h4>
                <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                  If that email exists, a reset link has been sent.
                </p>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
        )}
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={handleBackToLogin}
          className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
        >
          <FontAwesomeIcon icon={faArrowAltCircleLeft} className="mr-2" />
          Back to login
        </button>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?
          <Link
            href="/register"
            className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium ml-1"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordFormModal;
