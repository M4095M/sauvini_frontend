"use client"

import Image from "next/image"
import { Menu, Bell } from "lucide-react"
import { useSidebar } from "@/context/SideBarContext"
import { useLanguage } from "@/hooks/useLanguage"
import type { ProfessorUser } from "@/types/professor"
import Link from "next/link"

interface MobileHeaderProps {
  professorProfile: ProfessorUser
}

export default function MobileHeader({ professorProfile }: MobileHeaderProps) {
  const { toggle } = useSidebar()
  const { t, isRTL } = useLanguage()

  // Get the first assigned module name, or fallback
  const moduleTitle = professorProfile.assignedModules?.[0]?.name || "Professor"

  // Safe translation helper - returns empty string if translation is missing
  const safeTranslate = (key: string, fallback: string = ""): string => {
    const translation = t(key)
    // Hide "Missing translation:" errors on mobile for clean UX
    if (translation.includes("Missing translation:")) {
      return fallback
    }
    return translation || fallback
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-30 bg-[#F8F8F8] dark:bg-[#1A1A1A] shadow-md"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Top Row: Menu + Logo + Notifications */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section: Hamburger Menu */}
        <button
          onClick={toggle}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle navigation menu"
          type="button"
        >
          <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>

        {/* Center Section: Logo */}
        <div className="flex items-center justify-center">
          <Image
            src="/sauvini_logo.svg"
            alt="Sauvini"
            width={120}
            height={35}
            className="object-contain dark:brightness-150"
            priority
          />
        </div>

        {/* Right Section: Notifications */}
        <Link
          href="/professor/notifications"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          {/* Optional notification badge */}
          {/* <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" /> */}
        </Link>
      </div>

      {/* Bottom Section: Professor Greeting */}
      <div className="px-4 pb-3 border-t border-gray-200 dark:border-gray-700 pt-2">
        {/* Conditionally render welcome message - hide if translation missing */}
        {(() => {
          const welcomeText = safeTranslate("professor.welcome", "Welcome")
          return welcomeText ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {welcomeText}
            </p>
          ) : null
        })()}
        
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {safeTranslate("professor.dr", "Dr.")} {professorProfile.firstName} {professorProfile.lastName}
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {moduleTitle} {safeTranslate("professor.professor", "Professor")}
        </p>
      </div>
    </header>
  )
}
