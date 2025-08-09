"use client"

import React from "react"
import { useLanguage } from "@/hooks/useLanguage"
import { RTL_LANGUAGES } from "@/lib/language"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage()
  const isRTL = RTL_LANGUAGES.includes(language)

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 sm:px-0"
      style={{
        background:
          "radial-gradient(221.6% 141.42% at 0% 0%, var(--Gradient-Main-Left, #E6F5DB) 0%, var(--Gradient-Main-Right, #FEF9E6) 100%)",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      {children}
    </div>
  )
}
