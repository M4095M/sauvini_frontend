"use client";

import React, { useState } from "react";
import Link from "next/link";
import SimpleInput from "@/components/input/simpleInput";
import InputButton from "@/components/input/InputButton";
import Button from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { RTL_LANGUAGES } from "@/lib/language";
import { authApi } from "@/utils/api";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

// ===========================================
// TYPES
// ===========================================

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginError {
  email?: string;
  password?: string;
  general?: string;
}

// ===========================================
// MAIN COMPONENT
// ===========================================

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginError>({});

  const { t, language } = useLanguage();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const isRTL = RTL_LANGUAGES.includes(language);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && !authLoading) {
      // Check for return URL
      const urlParams = new URLSearchParams(window.location.search);
      const returnUrl = urlParams.get("returnUrl");
      window.location.href = returnUrl || "/";
    }
  }, [isAuthenticated, authLoading]);

  // ===========================================
  // FORM HANDLERS
  // ===========================================

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: LoginError = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("🚀 Login attempt started");

    if (!validateForm()) {
      console.log("❌ Form validation failed");
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      console.log("📡 Making API call to backend...");

      // Try different login methods
      let loginSuccess = false;
      let lastError = "";
      let userType = "";

      // Try student login first
      try {
        console.log("🔍 Trying student login...");
        const response = await authApi.loginStudent(
          formData.email,
          formData.password
        );
        if (response.success && response.data) {
          console.log("✅ Student login successful!");
          userType = "student";
          loginSuccess = true;

          // Store tokens in localStorage
          if (response.data.token) {
            localStorage.setItem(
              "auth_tokens",
              JSON.stringify(response.data.token)
            );
            localStorage.setItem(
              "user_data",
              JSON.stringify(response.data.user)
            );
          }
        } else {
          console.log("❌ Student login failed:", response.message);
          lastError = response.message || "Invalid student credentials";
        }
      } catch (error) {
        console.log("❌ Student login error:", error);
        lastError = "Student login failed";
      }

      // Try professor login if student failed
      if (!loginSuccess) {
        try {
          console.log("🔍 Trying professor login...");
          const response = await authApi.loginProfessor(
            formData.email,
            formData.password
          );
          if (response.success && response.data) {
            console.log("✅ Professor login successful!");
            userType = "professor";
            loginSuccess = true;

            // Store tokens in localStorage
            if (response.data.token) {
              localStorage.setItem(
                "auth_tokens",
                JSON.stringify(response.data.token)
              );
              localStorage.setItem(
                "user_data",
                JSON.stringify(response.data.user)
              );
            }
          } else {
            console.log("❌ Professor login failed:", response.message);
            lastError = response.message || "Invalid professor credentials";
          }
        } catch (error) {
          console.log("❌ Professor login error:", error);
          lastError = "Professor login failed";
        }
      }

      // Try admin login if others failed
      if (!loginSuccess) {
        try {
          console.log("🔍 Trying admin login...");
          const response = await authApi.loginAdmin(
            formData.email,
            formData.password
          );
          if (response.success && response.data) {
            console.log("✅ Admin login successful!");
            userType = "admin";
            loginSuccess = true;

            // Store tokens in localStorage
            if (response.data.token) {
              localStorage.setItem(
                "auth_tokens",
                JSON.stringify(response.data.token)
              );
              localStorage.setItem(
                "user_data",
                JSON.stringify(response.data.user)
              );
            }
          } else {
            console.log("❌ Admin login failed:", response.message);
            lastError = response.message || "Invalid admin credentials";
          }
        } catch (error) {
          console.log("❌ Admin login error:", error);
          lastError = "Admin login failed";
        }
      }

      if (loginSuccess) {
        console.log(`✅ ${userType} login successful! Redirecting...`);
        // Redirect to home page
        window.location.href = "/";
      } else {
        console.log("❌ All login attempts failed:", lastError);

        // Provide more specific error messages
        let errorMessage = "Login failed. Please check your credentials.";

        if (lastError.includes("not found")) {
          errorMessage =
            "No account found with this email address. Please check your email or sign up for a new account.";
        } else if (
          lastError.includes("Wrong credentials") ||
          lastError.includes("Invalid")
        ) {
          errorMessage =
            "Invalid email or password. Please check your credentials and try again.";
        } else if (
          lastError.includes("Network error") ||
          lastError.includes("connection")
        ) {
          errorMessage =
            "Network error. Please check your connection and try again.";
        } else if (lastError) {
          errorMessage = lastError;
        }

        setErrors({
          general: errorMessage,
        });
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      setErrors({
        general: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ===========================================
  // RENDER
  // ===========================================

  return (
    <div className="w-fit h-full p-10 flex flex-col justify-center items-center gap-10 mt-15">
      {/* Header */}
      <div className="flex flex-col justify-center items-center gap-2">
        <span className="font-semibold lg:text-4xl text-neutral-600 text-center text-2xl">
          {t("auth.login.title")}
        </span>
        <span className="font-medium lg:text-xl text-neutral-400 text-center text-base">
          {t("auth.login.subtitle")}
        </span>
      </div>

      {/* Form */}
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-6"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* General Error */}
        {errors.general && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-3xl text-center">
            {errors.general}
          </div>
        )}

        {/* Email */}
        <div className="w-full min-w-2xs shrink grow flex flex-col gap-2">
          <div className="font-work-sans text-neutral-600 font-normal px-4">
            {t("auth.login.email")}
          </div>
          <div className="flex flex-row w-full items-center border bg-white rounded-full overflow-hidden border-neutral-200 text-work-sans font-normal text-base relative">
            <div className="px-4 text-neutral-400 flex justify-center items-center">
              <Mail className="w-5 h-5" />
            </div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="appearance-none outline-none p-0 m-0 shadow-none bg-transparent border-none px-5 py-3 w-full text-work-sans font-normal text-base text-neutral-600"
              placeholder={t("auth.login.email")}
            />
          </div>
          {errors.email && (
            <div className="text-red-500 text-sm px-4">{errors.email}</div>
          )}
        </div>

        {/* Password */}
        <div className="w-full min-w-2xs shrink grow flex flex-col gap-2">
          <div className="font-work-sans text-neutral-600 font-normal px-4">
            {t("auth.login.password")}
          </div>
          <div className="flex flex-row w-full items-center border bg-white rounded-full overflow-hidden border-neutral-200 text-work-sans font-normal text-base relative">
            <div className="px-4 text-neutral-400 flex justify-center items-center">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="appearance-none outline-none p-0 m-0 shadow-none bg-transparent border-none px-5 py-3 w-full text-work-sans font-normal text-base text-neutral-600"
              placeholder={t("auth.login.password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="px-4 text-neutral-400 hover:text-primary-300 flex justify-center items-center transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <div className="text-red-500 text-sm px-4">{errors.password}</div>
          )}
        </div>

        {/* Forgot password link */}
        <div className={`text-right`}>
          <Link
            href="/auth/forgot-password"
            className="text-sm font-medium text-primary-300 hover:text-primary-400 transition-colors"
          >
            {t("auth.login.forgotPassword")}
          </Link>
        </div>

        {/* Login Button */}
        <Button
          state="filled"
          size="M"
          icon_position="none"
          text={
            isLoading ? t("auth.login.loggingIn") : t("auth.login.loginButton")
          }
          onClick={() => handleLogin(new Event("submit") as any)}
          disabled={isLoading}
        />

        {/* Sign up */}
        <div className="text-center">
          <span className="text-neutral-600">{t("auth.login.noAccount")}</span>
          <Link
            href="/register"
            className="font-medium text-primary-300 hover:text-primary-400 transition-colors ml-2"
          >
            {t("auth.login.signUp")}
          </Link>
        </div>
      </form>
    </div>
  );
}
