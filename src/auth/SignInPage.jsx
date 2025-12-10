import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Mail, Lock, Eye, EyeOff, Users } from "lucide-react";

// Validation Schema for Sign In
const signInSchema = yup
  .object({
    email: yup
      .string()
      .required("Email is required")
      .email("Enter a valid email address"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  })
  .required();

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signInSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Sign In Data:", data);
      alert("Signed in successfully!");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleGoogleSignIn = () => {
    alert("Google Sign In clicked!");
  };

  const goToRegister = () => {
    alert("Navigate to Register");
  };

  return (
    <div className="min-h-screen flex relative">
      {/* Background Image for Mobile/Tablet - Behind Form */}
      <div className="absolute inset-0 lg:hidden">
        {/* CRM Dashboard Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "30px 30px",
          }}
        ></div>

        {/* Dashboard Elements Mockup */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20 blur-sm">
          <div className="w-full max-w-4xl p-8 space-y-4">
            {/* Dashboard Cards */}
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 h-24"
                ></div>
              ))}
            </div>
            {/* Chart Area */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 h-48"></div>
            {/* Table Area */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 h-32"></div>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/50"></div>
      </div>

      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-12 relative z-10">
        <div className="w-full max-w-md md:max-w-lg bg-white/85 backdrop-blur-lg lg:bg-transparent rounded-2xl lg:rounded-none shadow-2xl lg:shadow-none p-6 sm:p-8 md:p-10 lg:p-0">
          {/* Logo/Brand */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-[#2f362f] rounded-full flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <span className="text-xl sm:text-2xl md:text-3xl font-bold text-[#2f362f]">
                ClientHub
              </span>
            </div>
            <p className="text-[#2f362f]/80 text-xs sm:text-sm md:text-base ml-0.5 sm:ml-1">
              Your Business Growth Partner
            </p>
          </div>

          {/* Welcome Text */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#2f362f] mb-1 sm:mb-2">
              WELCOME BACK
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-[#2f362f]/80">
              Welcome back! Please enter your details.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-3 sm:space-y-3.5 md:space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs sm:text-sm md:text-base font-semibold text-[#2f362f] mb-1.5 sm:mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 text-[#2f362f]" />
                <input
                  type="email"
                  {...register("email")}
                  placeholder="Enter your email"
                  className={`w-full pl-9 sm:pl-11 md:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 md:py-3 text-sm sm:text-base md:text-base border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#788978] focus:border-transparent transition-all bg-white/95 ${
                    errors.email ? "border-red-500" : "border-[#BCC8BC]"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[10px] sm:text-xs md:text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs sm:text-sm md:text-base font-semibold text-[#2f362f] mb-1.5 sm:mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 text-[#2f362f]" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••••"
                  className={`w-full pl-9 sm:pl-11 md:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 md:py-3 text-sm sm:text-base md:text-base border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#788978] focus:border-transparent transition-all bg-white/95 ${
                    errors.password ? "border-red-500" : "border-[#BCC8BC]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2f362f] hover:text-[#788978]"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[10px] sm:text-xs md:text-sm text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 md:w-4 md:h-4 border-2 border-[#BCC8BC] rounded focus:ring-2 focus:ring-[#788978] text-[#2f362f]"
                />
                <span className="text-xs sm:text-sm md:text-base text-[#2f362f]">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                className="text-xs sm:text-sm md:text-base font-semibold text-[#2f362f] hover:text-[#788978] transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="w-full bg-[#2f362f] text-white py-2.5 sm:py-3 md:py-3.5 rounded-lg text-sm sm:text-base md:text-lg font-semibold hover:opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#BCC8BC]"></div>
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm md:text-base">
                <span className="px-3 sm:px-4 bg-white/85 lg:bg-transparent text-[#2f362f]">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2 sm:gap-3 py-2.5 sm:py-3 md:py-3.5 text-sm sm:text-base md:text-lg border-2 border-[#BCC8BC] rounded-lg font-semibold text-[#2f362f] hover:bg-white/60 bg-white/95 transition-all"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center mt-4 sm:mt-6 text-xs sm:text-sm md:text-base text-[#2f362f]">
            Don't have an account?{" "}
            <button
              onClick={goToRegister}
              className="font-bold text-[#2f362f] hover:text-[#788978] transition-colors"
            >
              Sign up for free!
            </button>
          </p>
        </div>
      </div>

      {/* Right Side - Image (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#2f362f]">
        {/* CRM Dashboard Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "30px 30px",
          }}
        ></div>

        {/* Dashboard Elements Mockup */}
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="w-full max-w-3xl space-y-6">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="w-32 h-3 bg-white/30 rounded"></div>
                  <div className="w-24 h-2 bg-white/20 rounded"></div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg"></div>
                <div className="w-10 h-10 bg-white/20 rounded-lg"></div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
                >
                  <div className="w-16 h-3 bg-white/30 rounded mb-4"></div>
                  <div className="w-24 h-6 bg-gradient-to-r from-blue-400 to-indigo-500 rounded mb-2"></div>
                  <div className="w-20 h-2 bg-white/20 rounded"></div>
                </div>
              ))}
            </div>

            {/* Chart Area */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
              <div className="w-40 h-4 bg-white/30 rounded mb-6"></div>
              <div className="flex items-end justify-between h-40 gap-4">
                {[60, 80, 50, 90, 70, 85, 65, 95].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-blue-500 to-indigo-400 rounded-t"
                    style={{ height: `${h}%` }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Table Preview */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="w-full h-2 bg-white/30 rounded"></div>
                      <div className="w-3/4 h-2 bg-white/20 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      </div>
    </div>
  );
};

export default SignInPage;
