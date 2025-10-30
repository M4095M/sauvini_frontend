"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import Button from "@/components/ui/button";
import FormInput from "@/components/input/FormInput";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useLanguage } from "@/hooks/useLanguage";
import { RTL_LANGUAGES } from "@/lib/language";
import { useAuth } from "@/hooks/useAuth";
import { AuthErrorBoundary } from "@/components/auth/AuthErrorBoundary";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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

export default function LoginPageEnhanced() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginError>({});

  const { t, language } = useLanguage();
  const {
    login,
    isAuthenticated,
    isLoading: authLoading,
    error: authError,
  } = useAuth();
  const isRTL = RTL_LANGUAGES.includes(language);

  // Redirect if already authenticated
  useEffect(() => {
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

    setErrors({});

    try {
      console.log("📡 Attempting login...");

      // Use the enhanced auth context
      const success = await login(formData.email, formData.password);

      if (success) {
        console.log("✅ Login successful! Redirecting...");

        // Check for return URL
        const urlParams = new URLSearchParams(window.location.search);
        const returnUrl = urlParams.get("returnUrl");

        // Redirect to return URL or home page
        window.location.href = returnUrl || "/";
      } else {
        console.log("❌ Login failed");
        setErrors({
          general:
            "Invalid email or password. Please check your credentials and try again.",
        });
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      setErrors({
        general:
          error instanceof Error
            ? error.message
            : "Login failed. Please try again.",
      });
    }
  };

  // ===========================================
  // RENDER
  // ===========================================

  // Show loading spinner while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Checking authentication..." />
      </div>
    );
  }

  return (
    <AuthErrorBoundary>
      {/* DESKTOP Layout */}
      <div className="hidden lg:flex h-screen w-full overflow-hidden">
        {/* Login Panel */}
        <div
          className={`flex flex-col justify-center items-center relative z-10 bg-white dark:bg-gray-950 p-12 ${
            isRTL ? "order-2" : "order-1"
          }`}
          style={{
            width: "868px",
            clipPath: isRTL
              ? "polygon(0 0, 100% 0, 85% 100%, 0% 100%)"
              : "polygon(0 0, 100% 0, 100% 100%, 15% 100%)",
          }}
        >
          {/* Language Switcher */}
          <div
            className="absolute z-20"
            style={{
              top: "24px",
              ...(isRTL ? { right: "24px" } : { left: "24px" }),
            }}
          >
            <LanguageSwitcher className="flex items-center gap-2" />
          </div>

          {/* Logo */}
          <div
            className="absolute"
            style={{
              top: "101px",
              left: isRTL ? undefined : "101px",
              right: isRTL ? "101px" : undefined,
            }}
          >
            <Image
              src="/S_logo.svg"
              alt="Logo"
              width={84}
              height={84}
              className="block dark:hidden"
            />
            <Image
              src="/S_logo_white.svg"
              alt="Logo"
              width={84}
              height={84}
              className="hidden dark:block"
            />
          </div>

          {/* Welcome */}
          <div
            className="absolute text-left"
            style={{
              width: "353px",
              height: "353px",
              top: "260px",
              left: isRTL ? undefined : "101px",
              right: isRTL ? "101px" : undefined,
            }}
          >
            <h1
              className={`text-4xl font-bold text-gray-900 dark:text-white ${
                isRTL ? "font-arabic" : "font-sans"
              }`}
            >
              {t("auth.login.title")}
            </h1>
            <p
              className={`text-gray-600 dark:text-gray-300 text-lg ${
                isRTL ? "font-arabic" : "font-sans"
              }`}
            >
              {t("auth.login.subtitle")}
            </p>
          </div>

          {/* Form Container */}
          <div
            className="absolute"
            style={{
              width: "390px",
              height: "353px",
              top: "260px",
              left: isRTL ? undefined : "101px",
              right: isRTL ? "101px" : undefined,
            }}
          >
            <form
              onSubmit={handleLogin}
              className="flex flex-col"
              style={{ gap: "6px" }}
            >
              {/* General Error */}
              {(errors.general || authError) && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {errors.general || authError}
                  </AlertDescription>
                </Alert>
              )}

              {/* Email */}
              <div className="mb-4">
                <FormInput
                  label={t("auth.login.email")}
                  value={formData.email}
                  type="email"
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  error={errors.email}
                />
              </div>

              {/* Password */}
              <div className="mb-4">
                <FormInput
                  label={t("auth.login.password")}
                  value={formData.password}
                  type={showPassword ? "text" : "password"}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  error={errors.password}
                />
              </div>

              {/* Forgot password link */}
              <div className={`mb-6 ${isRTL ? "text-left" : "text-right"}`}>
                <Link
                  href="/auth/forgot-password"
                  className={`text-sm font-medium text-[var(--primary-300)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-500)] rounded ${
                    isRTL ? "font-arabic" : "font-sans"
                  }`}
                >
                  {t("auth.login.forgotPassword")}
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                {authLoading
                  ? t("auth.login.loggingIn")
                  : t("auth.login.loginButton")}
              </button>

              {/* Sign up */}
              <div className="text-center">
                <span
                  className={`text-gray-600 dark:text-gray-300 ${
                    isRTL ? "font-arabic" : "font-sans"
                  }`}
                >
                  {t("auth.login.noAccount")}
                </span>
                <Link
                  href="/register"
                  className={`font-medium text-[var(--primary-300)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-500)] rounded ${
                    isRTL ? "font-arabic" : "font-sans"
                  }`}
                >
                  {t("auth.login.signUp")}
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Branding Panel */}
        <div
          className={`flex flex-col justify-center items-center text-white relative overflow-hidden ${
            isRTL ? "order-1" : "order-2"
          }`}
          style={{
            width: "572px",
            backgroundImage: "url('/login_bg.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            ...(isRTL
              ? { borderTopLeftRadius: "64px", borderBottomLeftRadius: "64px" }
              : {
                  borderTopRightRadius: "64px",
                  borderBottomRightRadius: "64px",
                }),
          }}
        >
          {/* Language Switcher */}
          <div
            className="absolute z-20"
            style={{
              top: "24px",
              ...(isRTL ? { left: "24px" } : { right: "24px" }),
            }}
          >
            <LanguageSwitcher className="flex items-center gap-2" />
          </div>

          <Image
            src="/S_logo_white.svg"
            alt="Logo"
            width={128}
            height={128}
            className="mb-8"
          />
          <p
            className={`text-xl lg:text-2xl text-blue-100 mb-12 font-light max-w-md mx-auto ${
              isRTL ? "font-arabic" : "font-sans"
            }`}
          >
            {t("auth.login.tagline")}
          </p>
        </div>
      </div>

      {/* MOBILE Layout */}
      <div className="lg:hidden flex flex-col min-h-screen bg-white dark:bg-gray-950">
        <div className="px-5 sm:px-6 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/S_logo.svg"
              alt="Logo"
              width={32}
              height={32}
              className="block dark:hidden"
            />
            <Image
              src="/S_logo_white.svg"
              alt="Logo"
              width={32}
              height={32}
              className="hidden dark:block"
            />
          </div>
          <LanguageSwitcher className="flex items-center gap-2 scale-90 sm:scale-100" />
        </div>

        {/* Welcome */}
        <div className="px-5 sm:px-6 mt-9 sm:mt-10 text-left sm:text-center">
          <h1
            className={`text-3xl font-bold text-gray-900 dark:text-white mb-3 ${
              isRTL ? "font-arabic" : "font-sans"
            }`}
          >
            {t("auth.login.title")}
          </h1>
          <p
            className={`text-gray-600 dark:text-gray-300 text-base sm:text-lg ${
              isRTL ? "font-arabic" : "font-sans"
            }`}
          >
            {t("auth.login.subtitle")}
          </p>
        </div>

        {/* Form */}
        <div className="px-5 sm:px-6 mt-10 sm:mt-12 sm:max-w-md sm:mx-auto">
          <form onSubmit={handleLogin} className="space-y-8 sm:space-y-9">
            {/* General Error */}
            {(errors.general || authError) && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {errors.general || authError}
                </AlertDescription>
              </Alert>
            )}

            <div>
              <FormInput
                label={t("auth.login.email")}
                value={formData.email}
                type="email"
                onChange={(e) => handleInputChange("email", e.target.value)}
                error={errors.email}
              />
            </div>
            <div>
              <FormInput
                label={t("auth.login.password")}
                value={formData.password}
                type={showPassword ? "text" : "password"}
                onChange={(e) => handleInputChange("password", e.target.value)}
                error={errors.password}
              />
            </div>
            <div style={{ textAlign: isRTL ? "right" : "left" }}>
              <Link
                href="/auth/forgot-password"
                className={`text-sm font-medium text-[var(--primary-300)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-500)] rounded ${
                  isRTL ? "font-arabic" : "font-sans"
                }`}
              >
                {t("auth.login.forgotPassword")}
              </Link>
            </div>
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              {authLoading
                ? t("auth.login.loggingIn")
                : t("auth.login.loginButton")}
            </button>

            {/* Sign up */}
            <div className="text-center">
              <span
                className={`text-gray-600 dark:text-gray-300 ${
                  isRTL ? "font-arabic" : "font-sans"
                }`}
              >
                {t("auth.login.noAccount")}
              </span>
              <Link
                href="/register"
                className={`font-medium text-[var(--primary-300)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-500)] rounded ${
                  isRTL ? "font-arabic" : "font-sans"
                }`}
              >
                {t("auth.login.signUp")}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </AuthErrorBoundary>
  );
}
