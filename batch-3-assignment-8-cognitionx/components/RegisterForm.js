import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Sparkles,
  CheckCircle,
} from "lucide-react";

export default function RegisterForm({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const result = await register(
      formData.email,
      formData.password,
      formData.name,
    );

    if (result.success) {
      if (result.shouldRedirectToLogin) {
        // Show success message and redirect to login
        alert("Registration successful! Please login with your credentials.");
        onSwitchToLogin();
      }
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, text: "", color: "" };
    if (password.length < 6)
      return { strength: 25, text: "Weak", color: "bg-red-500" };
    if (password.length < 8)
      return { strength: 50, text: "Fair", color: "bg-yellow-500" };
    if (password.length < 12)
      return { strength: 75, text: "Good", color: "bg-blue-500" };
    return { strength: 100, text: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordsMatch =
    formData.confirmPassword && formData.password === formData.confirmPassword;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Glass morphism card */}
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-5 space-y-3">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg transform -rotate-3 hover:-rotate-6 transition-transform duration-300">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                Join CognitionX
              </h1>
              <p className="text-emerald-200/80 text-sm">
                Create your account and start your AI journey
              </p>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 backdrop-blur-sm rounded-xl p-2.5 text-red-200 text-sm animate-shake">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></div>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-emerald-200">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-emerald-300 group-focus-within:text-emerald-200 transition-colors" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent backdrop-blur-sm text-white placeholder-emerald-300/50 transition-all duration-300 hover:bg-white/10 text-sm"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-emerald-200">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-emerald-300 group-focus-within:text-emerald-200 transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent backdrop-blur-sm text-white placeholder-emerald-300/50 transition-all duration-300 hover:bg-white/10 text-sm"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-emerald-200">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-emerald-300 group-focus-within:text-emerald-200 transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent backdrop-blur-sm text-white placeholder-emerald-300/50 transition-all duration-300 hover:bg-white/10 text-sm"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-emerald-300 hover:text-emerald-200 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Password strength indicator */}
              {formData.password && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-emerald-200/60">
                    <span>Password strength</span>
                    <span
                      className={`font-medium ${passwordStrength.strength >= 75 ? "text-green-400" : passwordStrength.strength >= 50 ? "text-yellow-400" : "text-red-400"}`}
                    >
                      {passwordStrength.text}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-emerald-200">
                Confirm Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-emerald-300 group-focus-within:text-emerald-200 transition-colors" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="w-full pl-10 pr-14 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent backdrop-blur-sm text-white placeholder-emerald-300/50 transition-all duration-300 hover:bg-white/10 text-sm"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
                  {passwordsMatch && (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  )}
                  <button
                    type="button"
                    className="text-emerald-300 hover:text-emerald-200 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <span>Create Account</span>
                  <Sparkles className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-emerald-200">
                  Already have an account?
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onSwitchToLogin}
              className="w-full py-2.5 px-6 border-2 border-white/20 hover:border-white/40 text-white font-medium rounded-xl backdrop-blur-sm transition-all duration-300 hover:bg-white/5 hover:scale-105"
            >
              Sign In Instead
            </button>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full blur-md opacity-60 animate-float"></div>
        <div className="absolute -bottom-6 -right-6 w-8 h-8 bg-gradient-to-r from-violet-400 to-purple-500 rounded-full blur-sm opacity-60 animate-float animation-delay-1000"></div>
      </div>
    </div>
  );
}
