"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff } from 'lucide-react'
import Button from "@/components/ui/button"
import InputButton from "@/components/input/InputButton"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { useLanguage } from "@/hooks/useLanguage"
import { RTL_LANGUAGES } from "@/lib/language"

export default function LoginPage() {
const [showPassword, setShowPassword] = useState(false)
const [isLoading, setIsLoading] = useState(false)

const { t, language } = useLanguage()
const isRTL = RTL_LANGUAGES.includes(language)

// dummy login handler for backend to replace later
const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  setIsLoading(true)

  // NOTE:
  // - Input values should be rendered via InputButton.
  await new Promise((r) => setTimeout(r, 600))
  console.log("LoginRequestData (to be wired by backend): { email, password }")

  setIsLoading(false)
}

return (
  <div
    className="min-h-screen flex items-center justify-center px-4 sm:px-0"
    style={{
      background: "radial-gradient(221.6% 141.42% at 0% 0%, var(--Gradient-Main-Left, #E6F5DB) 0%, var(--Gradient-Main-Right, #FEF9E6) 100%)",
      direction: isRTL ? "rtl" : "ltr",
    }}
  >
    {/* DESKTOP Layout */}
    <div
      className="hidden lg:block overflow-hidden shadow-2xl"
      style={{
        width: "1200px",
        height: "700px",
        borderRadius: "80px",
        border: "4px solid var(--Component-Primary, #06A64C)",
        background: "#F8F8F8",
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

          {/* Welcome Section */}
          <div
            className="absolute flex flex-col items-center text-center"
            style={{
              width: "390px",
              height: "86px",
              top: "140px",
              left: isRTL ? undefined : "101px",
              right: isRTL ? "101px" : undefined,
              gap: "8px",
            }}
          >
            <h1 className="text-4xl font-bold text-gray-900">
              {t("auth.login.title")}
            </h1>
            <p className="text-gray-600 text-lg">{t("auth.login.subtitle")}</p>
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
            <form onSubmit={handleLogin} className="flex flex-col" style={{ gap: "6px" }}>
              {/* Email */}
              <div className="mb-6">
                <InputButton label={t("auth.login.email")} type="icon" icon={null} />
              </div>

              {/* Password */}
              <div className="mb-4">
                <InputButton
                  label={t("auth.login.password")}
                  type="icon"
                  icon={
                    <button
                      type="button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((s) => !s)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  }
                />
              </div>

              {/* Forgot password link */}
              <div className={`mb-6 mt-4 ${isRTL ? "text-left" : "text-right"}`}>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-[#06A64C] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 rounded"
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
                  text={isLoading ? t("auth.login.loggingIn") : t("auth.login.loginButton")}
                  disabled={isLoading}
                />
              </div>

              {/* Sign up */}
              <div className="text-center">
                <span className="text-gray-600">{t("auth.login.noAccount")} </span>
                <Link
                  href="/signup/choose-role"
                  className="font-medium text-[#06A64C] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 rounded"
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
            <p className="text-xl lg:text-2xl text-blue-100 mb-12 font-light max-w-md mx-auto">
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
        className="absolute bottom-0 left-0 right-0 overflow-hidden"
        style={{
          height: "calc(100dvh - 54px)",
          borderRadius: "52px 52px 0 0",
          background: "#F8F8F8",
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

          {/* Welcome */}
          <div className="px-5 sm:px-6 mt-9 sm:mt-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {t("auth.login.title")}
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              {t("auth.login.subtitle")}
            </p>
          </div>

          {/* Form */}
          <div className="px-5 sm:px-6 mt-10 sm:mt-12">
            <form onSubmit={handleLogin} className="space-y-8 sm:space-y-9">
              <div>
                <InputButton label={t("auth.login.email")} type="icon" icon={null} />
              </div>

              <div>
                <InputButton
                  label={t("auth.login.password")}
                  type="icon"
                  icon={
                    <button
                      type="button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((s) => !s)}
                      className="p-1 rounded-md hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  }
                />
              </div>

              <div style={{ textAlign: isRTL ? "right" : "left" }}>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-[#06A64C] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 rounded"
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
                <span className="text-gray-600">{t("auth.login.noAccount")} </span>
                <Link
                  href="/signup/choose-role"
                  className="font-medium text-[#06A64C] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 rounded"
                >
                  {t("auth.login.signUp")}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
)
}
