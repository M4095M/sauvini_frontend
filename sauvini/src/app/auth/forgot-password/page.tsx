"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from "@/components/ui/button"
import SimpleInput from "@/components/input/simpleInput"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { useLanguage } from "@/hooks/useLanguage"
import { RTL_LANGUAGES } from "@/lib/language"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { t, language } = useLanguage()
  const isRTL = RTL_LANGUAGES.includes(language)

  // dummy submit handler
  const handleNext = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    await new Promise((r) => setTimeout(r, 600))
    console.log("ForgotPasswordRequestData (to be wired by backend): { email }")
    setIsLoading(false)
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
          {/* Content Panel */}
          <div
            className={`relative ${isRTL ? "order-2" : "order-1"}`}
            style={{ width: "592px", height: "660px" }}
          >
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

            {/* Title + Subtitle + Helper */}
            <div
              className={`absolute text-center ${isRTL ? "right-[86px]" : "left-[86px]"}`}
              style={{
                width: "420px",
                top: "140px",
              }}
            >
              <h1 className={`text-4xl font-bold text-gray-900 dark:text-white mb-3 ${isRTL ? "font-arabic" : "font-sans"}`}>
                {t("auth.forgot.title") || "Forgot Your Password?"}
              </h1>
              <p className={`text-gray-600 dark:text-gray-300 text-lg mb-1 ${isRTL ? "font-arabic" : "font-sans"}`}>
                {t("auth.forgot.subtitle") || "Enter the email linked to your account."}
              </p>
              <p className={`text-gray-500 dark:text-gray-400 text-sm ${isRTL ? "font-arabic" : "font-sans"}`}>
                {t("auth.forgot.helper") || "We'll send you a verification code by email."}
              </p>
            </div>

            {/* Email Field */}
            <div
              className="absolute"
              style={{
                width: "420px",
                top: "320px",
                left: isRTL ? undefined : "86px",
                right: isRTL ? "86px" : undefined,
              }}
            >
              <SimpleInput label={t("auth.forgot.email") || "Email"} value="email" type="email" />
            </div>

            {/* Actions */}
            <div
              className="absolute"
              style={{
                width: "420px",
                top: "420px",
                left: isRTL ? undefined : "86px",
                right: isRTL ? "86px" : undefined,
              }}
            >
              <div className="grid grid-cols-2 gap-4">
                {/* Back */}
                <Link href="/auth/login" className="block">
                  <Button
                    state="outlined"
                    size="M"
                    icon_position={isRTL ? "right" : "left"}
                    icon={<ChevronLeft className="w-4 h-4" />}
                    text={t("common.back") || "Back"}
                  />
                </Link>

                {/* Next as submit */}
                <form onSubmit={handleNext}>
                  <Link href="/auth/forgot-password/verify-code">
                    <Button
                      state="filled"
                      size="M"
                      icon_position={isRTL ? "left" : "right"}
                      icon={<ChevronRight className="w-4 h-4" />}
                      text={
                        isLoading
                          ? (t("common.nexting") || "Next")
                          : (t("common.next") || "Next")
                      }
                      disabled={isLoading}
                    />
                  </Link>
                </form>
              </div>
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
                {t("auth.forgot.tagline") || "Where learning meets purpose"}
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

            <div className={`px-5 sm:px-6 mt-9 sm:mt-10 ${isRTL ? "text-right" : "text-left"} sm:text-center`}>
              <h1 className={`text-3xl font-bold text-gray-900 dark:text-white mb-3 ${isRTL ? "font-arabic" : "font-sans"}`}>
                {t("auth.forgot.title") || "Forgot Your Password?"}
              </h1>
              <p className={`text-gray-600 dark:text-gray-300 text-base sm:text-lg ${isRTL ? "font-arabic" : "font-sans"}`}>
                {t("auth.forgot.subtitle") || "Enter the email linked to your account."}
              </p>
              <p className={`text-gray-500 dark:text-gray-400 text-sm mt-2 ${isRTL ? "font-arabic" : "font-sans"}`}>
                {t("auth.forgot.helper") || "We'll send you a verification code by email."}
              </p>
            </div>

            {/* Email */}
            <div className="px-5 sm:px-6 mt-10 sm:mt-12 sm:max-w-md sm:mx-auto" style={{ direction: isRTL ? "rtl" : "ltr" }}>
              <SimpleInput label={t("auth.forgot.email") || "Email"} value="email" type="email" />
            </div>

            {/* Buttons */}
            <div className="px-5 sm:px-6 mt-12 sm:mt-14 sm:max-w-md sm:mx-auto">
              <div className="grid grid-cols-2 gap-4">
                <Link href="/auth/login" className="block">
                  <Button
                    state="outlined"
                    size="M"
                    icon_position={isRTL ? "right" : "left"}
                    icon={<ChevronLeft className="w-4 h-4" />}
                    text={t("common.back") || "Back"}
                  />
                </Link>
                <form onSubmit={handleNext}>
                  <Link href="/auth/forgot-password/verify-code">
                    <Button
                      state="filled"
                      size="M"
                      icon_position={isRTL ? "left" : "right"}
                      icon={<ChevronRight className="w-4 h-4" />}
                      text={
                        isLoading
                          ? (t("common.nexting") || "Next")
                          : (t("common.next") || "Next")
                      }
                      disabled={isLoading}
                    />
                  </Link>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
