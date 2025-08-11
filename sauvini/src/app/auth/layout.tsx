"use client"

import type React from "react"
import { useLanguage } from "@/hooks/useLanguage"
import { RTL_LANGUAGES } from "@/lib/language"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage()
  const isRTL = RTL_LANGUAGES.includes(language)

  return (
    <div
      className={[
        "min-h-screen flex items-center justify-center px-4 sm:px-0",
        // Light gradient - Blue
        "bg-[radial-gradient(221.6%_141.42%_at_0%_0%,_var(--Gradient-Main-Left-Blue,_#CEDAE9)_0%,_var(--Gradient-Main-Right-Blue,_#DFD8FF)_100%)]",
        // Dark gradient - Blue
        "dark:bg-[radial-gradient(221.6%_141.42%_at_0%_0%,_var(--Gradient-Main-Left-Blue,_#1B2536)_0%,_var(--Gradient-Main-Right-Blue,_#1F1532)_100%)]",
      ].join(" ")}
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      {children}
    </div>
  )
}
