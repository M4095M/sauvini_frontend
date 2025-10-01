"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Eye, EyeOff, Check } from "lucide-react"
import Button from "@/components/ui/button"
import ControlledInput from "@/components/input/ControlledInput"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { useLanguage } from "@/hooks/useLanguage"
import { RTL_LANGUAGES } from "@/lib/language"
import { useRouter } from "next/navigation"
import { AuthApi } from "@/api"

export default function VerifyCodeAndResetPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [code, setCode] = useState("")
  const [codeError, setCodeError] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newPasswordError, setNewPasswordError] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")
  const [showNewPw, setShowNewPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const { t, language } = useLanguage()
  const isRTL = RTL_LANGUAGES.includes(language)
  const router = useRouter()

  // Get email from session storage on mount
  useEffect(() => {
    const storedEmail = sessionStorage.getItem('reset_email');
    if (!storedEmail) {
      console.error("❌ No email found in session");
      router.push('/auth/forgot-password');
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  const handleResetPassword = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    
    // Clear previous errors
    setCodeError("");
    setNewPasswordError("");
    setConfirmPasswordError("");
    setApiError(null);
    
    const trimmedCode = code.trim();
    
    // Validate token
    if (!trimmedCode) {
      setCodeError("Please enter the verification code");
      return;
    }
    
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(trimmedCode)) {
      setCodeError("Invalid code format. Please copy the code exactly from your email.");
      return;
    }
    
    // Validate new password
    if (!newPassword || newPassword.length < 8) {
      setNewPasswordError("Password must be at least 8 characters");
      return;
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      setNewPasswordError("Password must contain uppercase, lowercase, and number");
      return;
    }
    
    // Validate confirm password
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      return;
    }
    
    if (confirmPassword !== newPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("🔐 Resetting password with token");
      await AuthApi.resetPasswordStudent(trimmedCode, newPassword);
      
      console.log("✅ Password reset successful");
      sessionStorage.removeItem('reset_token');
      sessionStorage.removeItem('reset_email');
      
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/auth/login?reset=success');
      }, 3000);
    } catch (error: any) {
      console.error("❌ Password reset failed:", error);
      const errorMessage = error?.message || "Failed to reset password. Please check your code and try again.";
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  const handleResendCode = async () => {
    if (!email) return;
    
    setIsLoading(true);
    setApiError(null);
    
    try {
      console.log("🔄 Resending password reset email to:", email);
      await AuthApi.forgotPasswordStudent(email);
      console.log("✅ Reset email resent successfully");
      setApiError("Email sent! Please check your inbox.");
    } catch (error: any) {
      console.error("❌ Failed to resend email:", error);
      setApiError("Failed to resend email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // Success content
  const SuccessContent = ({ className = "" }: { className?: string }) => (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <div
        className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6"
      >
        <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
      </div>
      <h2 className={`text-2xl font-bold text-gray-900 dark:text-white mb-3 ${isRTL ? "font-arabic" : "font-sans"}`}>
        Password Reset Successfully!
      </h2>
      <p className={`text-gray-600 dark:text-gray-300 ${isRTL ? "font-arabic" : "font-sans"}`}>
        Redirecting to login page...
      </p>
    </div>
  );

  if (success) {
    return (
      <>
        {/* DESKTOP Success */}
        <div className="hidden lg:flex items-center justify-center min-h-screen">
          <SuccessContent className="p-8" />
        </div>

        {/* MOBILE Success */}
        <div className="lg:hidden flex items-center justify-center min-h-screen px-5">
          <SuccessContent />
        </div>
      </>
    );
  }

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
          {/* Content Panel */}
          <div
            className={`bg-white dark:bg-[var(--Surface-Level-3,_#242424)] relative ${isRTL ? "order-2" : "order-1"}`}
            style={{
              width: "588px",
              height: "660px",
              borderRadius: "60px",
              padding: "0",
            }}
          >
            {/* Language Switcher */}
            <div
              className="absolute z-10"
              style={{
                top: "30px",
                right: isRTL ? undefined : "30px",
                left: isRTL ? "30px" : undefined,
              }}
            >
              <LanguageSwitcher className="flex items-center gap-2" />
            </div>

            {/* Title */}
            <div
              className="absolute"
              style={{
                top: "100px",
                left: isRTL ? undefined : "86px",
                right: isRTL ? "86px" : undefined,
                width: "420px",
              }}
            >
              <h1 className={`text-3xl font-bold text-gray-900 dark:text-white mb-2 ${isRTL ? "font-arabic" : "font-sans"}`}>
                {t("auth.reset.title") || "Reset Your Password"}
              </h1>
              <p className={`text-gray-600 dark:text-gray-300 text-base ${isRTL ? "font-arabic" : "font-sans"}`}>
                {t("auth.reset.subtitle") || "Enter the code from your email and create a new password"}
              </p>
            </div>

            {/* Form Fields */}
            <div
              className="absolute overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
              style={{
                width: "420px",
                top: "220px",
                height: "340px",
                left: isRTL ? undefined : "86px",
                right: isRTL ? "86px" : undefined,
                paddingRight: "10px",
              }}
            >
              {/* Verification Code */}
              <div className="mb-3">
                <ControlledInput
                  label={t("auth.verify.code") || "Verification Code"}
                  value={code}
                  onChange={setCode}
                  type="text"
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  error={codeError}
                />
              </div>

              {/* New Password */}
              <div className="mb-3 relative">
                <ControlledInput
                  label={t("auth.reset.newPassword") || "New Password"}
                  value={newPassword}
                  onChange={setNewPassword}
                  type={showNewPw ? "text" : "password"}
                  error={newPasswordError}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw(!showNewPw)}
                  className="absolute right-4 top-11 text-gray-500"
                >
                  {showNewPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="mb-3 relative">
                <ControlledInput
                  label={t("auth.reset.confirmPassword") || "Confirm Password"}
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  type={showConfirmPw ? "text" : "password"}
                  error={confirmPasswordError}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw(!showConfirmPw)}
                  className="absolute right-4 top-11 text-gray-500"
                >
                  {showConfirmPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {apiError && (
                <p className="text-red-500 text-sm mb-2">{apiError}</p>
              )}

              <button
                onClick={handleResendCode}
                disabled={isLoading}
                className="text-sm text-[var(--primary-300)] hover:opacity-90 mb-2"
              >
                {t("auth.verify.resend") || "Resend Code"}
              </button>
            </div>

            {/* Actions */}
            <div
              className="absolute"
              style={{
                top: "590px",
                left: isRTL ? undefined : "86px",
                right: isRTL ? "86px" : undefined,
              }}
            >
              <div className="grid grid-cols-2 gap-4">
                <Link href="/auth/forgot-password" className="block">
                  <Button
                    state="outlined"
                    size="M"
                    icon_position={isRTL ? "right" : "left"}
                    icon={<ChevronLeft className="w-4 h-4" />}
                    text={t("common.back") || "Back"}
                  />
                </Link>

                <Button
                  state="filled"
                  size="M"
                  text={isLoading ? "Resetting..." : (t("auth.reset.submit") || "Reset Password")}
                  disabled={isLoading}
                  onClick={handleResetPassword}
                />
              </div>
            </div>
          </div>

          {/* Branding Panel */}
          <div
            className={`flex flex-col justify-center items-center text-white relative overflow-hidden ${isRTL ? "order-1" : "order-2"}`}
            style={{
              width: "572px",
              height: "660px",
              borderRadius: "60px",
              background: "linear-gradient(135deg, var(--primary-500) 0%, var(--primary-700) 100%)",
            }}
          >
            <div className="relative z-10 text-center px-12">
              <Image
                src="/S_logo_white.svg"
                alt="Logo"
                width={120}
                height={120}
                className="mx-auto mb-6"
              />
              <h2 className={`text-3xl font-bold mb-4 ${isRTL ? "font-arabic" : "font-sans"}`}>
                {t("auth.branding.title") || "Welcome to Sauvini"}
              </h2>
              <p className={`text-lg opacity-90 ${isRTL ? "font-arabic" : "font-sans"}`}>
                {t("auth.branding.subtitle") || "Your learning journey starts here"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE Layout */}
      <div className="lg:hidden min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="px-5 sm:px-6 py-6">
          <div className="flex justify-between items-center mb-9">
            <Link href="/auth/forgot-password">
              <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </Link>
            <LanguageSwitcher className="flex items-center gap-2 scale-90 sm:scale-100" />
          </div>

          <div className={`mt-6 sm:mt-8 ${isRTL ? "text-right" : "text-left"} sm:text-center`}>
            <h1 className={`text-3xl font-bold text-gray-900 dark:text-white mb-3 ${isRTL ? "font-arabic" : "font-sans"}`}>
              {t("auth.reset.title") || "Reset Your Password"}
            </h1>
            <p className={`text-gray-600 dark:text-gray-300 text-base sm:text-lg ${isRTL ? "font-arabic" : "font-sans"}`}>
              {t("auth.reset.subtitle") || "Enter the code from your email and create a new password"}
            </p>
          </div>

          {/* Form */}
          <div className="mt-10 sm:mt-12 sm:max-w-md sm:mx-auto">
            <div className="space-y-6">
              <ControlledInput
                label={t("auth.verify.code") || "Verification Code"}
                value={code}
                onChange={setCode}
                type="text"
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                error={codeError}
              />

              <div className="relative">
                <ControlledInput
                  label={t("auth.reset.newPassword") || "New Password"}
                  value={newPassword}
                  onChange={setNewPassword}
                  type={showNewPw ? "text" : "password"}
                  error={newPasswordError}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw(!showNewPw)}
                  className="absolute right-4 top-11 text-gray-500"
                >
                  {showNewPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="relative">
                <ControlledInput
                  label={t("auth.reset.confirmPassword") || "Confirm Password"}
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  type={showConfirmPw ? "text" : "password"}
                  error={confirmPasswordError}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw(!showConfirmPw)}
                  className="absolute right-4 top-11 text-gray-500"
                >
                  {showConfirmPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {apiError && (
                <p className="text-red-500 text-sm">{apiError}</p>
              )}

              <button
                onClick={handleResendCode}
                disabled={isLoading}
                className="text-sm text-[var(--primary-300)] hover:opacity-90"
              >
                {t("auth.verify.resend") || "Resend Code"}
              </button>
            </div>

            <div className="mt-12">
              <Button
                state="filled"
                size="L"
                text={isLoading ? "Resetting..." : (t("auth.reset.submit") || "Reset Password")}
                disabled={isLoading}
                onClick={handleResetPassword}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
