"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import Button from "@/components/ui/button"
import SimpleInput from "@/components/input/simpleInput"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { useLanguage } from "@/hooks/useLanguage"
import { RTL_LANGUAGES } from "@/lib/language"

export default function VerifyCodePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [code, setCode] = useState("")
  const { t, language } = useLanguage()
  const isRTL = RTL_LANGUAGES.includes(language)

  // dummy submit handler
  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (code.length < 6) return
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    console.log("VerifyCodeData (to be wired by backend):", { code })
    setIsLoading(false)
  }

  // dummy resend handler
  const handleResendCode = async () => {
    console.log("Resending verification code...")
  }

  return (
    <>
      {/* DESKTOP Layout */}
      <div
        className="hidden lg:block overflow-hidden shadow-2xl"
        style={{
          width: "1200px",
          height: "700px",
          borderRadius: "80px",
          border: "4px solid var(--Component-Primary, #06A64C)",
          background: "var(--neutral-100)",
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
          <div className={`relative ${isRTL ? "order-2" : "order-1"}`} style={{ width: "592px", height: "660px" }}>
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
              <Image src="/S_logo.svg" alt="Logo" width={84} height={84} />
            </div>

            {/* Title + Subtitle + Helper */}
            <div
              className="absolute text-center"
              style={{
                width: "420px",
                top: "140px",
                left: isRTL ? undefined : "86px",
                right: isRTL ? "86px" : undefined,
              }}
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{t("auth.verify.title") || "Check Your Email"}</h1>
              <p className="text-gray-600 text-lg mb-1">
                {t("auth.verify.subtitle") || "Enter the 6-digit code we sent you"}
              </p>
              <p className="text-gray-500 text-sm">
                {t("auth.verify.helper") || "Didn't receive it? Check your spam folder or request a new code"}
              </p>
            </div>

            {/* Email InputButton */}
            <div
              className="absolute"
              style={{
                width: "420px",
                top: "265px",
                left: isRTL ? undefined : "86px",
                right: isRTL ? "86px" : undefined,
              }}
            >
              <SimpleInput label={t("auth.verify.email") || "Email"} value="Example@gmail.com" />
            </div>

            {/* OTP Input */}
            <div
              className="absolute"
              style={{
                width: "420px",
                top: "360px",
                left: isRTL ? undefined : "86px",
                right: isRTL ? "86px" : undefined,
              }}
            >
              <div className={`mb-3 flex ${isRTL ? "justify-end" : "justify-start"}`}>
                <InputOTP
                  maxLength={6}
                  value={code}
                  onChange={(value) => setCode(value)}
                  aria-label={t("auth.verify.codeLabel") || "Verification code"}
                >
                  <InputOTPGroup className="gap-4">
                    <InputOTPSlot
                      index={0}
                      className="w-14 h-14 rounded-xl border-2 text-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    />
                    <InputOTPSlot
                      index={1}
                      className="w-14 h-14 rounded-xl border-2 text-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    />
                    <InputOTPSlot
                      index={2}
                      className="w-14 h-14 rounded-xl border-2 text-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    />
                    <InputOTPSlot
                      index={3}
                      className="w-14 h-14 rounded-xl border-2 text-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    />
                    <InputOTPSlot
                      index={4}
                      className="w-14 h-14 rounded-xl border-2 text-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    />
                    <InputOTPSlot
                      index={5}
                      className="w-14 h-14 rounded-xl border-2 text-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {/* Resend Code Link */}
              <div className={`${isRTL ? "text-left" : "text-right"}`}>
                <button
                  onClick={handleResendCode}
                  className="text-green-600 text-sm hover:text-green-700 underline font-medium"
                >
                  {t("auth.verify.resend") || "Resend Code"}
                </button>
              </div>
            </div>

            {/* Actions: Back + Verify */}
            <div
              className="absolute"
              style={{
                width: "420px",
                top: "500px",
                left: isRTL ? undefined : "86px",
                right: isRTL ? "86px" : undefined,
              }}
            >
              <div className="grid grid-cols-2 gap-4">
                {/* Back */}
                <Link href="/auth/forgot-password" className="block">
                  <Button
                    state="outlined"
                    size="M"
                    icon_position="left"
                    icon={<ChevronLeft className="w-4 h-4" />}
                    text={t("common.back") || "Back"}
                  />
                </Link>

                {/* Verify Code as submit */}
                <form onSubmit={handleVerify}>
                  <Link href="/auth/forgot-password/reset-password">
                    <Button
                      state="filled"
                      size="M"
                      icon_position="none"
                      text={
                        isLoading ? t("common.verifying") || "Verifying..." : t("auth.verify.button") || "Verify Code"
                      }
                      disabled={isLoading || code.length < 6}
                    />
                  </Link>
                </form>
              </div>
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
                ? { borderTopLeftRadius: "64px", borderBottomLeftRadius: "64px" }
                : { borderTopRightRadius: "64px", borderBottomRightRadius: "64px" }),
            }}
          >
            {/* Language Switcher */}
            <div className="absolute z-20" style={{ top: "24px", ...(isRTL ? { left: "24px" } : { right: "24px" }) }}>
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
              <p className="text-xl lg:text-2xl text-emerald-50 mb-12 font-light max-w-md mx-auto">
                {t("auth.verify.tagline") || "Where learning meets purpose"}
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
              <Image src="/your_future_starts_here.svg" alt="Your Future Starts Here" width={96} height={96} />
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE/Tablet Layout */}
      <div className="lg:hidden fixed inset-0">
        <div
          className="absolute bottom-0 left-0 right-0 overflow-hidden"
          style={{
            height: "calc(100dvh - 54px)",
            borderRadius: "52px 52px 0 0",
            background: "var(--neutral-100)",
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
                <Image src="/S_logo.svg" alt="Logo" width={32} height={32} />
              </div>
              <LanguageSwitcher className="flex items-center gap-2 scale-90 sm:scale-100" />
            </div>

            {/* Text */}
            <div className={`px-5 sm:px-6 mt-9 sm:mt-10 ${isRTL ? "text-right" : "text-left"}`}>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{t("auth.verify.title") || "Check Your Email"}</h1>
              <p className="text-gray-600 text-base sm:text-lg">
                {t("auth.verify.subtitle") || "Enter the 6-digit code we sent you"}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {t("auth.verify.helper") || "Didn't receive it? Check your spam folder or request a new code"}
              </p>
            </div>

            {/* Email InputButton */}
            <div className="px-5 sm:px-6 mt-6">
              <SimpleInput label={t("auth.verify.email") || "Email"} value="Example@gmail.com" />
            </div>

            {/* OTP */}
            <div className="px-5 sm:px-6 mt-18">
              <div className={`mb-3 flex ${isRTL ? "justify-end" : "justify-start"}`}>
                <InputOTP
                  maxLength={6}
                  value={code}
                  onChange={(value) => setCode(value)}
                  aria-label={t("auth.verify.codeLabel") || "Verification code"}
                >
                  <InputOTPGroup className="gap-3">
                    <InputOTPSlot
                      index={0}
                      className="w-12 h-12 rounded-xl border-2 text-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    />
                    <InputOTPSlot
                      index={1}
                      className="w-12 h-12 rounded-xl border-2 text-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    />
                    <InputOTPSlot
                      index={2}
                      className="w-12 h-12 rounded-xl border-2 text-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    />
                    <InputOTPSlot
                      index={3}
                      className="w-12 h-12 rounded-xl border-2 text-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    />
                    <InputOTPSlot
                      index={4}
                      className="w-12 h-12 rounded-xl border-2 text-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    />
                    <InputOTPSlot
                      index={5}
                      className="w-12 h-12 rounded-xl border-2 text-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <div className={`${isRTL ? "text-left" : "text-right"}`}>
                <button
                  onClick={handleResendCode}
                  className="text-green-600 text-sm hover:text-green-700 underline font-medium"
                >
                  {t("auth.verify.resend") || "Resend Code"}
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="px-5 sm:px-6 mt-12 sm:mt-14">
              <div className="grid grid-cols-2 gap-4">
                <Link href="/auth/forgot-password" className="block">
                  <Button
                    state="outlined"
                    size="M"
                    icon_position="left"
                    icon={<ChevronLeft className="w-4 h-4" />}
                    text={t("common.back") || "Back"}
                  />
                </Link>
                <form onSubmit={handleVerify}>
                  <Link href="/auth/forgot-password/reset-password">
                    <Button
                      state="filled"
                      size="M"
                      icon_position="none"
                      text={
                        isLoading ? t("common.verifying") || "Verifying..." : t("auth.verify.button") || "Verify Code"
                      }
                      disabled={isLoading || code.length < 6}
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
