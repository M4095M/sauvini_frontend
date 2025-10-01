"use client"

import React, { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff, GraduationCap, ChevronLeft } from 'lucide-react'
import Button from "@/components/ui/button"
import SimpleInput from "@/components/input/simpleInput"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { useLanguage } from "@/hooks/useLanguage"
import { RTL_LANGUAGES } from "@/lib/language"
import { useForm } from "@/hooks/useForm"
import { LoginRequest } from "@/api"
import { FormErrors } from "@/types/api"
import { useAuth } from "@/context/AuthContext"
import { useSearchParams, useRouter } from "next/navigation"


export default function StudentLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const { t, language } = useLanguage()
  const isRTL = RTL_LANGUAGES.includes(language)
  const searchParams = useSearchParams()

  const {loginStudent, loginProfessor} = useAuth()

  // Check for verification success
  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      setSuccessMessage("Email verified successfully! You can now log in.");
      // Clear success message after 5 seconds
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
    if (searchParams.get('reset') === 'success') {
      setSuccessMessage("Password reset successfully! You can now log in with your new password.");
      // Clear success message after 5 seconds
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  // Add form data ref to persist across steps without triggering re-renders
  const formDataRef = useRef<Partial<LoginRequest>>({});

  const router = useRouter();

  const handleLogin = async (values: LoginRequest) => {
    const errors: Partial<Record<keyof LoginRequest, string>> = {};
  
    // // validation:
    // if (!values.email || values.email.trim() === "") {
    //   errors.email = t("auth.login.errors.email_required") || "Email is required";
    // }

    // if (!values.password || values.password.trim() === ""){
    //   errors.password = t("auth.login.errors.password_required") || "Password is required";
    // }

    // if (Object.keys(errors).length > 0) {
    //   setErrors(errors);
    //   return;
    // }

    setIsLoading(true);
    setErrors({}); // Clear previous errors

    try {
      console.log("🔐 Attempting student login...");
      // We already validated that email and password exist
      const result = await loginStudent(values.email!, values.password!);
      
      console.log("✅ Login successful");
      // The loginStudent function in AuthContext already handles token storage
      // and user state management. Now we just need to redirect.
      
      // Redirect to profile page
      router.push("/profile");
    } catch (error: any) {
      console.error("❌ Login failed:", error);
      // Display error to user
      const errorMessage = error?.message || t("auth.login.errors.invalid_credentials") || "Invalid email or password";
      setErrors({ email: errorMessage });
    } finally {
      setIsLoading(false);
    }
  }

  // Initialize useForm hook with external form data management
  const {
    register,
    registerFile,
    handleSubmit,
    errors,
    setErrors,
    isSubmitting,
    getValues,
    validate,
  } = useForm<LoginRequest>({
    initialValues: {},
    onSubmit: handleLogin,
    externalFormData: formDataRef, // Pass the external form data ref
  });



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
        {/* Internal Layout Container */}
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
            {/* Back to Role Selection */}
            <Link
              href="/auth/select-role"
              className="absolute flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:opacity-80"
              style={{
                top: "48px",
                ...(isRTL ? { right: "48px" } : { left: "48px" }),
              }}
            >
              <ChevronLeft className="w-5 h-5" />
              <span className={`text-sm ${isRTL ? "font-arabic" : "font-sans"}`}>
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
              <Image src="/S_logo.svg" alt="Logo" width={84} height={84} className="block dark:hidden" />
              <Image src="/S_logo_white.svg" alt="Logo" width={84} height={84} className="hidden dark:block" />
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
              <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {t("auth.login.studentLogin") || "Student Login"}
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
              <h1 className={`text-4xl font-bold text-gray-900 dark:text-white mb-2 ${isRTL ? "font-arabic" : "font-sans"}`}>
                {t("auth.login.title")}
              </h1>
              <p className={`text-gray-600 dark:text-gray-300 text-lg ${isRTL ? "font-arabic" : "font-sans"}`}>
                {t("auth.login.subtitle")}
              </p>
            </div>

            {/* Form Container */}
            <div
              className="absolute"
              style={{
                width: "390px",
                top: "300px",
                left: isRTL ? undefined : "101px",
                right: isRTL ? "101px" : undefined,
              }}
            >
              {successMessage && (
                <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 rounded-lg text-sm">
                  {successMessage}
                </div>
              )}
              <form onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }} className="flex flex-col" style={{ gap: "6px" }}>
                {/* Email */}
                <div className="mb-4">
                  <SimpleInput label={t("auth.login.email")} value="email" type="email" {...register("email")} errors={errors.email} />
                </div>

                {/* Password */}
                <div className="mb-4">
                  <SimpleInput label={t("auth.login.password")} value="password" type="password" {...register("password")} errors={errors.password} />
                </div>

                {/* Forgot password link */}
                <div className={`text-right ${isRTL ? "font-arabic" : "font-sans"}`}>
                  <Link
                    href="/auth/forgot-password/student"
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
                    text={isLoading ? (t("auth.login.loggingIn") || "Logging in...") : (t("auth.login.loginButton") || "Login")}
                    disabled={isLoading}
                    onClick={handleLogin}
                  />
                </div>

                {/* Sign up */}
                <div className="text-center">
                  <span className={`text-gray-600 dark:text-gray-300 ${isRTL ? "font-arabic" : "font-sans"}`}>
                    {t("auth.login.noAccount")} 
                  </span>
                  <Link
                    href="/register"
                    className={`font-medium text-[var(--primary-300)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-500)] rounded ${isRTL ? "font-arabic" : "font-sans"}`}
                  >
                    {t("auth.login.signUp")}
                  </Link>
                </div>
              </form>
            </div>
          </div>

          {/* Branding Panel */}
          <div
            className={`flex flex-col justify-center items-center text-white relative overflow-hidden ${isRTL ? "order-1" : "order-2"}`}
            style={{
              width: "572px",
              height: "660px",
              backgroundImage: "url('/login_frame.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              ...(isRTL
                ? { borderTopLeftRadius: "64px", borderBottomLeftRadius: "64px" }
                : { borderTopRightRadius: "64px", borderBottomRightRadius: "64px" }),
            }}
          >
            {/* Language Switcher */}
            <div
              className="absolute z-20"
              style={{ top: "24px", ...(isRTL ? { left: "24px" } : { right: "24px" }) }}
            >
              <LanguageSwitcher className="flex items-center gap-2" />
            </div>

            {/* Optional pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full" />
              <div className="absolute top-40 right-20 w-24 h-24 border border-white/20 rounded-full" />
              <div className="absolute bottom-20 left-20 w-40 h-40 border border-white/20 rounded-full" />
              <div className="absolute bottom-10 right-10 w-20 h-20 bg-white/10 rounded-full" />
            </div>

            {/* Branding copy */}
            <div className="text-center relative z-10">
              <div className="mb-8">
                <Image
                  src="/sauvini_white.svg"
                  alt="Sauvini Logo"
                  width={280}
                  height={100}
                  className="mx-auto"
                  priority
                />
              </div>
              <p className={`text-xl lg:text-2xl text-blue-100 mb-12 font-light max-w-md mx-auto ${isRTL ? "font-arabic" : "font-sans"}`}>
                {t("auth.login.tagline")}
              </p>
            </div>

            {/* Bottom Badge */}
            <div
              className="absolute"
              style={{
                bottom: "32px",
                ...(isRTL ? { left: "32px" } : { right: "32px" }),
              }}
            >
              <Image
                src="/your_future_starts_here.svg"
                alt="Your Future Starts Here"
                width={96}
                height={96}
              />
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE/Tablet Layout */}
      <div className="lg:hidden fixed inset-0">
        <div
          className={[
            "absolute bottom-0 left-0 right-0 overflow-hidden",
            "bg-[var(--neutral-100)] dark:bg-[var(--Surface-Level-2,_#1A1A1A)]",
            // border for tablets only (all other pages same)
            "sm:border-l-4 sm:border-r-4 sm:border-t-4 sm:border-[var(--primary-500)]",
          ].join(" ")}
          style={{
            height: "calc(100dvh - 54px)",
            borderRadius: "52px 52px 0 0",
          }}
        >
          <div
            className="h-full overflow-auto"
            style={{
              paddingTop: "calc(env(safe-area-inset-top) + 20px)",
              paddingBottom: "36px",
            }}
          >
            {/* Top bar */}
            <div className="px-5 sm:px-6 flex items-center justify-between">
              <div className="flex items-center">
                <Image src="/S_logo.svg" alt="Logo" width={32} height={32} className="block dark:hidden" />
                <Image src="/S_logo_white.svg" alt="Logo" width={32} height={32} className="hidden dark:block" />
              </div>
              <LanguageSwitcher className="flex items-center gap-2 scale-90 sm:scale-100" />
            </div>

            {/* Welcome */}
            <div className="px-5 sm:px-6 mt-9 sm:mt-10 text-left sm:text-center">
              <h1 className={`text-3xl font-bold text-gray-900 dark:text-white mb-3 ${isRTL ? "font-arabic" : "font-sans"}`}>
                {t("auth.login.title")}
              </h1>
              <p className={`text-gray-600 dark:text-gray-300 text-base sm:text-lg ${isRTL ? "font-arabic" : "font-sans"}`}>
                {t("auth.login.subtitle")}
              </p>
            </div>

            {/* Form */}
            <div className="px-5 sm:px-6 mt-10 sm:mt-12 sm:max-w-md sm:mx-auto">
              {successMessage && (
                <div className="mb-6 p-3 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 rounded-lg text-sm">
                  {successMessage}
                </div>
              )}
              <form onSubmit={handleLogin} className="space-y-8 sm:space-y-9">
                <div>
                  <SimpleInput label={t("auth.login.email")} value="email" type="email" />
                </div>
                <div>
                  <SimpleInput label={t("auth.login.password")} value="password" type="password" />
                </div>
                <div style={{ textAlign: isRTL ? "right" : "left" }}>
                  <Link
                    href="/auth/forgot-password"
                    className={`text-sm font-medium text-[var(--primary-300)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-500)] rounded ${isRTL ? "font-arabic" : "font-sans"}`}
                  >
                    {t("auth.login.forgotPassword")}
                  </Link>
                </div>
                <div className="pt-1">
                  <Button
                    state="filled"
                    size="M"
                    icon_position="none"
                    text={isLoading ? t("auth.login.loggingIn") : t("auth.login.loginButton")}
                    disabled={isLoading}
                  />
                </div>
                <div className="text-center pt-1">
                  <span className={`text-gray-600 dark:text-gray-300 ${isRTL ? "font-arabic" : "font-sans"}`}>
                    {t("auth.login.noAccount")} 
                  </span>
                  <Link
                    href="/register"
                    className={`font-medium text-[var(--primary-300)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-500)] rounded ${isRTL ? "font-arabic" : "font-sans"}`}
                  >
                    {t("auth.login.signUp")}
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
