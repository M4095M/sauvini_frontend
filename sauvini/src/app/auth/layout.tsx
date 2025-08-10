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
        // Light gradient
        "bg-[radial-gradient(221.6% 141.42% at 0% 0%, var(--Gradient-Main-Left-Blue, #CEDAE9) 0%, var(--Gradient-Main-Right-Blue, #DFD8FF) 100%)]",
        // Dark gradient
        "dark:bg-[radial-gradient(221.6%_141.42%_at_0%_0%,_var(--Gradient-Main-Left,_#0C362C)_0%,_var(--Gradient-Main-Right,_#123129)_100%)]",
      ].join(" ")}
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      {children}
    </div>
  )
}
