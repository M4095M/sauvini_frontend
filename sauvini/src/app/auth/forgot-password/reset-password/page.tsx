"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff, Check } from 'lucide-react'
import Button from "@/components/ui/button"
import SimpleInput from "@/components/input/simpleInput"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { useLanguage } from "@/hooks/useLanguage"
import { RTL_LANGUAGES } from "@/lib/language"

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)
  const [success, setSuccess] = useState(false)
  const { t, language } = useLanguage()
  const isRTL = RTL_LANGUAGES.includes(language)

  // dummy submit handler for backend to replace later
  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    console.log("ResetPasswordData (to be wired by backend): { newPassword, confirmPassword }")
    setIsLoading(false)
    setSuccess(true)
  }

  // Success content
  const SuccessContent = ({ className = "" }: { className?: string }) => (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <div
        aria-hidden="true"
        className="flex items-center justify-center rounded-full"
        style={{ width: "120px", height: "120px", background: "var(--success-400)" }}
      >
        <Check className="w-14 h-14 text-white" />
      </div>
      <h2 
        className={`mt-8 text-2xl sm:text-3xl font-extrabold ${isRTL ? "font-arabic" : "font-sans"}`} 
        style={{ color: "var(--success-400)" }}
      >
        {t("auth.reset.successTitle") || "Password Changed Successfully!"}
      </h2>
      <p className={`mt-4 text-gray-600 dark:text-gray-300 max-w-md ${isRTL ? "font-arabic" : "font-sans"}`}>
        {t("auth.reset.successBody") ||
          "Your password has been reset successfully. You can now log in with your new password."}
      </p>
      <div className="mt-8">
        <Link href="/auth/login" className="block">
          <Button state="filled" size="M" icon_position="none" text={t("auth.reset.successCta") || "Go to Login"} />
        </Link>
      </div>
    </div>
  )

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
          style={{
            width: "1160px",
            height: "660px",
            position: "absolute",
            top: "20px",
            left: "20px",
            direction: "ltr",
          }}
        >
          {success ? (
            // SUCCESS:
            <div className="relative w-full h-full">
              {/* S Logo */}
              <div
                className="absolute flex items-center justify-center"
                style={{
                  width: "48px",
                  height: "48px",
                  top: "48px",
                  left: "48px",
                }}
              >
                <Image src="/S_logo.svg" alt="Logo" width={84} height={84} className="block dark:hidden" />
                <Image src="/S_logo_white.svg" alt="Logo" width={84} height={84} className="hidden dark:block" />
              </div>

              {/* Language Switcher */}
              <div
                className="absolute z-20"
                style={{ top: "24px", right: "24px" }}
              >
                <LanguageSwitcher className="flex items-center gap-2" />
              </div>

              {/* Centered success content */}
              <div className="w-full h-full flex items-center justify-center px-4">
                <SuccessContent />
              </div>
            </div>
          ) : (
            // DEFAULT:
            <div className="flex justify-between w-full h-full">
              {/* Content Panel */}
              <div className="relative" style={{ width: "592px", height: "660px", order: (isRTL ? 2 : 1) as any }}>
                {/* S Logo */}
                <div
                  className="absolute flex items-center justify-center"
                  style={{
                    width: "48px",
                    height: "48px",
                    top: "48px",
                    ...(isRTL ? { right: "48px" } : { left: "48px" }),
                  }}
                >
                  <Image src="/S_logo.svg" alt="Logo" width={84} height={84} className="block dark:hidden" />
                  <Image src="/S_logo_white.svg" alt="Logo" width={84} height={84} className="hidden dark:block" />
                </div>

                {/* Title + Subtitle */}
                <div
                  className="absolute text-center"
                  style={{
                    width: "420px",
                    top: "150px",
                    left: isRTL ? undefined : "86px",
                    right: isRTL ? "86px" : undefined,
                  }}
                >
                  <h1 className={`text-4xl font-bold text-gray-900 dark:text-white mb-3 ${isRTL ? "font-arabic" : "font-sans"}`}>
                    {t("auth.reset.title") || "Reset Your Password"}
                  </h1>
                  <p className={`text-gray-600 dark:text-gray-300 text-lg ${isRTL ? "font-arabic" : "font-sans"}`}>
                    {t("auth.reset.subtitle") || "Create a new password for your account."}
                  </p>
                </div>

                {/* Form */}
                <div
                  className="absolute"
                  style={{
                    width: "420px",
                    top: "275px",
                    left: isRTL ? undefined : "86px",
                    right: isRTL ? "86px" : undefined,
                  }}
                >
                  <form onSubmit={handleReset} className="flex flex-col gap-6">
                    {/* New password */}
                    <SimpleInput
                      label={t("auth.reset.newPassword") || "New password"}
                      value="newPassword"
                      type="password"
                    />
                    {/* Confirm password */}
                    <SimpleInput
                      label={t("auth.reset.confirmPassword") || "Confirm new password"}
                      value="confirmPassword"
                      type="password"
                    />
                    {/* Submit */}
                    <div className="pt-3">
                      <Button
                        state="filled"
                        size="M"
                        icon_position="none"
                        text={
                          isLoading
                            ? (t("auth.reset.submitting") || "Resetting...")
                            : (t("auth.reset.cta") || "Reset Password")
                        }
                        disabled={isLoading}
                      />
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

                {/* Branding copy */}
                <div className="text-center relative z-10 px-6">
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
                    {t("auth.reset.tagline") || "Where learning meets purpose"}
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
          )}
        </div>
      </div>

      {/* MOBILE/Tablet Layout */}
      <div className="lg:hidden fixed inset-0">
        <div
          className={[
            "absolute bottom-0 left-0 right-0 overflow-hidden",
            "bg-[var(--neutral-100)] dark:bg-[var(--Surface-Level-2,_#1A1A1A)]",
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

            {success ? (
              <div className="px-5 sm:px-6 mt-10 sm:max-w-md sm:mx-auto sm:text-center">
                <SuccessContent />
              </div>
            ) : (
              <>
                {/* Text */}
                <div className={`px-5 sm:px-6 mt-9 sm:mt-10 ${isRTL ? "text-right" : "text-left"} sm:text-center`}>
                  <h1 className={`text-3xl font-bold text-gray-900 dark:text-white mb-3 ${isRTL ? "font-arabic" : "font-sans"}`}>
                    {t("auth.reset.title") || "Reset Your Password"}
                  </h1>
                  <p className={`text-gray-600 dark:text-gray-300 text-base sm:text-lg ${isRTL ? "font-arabic" : "font-sans"}`}>
                    {t("auth.reset.subtitle") || "Create a new password for your account."}
                  </p>
                </div>

                {/* Form */}
                <div className="px-5 sm:px-6 mt-10 sm:max-w-md sm:mx-auto">
                  <form onSubmit={handleReset} className="space-y-6 sm:space-y-7">
                    <SimpleInput
                      label={t("auth.reset.newPassword") || "Password"}
                      value="newPassword"
                      type="password"
                    />
                    <SimpleInput
                      label={t("auth.reset.confirmPassword") || "Confirm password"}
                      value="confirmPassword"
                      type="password"
                    />
                    <div className="pt-4 sm:pt-2">
                      <Button
                        state="filled"
                        size="M"
                        icon_position="none"
                        text={
                          isLoading
                            ? (t("auth.reset.submitting") || "Resetting...")
                            : (t("auth.reset.cta") || "Reset Password")
                        }
                        disabled={isLoading}
                      />
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
