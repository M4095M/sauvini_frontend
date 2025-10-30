"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, BookOpen, ChevronLeft } from "lucide-react";
import Button from "@/components/ui/button";
import SimpleInput from "@/components/input/simpleInput";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useLanguage } from "@/hooks/useLanguage";
import { RTL_LANGUAGES } from "@/lib/language";
import { useForm } from "@/hooks/useForm";
import { LoginRequest } from "@/api";
import { FormErrors } from "@/types/api";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams, useRouter } from "next/navigation";

export default function ProfessorLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { t, language } = useLanguage();
  const isRTL = RTL_LANGUAGES.includes(language);
  const searchParams = useSearchParams();

  const { loginProfessor } = useAuth();

  // Check for verification success
  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      setSuccessMessage("Email verified successfully! You can now log in.");
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
    if (searchParams.get("reset") === "success") {
      setSuccessMessage(
        "Password reset successfully! You can now log in with your new password."
      );
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const formDataRef = useRef<Partial<LoginRequest>>({});
  const router = useRouter();

  const handleLogin = async () => {
    const values = getValues();

    setIsLoading(true);

    try {
      console.log("🔐 Logging in professor with:", values.email);
      await loginProfessor(values.email || "", values.password || "");

      console.log("✅ Professor login successful");
      // Redirect to professor profile
      router.push("/professor/profile");
    } catch (error: any) {
      console.error("❌ Professor login failed:", error);
      const errorMessage =
        error?.message ||
        t("auth.login.errors.invalid_credentials") ||
        "Invalid email or password";
      setErrors({ email: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const { register, getValues, setErrors, errors } = useForm<LoginRequest>(
    {} as any
  );

  return (
    <>
      {/* DESKTOP Layout */}
      <div
        className={[
          "hidden lg:block overflow-hidden shadow-2xl",
          "bg-[var(--neutral-100)] dark:bg-[var(--Surface-Level-2,_#1A1A1A)]",
        ].join(" ")}
        style={{
          width: "1200px",
          height: "700px",
          borderRadius: "80px",
          border: "4px solid var(--primary-300)",
          position: "relative",
        }}
      >
        {successMessage && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-4 py-2 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Inner Container */}
        <div
          className="flex justify-between"
          style={{
            width: "1160px",
            height: "660px",
            position: "absolute",
            top: "20px",
            left: "20px",
            direction: "ltr",
          }}
        >
          {/* Login Form Panel */}
          <div
            className={`relative ${isRTL ? "order-2" : "order-1"}`}
            style={{
              width: "592px",
              height: "660px",
            }}
          >
            {/* Back to Home */}
            <Link
              href="/"
              className="absolute flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:opacity-80"
              style={{
                top: "48px",
                ...(isRTL ? { right: "48px" } : { left: "48px" }),
              }}
            >
              <ChevronLeft className="w-5 h-5" />
              <span
                className={`text-sm ${isRTL ? "font-arabic" : "font-sans"}`}
              >
                {t("common.back") || "Back"}
              </span>
            </Link>

            {/* S Logo */}
            <div
              className="absolute flex items-center justify-center"
              style={{
                width: "48px",
                height: "48px",
                top: "100px",
                ...(isRTL ? { right: "48px" } : { left: "48px" }),
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

            {/* Role Indicator */}
            <div
              className="absolute flex justify-center"
              style={{
                width: "390px",
                top: "140px",
                left: isRTL ? undefined : "101px",
                right: isRTL ? "101px" : undefined,
              }}
            >
              <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  {t("auth.login.professorLogin") || "Professor Login"}
                </span>
              </div>
            </div>

            {/* Welcome Section */}
            <div
              className="absolute flex flex-col items-center text-center"
              style={{
                width: "390px",
                top: "200px",
                left: isRTL ? undefined : "101px",
                right: isRTL ? "101px" : undefined,
                gap: "8px",
              }}
            >
              <h1
                className={`text-4xl font-bold text-gray-900 dark:text-white mb-2 ${
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
              className="absolute flex flex-col items-center"
              style={{
                width: "390px",
                top: "300px",
                left: isRTL ? undefined : "101px",
                right: isRTL ? "101px" : undefined,
              }}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
                className="flex flex-col"
                style={{ gap: "6px" }}
              >
                {/* Email */}
                <div className="mb-4">
                  <SimpleInput
                    label={t("auth.login.email")}
                    type="email"
                    {...register("email")}
                    errors={errors.email}
                  />
                </div>

                {/* Password */}
                <div className="mb-4">
                  <SimpleInput
                    label={t("auth.login.password")}
                    type="password"
                    {...register("password")}
                    errors={errors.password}
                  />
                </div>

                {/* Forgot password link */}
                <div
                  className={`text-right ${
                    isRTL ? "font-arabic" : "font-sans"
                  }`}
                >
                  <Link
                    href="/auth/forgot-password/professor"
                    className={`text-sm font-medium text-[var(--primary-300)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-500)] rounded`}
                  >
                    {t("auth.login.forgotPassword")}
                  </Link>
                </div>
                {/* Submit */}
                <div className="mb-6">
                  <Button
                    state="filled"
                    size="M"
                    icon_position="none"
                    text={
                      isLoading
                        ? t("auth.login.loggingIn") || "Logging in..."
                        : t("auth.login.loginButton") || "Login"
                    }
                    disabled={isLoading}
                    onClick={handleLogin}
                  />
                </div>

                {/* Sign up link */}
                <div className="space-y-2">
                  <p
                    className={`text-sm text-gray-600 dark:text-gray-300 ${
                      isRTL ? "font-arabic" : "font-sans"
                    }`}
                  >
                    {t("auth.login.noAccount")}
                    <Link
                      href="/register"
                      className="text-[var(--primary-300)] hover:opacity-90 font-medium"
                    >
                      {t("auth.login.signUp")}
                    </Link>
                  </p>
                  <p
                    className={`text-xs text-gray-500 dark:text-gray-400 ${
                      isRTL ? "font-arabic" : "font-sans"
                    }`}
                  >
                    {t("auth.login.wrongRole") || "Not a professor?"}{" "}
                    <Link
                      href="/auth/login/student"
                      className="text-[var(--primary-300)] hover:opacity-90 font-medium"
                    >
                      {t("auth.login.studentLogin") || "Student Login"}
                    </Link>
                  </p>
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
              height: "660px",
              backgroundImage: "url('/login_frame.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              ...(isRTL
                ? {
                    borderTopLeftRadius: "64px",
                    borderBottomLeftRadius: "64px",
                  }
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

            {/* Content */}
            <div className="relative z-10 px-12 text-center">
              <div className="mb-8">
                <Image
                  src="/S_logo_white.svg"
                  alt="Logo"
                  width={120}
                  height={120}
                  className="mx-auto"
                />
              </div>
              <h2
                className={`text-3xl font-bold mb-4 text-white ${
                  isRTL ? "font-arabic" : "font-sans"
                }`}
              >
                {t("auth.login.tagline") || "Where learning meets purpose"}
              </h2>
              <p
                className={`text-lg text-white/90 ${
                  isRTL ? "font-arabic" : "font-sans"
                }`}
              >
                {t("auth.login.professorTagline") ||
                  "Empower students and shape the future of education"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE Layout */}
      <div className="lg:hidden min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        {successMessage && (
          <div className="absolute top-4 left-4 right-4 z-50 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-4 py-2 rounded-lg">
            {successMessage}
          </div>
        )}

        <div className="px-5 sm:px-6 py-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-9">
            <Link href="/">
              <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </Link>
            <LanguageSwitcher className="flex items-center gap-2 scale-90 sm:scale-100" />
          </div>

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/S_logo.svg"
              alt="Logo"
              width={60}
              height={60}
              className="block dark:hidden"
            />
            <Image
              src="/S_logo_white.svg"
              alt="Logo"
              width={60}
              height={60}
              className="hidden dark:block"
            />
          </div>

          {/* Role Indicator */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 px-3 py-1.5 rounded-full">
              <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {t("auth.login.professorLogin") || "Professor Login"}
              </span>
            </div>
          </div>

          {/* Welcome Text */}
          <div
            className={`${
              isRTL ? "text-right" : "text-left"
            } sm:text-center mb-10`}
          >
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
          <div className="sm:max-w-md sm:mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              className="space-y-6"
            >
              <SimpleInput
                label={t("auth.login.email")}
                type="email"
                {...register("email")}
                errors={errors.email}
              />
              <SimpleInput
                label={t("auth.login.password")}
                type="password"
                {...register("password")}
                errors={errors.password}
              />

              <div
                className={`text-right ${isRTL ? "font-arabic" : "font-sans"}`}
              >
                <Link
                  href="/auth/forgot-password/professor"
                  className="text-sm text-[var(--primary-300)] hover:opacity-90"
                >
                  {t("auth.login.forgotPassword")}
                </Link>
              </div>

              <Button
                state="filled"
                size="L"
                icon_position="none"
                text={
                  isLoading
                    ? t("auth.login.loggingIn") || "Logging in..."
                    : t("auth.login.loginButton") || "Login"
                }
                disabled={isLoading}
                onClick={handleLogin}
              />
            </form>

            <div className="mt-8 text-center space-y-3">
              <p
                className={`text-sm text-gray-600 dark:text-gray-300 ${
                  isRTL ? "font-arabic" : "font-sans"
                }`}
              >
                {t("auth.login.noAccount")}
                <Link
                  href="/register"
                  className="text-[var(--primary-300)] hover:opacity-90 font-medium"
                >
                  {t("auth.login.signUp")}
                </Link>
              </p>
              <p
                className={`text-xs text-gray-500 dark:text-gray-400 ${
                  isRTL ? "font-arabic" : "font-sans"
                }`}
              >
                {t("auth.login.wrongRole") || "Not a professor?"}{" "}
                <Link
                  href="/auth/login/student"
                  className="text-[var(--primary-300)] hover:opacity-90 font-medium"
                >
                  {t("auth.login.studentLogin") || "Student Login"}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
