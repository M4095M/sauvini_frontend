"use client"

import React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { GraduationCap, BookOpen } from "lucide-react"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { useLanguage } from "@/hooks/useLanguage"
import { RTL_LANGUAGES } from "@/lib/language"

export default function SelectRolePage() {
  const router = useRouter()
  const { t, language } = useLanguage()
  const isRTL = RTL_LANGUAGES.includes(language)

  const handleRoleSelect = (role: 'student' | 'professor') => {
    router.push(`/auth/login/${role}`)
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
        {/* Inner Container */}
        <div
          className="absolute"
          style={{
            width: "1160px",
            height: "660px",
            top: "20px",
            left: "20px",
          }}
        >
          {/* Language Switcher - Top Right */}
          <div className="absolute" style={{ top: "48px", right: "48px" }}>
            <LanguageSwitcher className="flex items-center gap-2" />
          </div>

          {/* Content Container - Centered */}
          <div className="flex items-center justify-center h-full">
            <div style={{ maxWidth: "800px" }}>
              {/* Logo and Title */}
              <div className="text-center mb-10">
                <Image
                  src="/S_logo.svg"
                  alt="Logo"
                  width={80}
                  height={80}
                  className="mx-auto mb-6 block dark:hidden"
                />
                <Image
                  src="/S_logo_white.svg"
                  alt="Logo"
                  width={80}
                  height={80}
                  className="mx-auto mb-6 hidden dark:block"
                />
                <h1 className={`text-3xl font-bold text-gray-900 dark:text-white mb-3 ${isRTL ? "font-arabic" : "font-sans"}`}>
                  {t("auth.selectRole.title") || "Welcome to Sauvini"}
                </h1>
                <p className={`text-lg text-gray-600 dark:text-gray-300 ${isRTL ? "font-arabic" : "font-sans"}`}>
                  {t("auth.selectRole.subtitle") || "Please select your role to continue"}
                </p>
              </div>

              {/* Role Selection Cards */}
              <div className="grid grid-cols-2 gap-6">
                {/* Student Card */}
                <button
                  onClick={() => handleRoleSelect('student')}
                  className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 dark:border-gray-600 p-8 transition-all hover:border-[var(--primary-300)] hover:shadow-xl bg-white dark:bg-gray-800"
                >
                  <div className="relative z-10">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <GraduationCap className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className={`text-xl font-bold text-gray-900 dark:text-white mb-2 ${isRTL ? "font-arabic" : "font-sans"}`}>
                      {t("auth.selectRole.student.title") || "I'm a Student"}
                    </h2>
                    <p className={`text-sm text-gray-600 dark:text-gray-300 ${isRTL ? "font-arabic" : "font-sans"}`}>
                      {t("auth.selectRole.student.description") || "Access your courses, track progress, and continue learning"}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                {/* Professor Card */}
                <button
                  onClick={() => handleRoleSelect('professor')}
                  className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 dark:border-gray-600 p-8 transition-all hover:border-[var(--primary-300)] hover:shadow-xl bg-white dark:bg-gray-800"
                >
                  <div className="relative z-10">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BookOpen className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className={`text-xl font-bold text-gray-900 dark:text-white mb-2 ${isRTL ? "font-arabic" : "font-sans"}`}>
                      {t("auth.selectRole.professor.title") || "I'm a Professor"}
                    </h2>
                    <p className={`text-sm text-gray-600 dark:text-gray-300 ${isRTL ? "font-arabic" : "font-sans"}`}>
                      {t("auth.selectRole.professor.description") || "Manage your courses, students, and teaching materials"}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>

              {/* Footer Links */}
              <div className="mt-10 text-center">
                <p className={`text-sm text-gray-600 dark:text-gray-300 ${isRTL ? "font-arabic" : "font-sans"}`}>
                  {t("auth.selectRole.noAccount") || "Don't have an account?"}{" "}
                  <a href="/register" className="text-[var(--primary-300)] hover:opacity-90 font-medium">
                    {t("auth.selectRole.signUp") || "Sign up"}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE Layout */}
      <div className="lg:hidden min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 px-5 py-8">
        {/* Language Switcher */}
        <div className="flex justify-end mb-8">
          <LanguageSwitcher className="flex items-center gap-2 scale-90" />
        </div>

        {/* Logo and Title */}
        <div className="text-center mb-10">
          <Image
            src="/S_logo.svg"
            alt="Logo"
            width={60}
            height={60}
            className="mx-auto mb-5"
          />
          <h1 className={`text-2xl font-bold text-gray-900 dark:text-white mb-2 ${isRTL ? "font-arabic" : "font-sans"}`}>
            {t("auth.selectRole.title") || "Welcome to Sauvini"}
          </h1>
          <p className={`text-base text-gray-600 dark:text-gray-300 ${isRTL ? "font-arabic" : "font-sans"}`}>
            {t("auth.selectRole.subtitle") || "Please select your role to continue"}
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="space-y-4">
          {/* Student Card */}
          <button
            onClick={() => handleRoleSelect('student')}
            className="w-full group relative overflow-hidden rounded-2xl border-2 border-gray-200 dark:border-gray-600 p-6 transition-all hover:border-[var(--primary-300)]"
          >
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className={`${isRTL ? "mr-4 text-right" : "ml-4 text-left"}`}>
                <h2 className={`text-lg font-bold text-gray-900 dark:text-white mb-1 ${isRTL ? "font-arabic" : "font-sans"}`}>
                  {t("auth.selectRole.student.title") || "I'm a Student"}
                </h2>
                <p className={`text-xs text-gray-600 dark:text-gray-300 ${isRTL ? "font-arabic" : "font-sans"}`}>
                  {t("auth.selectRole.student.description") || "Access your courses and continue learning"}
                </p>
              </div>
            </div>
          </button>

          {/* Professor Card */}
          <button
            onClick={() => handleRoleSelect('professor')}
            className="w-full group relative overflow-hidden rounded-2xl border-2 border-gray-200 dark:border-gray-600 p-6 transition-all hover:border-[var(--primary-300)]"
          >
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div className={`${isRTL ? "mr-4 text-right" : "ml-4 text-left"}`}>
                <h2 className={`text-lg font-bold text-gray-900 dark:text-white mb-1 ${isRTL ? "font-arabic" : "font-sans"}`}>
                  {t("auth.selectRole.professor.title") || "I'm a Professor"}
                </h2>
                <p className={`text-xs text-gray-600 dark:text-gray-300 ${isRTL ? "font-arabic" : "font-sans"}`}>
                  {t("auth.selectRole.professor.description") || "Manage your courses and students"}
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Footer Links */}
        <div className="mt-10 text-center">
          <p className={`text-sm text-gray-600 dark:text-gray-300 ${isRTL ? "font-arabic" : "font-sans"}`}>
            {t("auth.selectRole.noAccount") || "Don't have an account?"}{" "}
            <a href="/register" className="text-[var(--primary-300)] hover:opacity-90 font-medium">
              {t("auth.selectRole.signUp") || "Sign up"}
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
