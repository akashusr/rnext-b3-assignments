"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const search = useSearchParams();
  const router = useRouter();
  const token = search.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed");
      } else {
        setDone(true);
        setTimeout(() => router.push("/login"), 2500);
      }
    } catch (e) {
      setError("Request failed");
    } finally {
      setLoading(false);
    }
  };

  if (!token)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Invalid reset link
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl space-y-6">
        <h1 className="text-2xl font-bold text-center">Reset Password</h1>
        {done ? (
          <div className="text-green-600 text-center">
            Password reset successful. Redirecting to login...
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border rounded-lg px-3 py-2"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="w-full border rounded-lg px-3 py-2"
                placeholder="••••••••"
              />
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white py-3 px-4 rounded-lg font-medium"
            >
              {loading ? "Saving..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
