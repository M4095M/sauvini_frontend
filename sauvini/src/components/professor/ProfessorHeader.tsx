"use client"

import Image from "next/image"
import { Bell, Sun, Moon } from "lucide-react"
import Button from "@/components/ui/button"
import type { ProfessorUser } from "@/types/professor"
import { LanguageSwitcher } from "../ui/language-switcher"
import { useLanguage } from "@/hooks/useLanguage"
import { useTheme } from "@/hooks/useTheme"
import React, { useCallback, useEffect, useMemo, useState } from "react"

interface ProfessorHeaderProps {
  professorProfile: ProfessorUser
  isMobile?: boolean
  className?: string
}

const PROFESSOR_HEADER_STYLES = {
  container: {
    padding: 12,
    borderRadius: 56,
  },
  profileCard: {
    width: 373,
    gap: 16,
  },
  avatar: {
    width: 81,
    height: 81,
  },
  actionsContainer: {
    gap: 16,
  },
  notificationsButton: {
    width: 179,
  },
} as const

const ThemeToggleButton = React.memo(function ThemeToggleButton({ className = "" }: { className?: string }) {
  const { resolvedTheme, toggleTheme } = useTheme()
  const { isRTL } = useLanguage()
  const isDarkFromContext = resolvedTheme === "dark"

  const [isDarkLocal, setIsDarkLocal] = useState(isDarkFromContext)
  useEffect(() => setIsDarkLocal(isDarkFromContext), [isDarkFromContext])

  const handleClick = useCallback(() => {
    setIsDarkLocal((v) => !v)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => toggleTheme(), 30)
      })
    })
  }, [toggleTheme])

  const knobTranslate = useMemo(() => (isDarkLocal ? 1 : 0), [isDarkLocal])
  const indicatorLeft = !isRTL ? (isDarkLocal ? "calc(100% - 16px - 40px)" : "16px") : isDarkLocal ? "16px" : "calc(100% - 16px - 40px)"

  return (
    <button
      onClick={handleClick}
      aria-pressed={isDarkLocal}
      aria-label={isDarkLocal ? "Switch to light theme" : "Switch to dark theme"}
      className={`flex items-center justify-center ${className}`}
      style={{ width: 104, height: 80, padding: 0, background: "transparent", border: "none" }}
      type="button"
    >
      <div style={{ display: "flex", width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
        <div
          className="relative flex items-center"
          style={{
            flex: "1 0 0",
            borderRadius: 100,
            border: "2px solid var(--Button-Outline-Default-Blue, #324C72)",
            height: 56,
            paddingLeft: 16,
            paddingRight: 16,
            justifyContent: "space-between",
            alignItems: "center",
            boxSizing: "border-box",
            background: "transparent",
            willChange: "transform, background-color",
          }}
        >
          <div
            aria-hidden
            style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: indicatorLeft, width: 40, height: 40, borderRadius: 40, background: "var(--primary-300)", zIndex: 1, pointerEvents: "none" }}
          />

          <div aria-hidden style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 40, color: isDarkLocal ? "var(--primary-300)" : "#fff", zIndex: 3 }}>
            <Sun className="w-5 h-5" />
          </div>

          <div aria-hidden style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 40, color: isDarkLocal ? "#fff" : "var(--primary-300)", zIndex: 3 }}>
            <Moon className="w-5 h-5" />
          </div>
        </div>
      </div>
    </button>
  )
})
ThemeToggleButton.displayName = "ThemeToggleButton"

export default function ProfessorHeader({ professorProfile, isMobile = false, className = "" }: ProfessorHeaderProps) {
  const { t, language, isRTL } = useLanguage()

  if (isMobile) {
    return null
  }

  // Get the first assigned module name, or fallback
  const moduleTitle = professorProfile.assignedModules?.[0]?.name || "Professor"

  return (
    <header
      className={`
        flex justify-between items-center self-stretch
        bg-[#F8F8F8] dark:bg-[#1A1A1A]
        ${className}
      `}
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        padding: PROFESSOR_HEADER_STYLES.container.padding,
        borderRadius: PROFESSOR_HEADER_STYLES.container.borderRadius,
      }}
    >
      {/* Professor Profile Card */}
      <div
        className={`flex items-center`}
        style={{
          width: PROFESSOR_HEADER_STYLES.profileCard.width,
          gap: PROFESSOR_HEADER_STYLES.profileCard.gap,
        }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Profile Picture */}
        <div
          className="flex justify-center items-center flex-shrink-0 relative overflow-hidden rounded-full"
          style={{
            width: PROFESSOR_HEADER_STYLES.avatar.width,
            height: PROFESSOR_HEADER_STYLES.avatar.height,
            aspectRatio: "1/1",
          }}
        >
          <Image
            src={professorProfile.avatar || "/placeholder.svg"}
            alt={`${t("professor.dr")} ${professorProfile.firstName} ${professorProfile.lastName} profile picture`}
            fill
            className="object-cover"
            sizes="81px"
            priority
          />
        </div>

        {/* Text Frame */}
        <div className={`flex flex-col items-start flex-1`}>
          {/* Professor Name */}
          <h1
            className={`text-gray-900 dark:text-white text-[36px] font-semibold -tracking-[0.72px] m-0 whitespace-nowrap`}
          >
            {t("professor.dr")} {professorProfile.firstName} {professorProfile.lastName}
          </h1>

          {/* Module Title */}
          <p className={`text-[#7C7C7C] dark:text-[#A0A0A0] text-[20px] font-medium leading-[30px] -tracking-[0.4px]`}>
            {moduleTitle} {t("professor.professor")}
          </p>
        </div>
      </div>

      {/* Actions Section: Notifications, Language Switcher, Theme Toggle */}
      <div
        className={`flex items-center`}
        style={{ gap: PROFESSOR_HEADER_STYLES.actionsContainer.gap }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Notifications Button */}
        <div className="flex items-center" style={{ width: PROFESSOR_HEADER_STYLES.notificationsButton.width }}>
          <Button
            state="filled"
            size="M"
            icon_position="left"
            icon={<Bell className="w-5 h-5" style={{ color: "#CEDAE9" }} aria-hidden="true" />}
            text={t("professor.notification")}
          />
        </div>

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Theme Toggle */}
        <ThemeToggleButton className="ml-3" />
      </div>
    </header>
  )
}
