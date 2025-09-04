"use client"

import React, { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { Sun, Moon } from "lucide-react"
import { useLanguage } from "@/hooks/useLanguage"
import { useTheme } from "@/hooks/useTheme"
import { LanguageSwitcher } from "../ui/language-switcher"

interface NavBarAuthedProps {
  userProfile: {
    id: string
    name: string
    lastname: string
    avatar: string
    userType: "student" | "professor"
    title?: string // For professors: "Mathematics Professor", for students: "Level 6" (just example)
  }
  className?: string
}

const NAVBAR_STYLES = {
  container: {
    padding: 12,
    borderRadius: 56,
  },
  profileSection: {
    gap: 16,
  },
  avatar: {
    width: 81,
    height: 81,
  },
  actionsSection: {
    gap: 16,
  },
} as const

const ThemeToggleButton = React.memo(function ThemeToggleButton({ className = "" }: { className?: string }) {
  const { resolvedTheme, toggleTheme } = useTheme()
  const { isRTL } = useLanguage()
  const isDarkFromContext = resolvedTheme === "dark"

  const [isDarkLocal, setIsDarkLocal] = useState(isDarkFromContext)
  
  useEffect(() => {
    setIsDarkLocal(isDarkFromContext)
  }, [isDarkFromContext])

  const handleClick = useCallback(() => {
    setIsDarkLocal((prev) => !prev)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => toggleTheme(), 30)
      })
    })
  }, [toggleTheme])

  const indicatorLeft = !isRTL 
    ? (isDarkLocal ? "calc(100% - 16px - 40px)" : "16px") 
    : (isDarkLocal ? "16px" : "calc(100% - 16px - 40px)")

  return (
    <button
      onClick={handleClick}
      aria-pressed={isDarkLocal}
      aria-label={isDarkLocal ? "Switch to light theme" : "Switch to dark theme"}
      className={`flex items-center justify-center ${className}`}
      style={{ 
        width: 104, 
        height: 80, 
        padding: 0, 
        background: "transparent", 
        border: "none" 
      }}
      type="button"
    >
      <div style={{ 
        display: "flex", 
        width: "100%", 
        height: "100%", 
        justifyContent: "center", 
        alignItems: "center" 
      }}>
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
          {/* Active indicator */}
          <div
            aria-hidden
            style={{ 
              position: "absolute", 
              top: "50%", 
              transform: "translateY(-50%)", 
              left: indicatorLeft, 
              width: 40, 
              height: 40, 
              borderRadius: 40, 
              background: "var(--primary-300)", 
              zIndex: 1, 
              pointerEvents: "none",
              transition: "left 200ms ease-in-out"
            }}
          />

          {/* Sun icon */}
          <div 
            aria-hidden 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              width: 40, 
              height: 40, 
              borderRadius: 40, 
              color: isDarkLocal ? "var(--primary-300)" : "#fff", 
              zIndex: 3 
            }}
          >
            <Sun className="w-5 h-5" />
          </div>

          {/* Moon icon */}
          <div 
            aria-hidden 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              width: 40, 
              height: 40, 
              borderRadius: 40, 
              color: isDarkLocal ? "#fff" : "var(--primary-300)", 
              zIndex: 3 
            }}
          >
            <Moon className="w-5 h-5" />
          </div>
        </div>
      </div>
    </button>
  )
})
ThemeToggleButton.displayName = "ThemeToggleButton"

export default function NavBarAuthed({ userProfile, className = "" }: NavBarAuthedProps) {
  const { t, isRTL } = useLanguage()

  return (
    <header className={`w-full ${className}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="w-full">
        <nav
          className="flex justify-between items-center w-full bg-[#F8F8F8] dark:bg-[#1A1A1A]"
          style={{
            padding: NAVBAR_STYLES.container.padding,
            borderRadius: NAVBAR_STYLES.container.borderRadius,
          }}
          role="navigation"
          aria-label="Main navigation"
        >
          {/* User Profile Section */}
          <div
            className="flex items-end"
            style={{ gap: NAVBAR_STYLES.profileSection.gap }}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {/* Profile Picture */}
            <div
              className="flex justify-center items-center flex-shrink-0 relative overflow-hidden rounded-full"
              style={{
                width: NAVBAR_STYLES.avatar.width,
                height: NAVBAR_STYLES.avatar.height,
                aspectRatio: "1/1",
              }}
            >
              <Image
                src={userProfile.avatar || "/placeholder.svg"}
                alt={`${userProfile.name} ${userProfile.lastname} profile picture`}
                fill
                className="object-cover"
                sizes="81px"
                priority
              />
            </div>

            {/* User Info */}
            <div className="flex flex-col items-start">
              {/* User Name */}
              <h1 className="text-gray-900 dark:text-white text-[36px] font-semibold -tracking-[0.72px] m-0 whitespace-nowrap">
                {userProfile.userType === "professor" && (t("professor.dr") || "Dr.")} {userProfile.name} {userProfile.lastname}
              </h1>

              {/* Title/Level */}
              <p className="text-[#7C7C7C] dark:text-[#A0A0A0] text-[20px] font-medium leading-[30px] -tracking-[0.4px]">
                {userProfile.title}
              </p>
            </div>
          </div>

          {/* Language & Theme Switcher Section */}
          <div
            className="flex items-center"
            style={{ gap: NAVBAR_STYLES.actionsSection.gap }}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Theme Toggle */}
            <ThemeToggleButton />
          </div>
        </nav>
      </div>
    </header>
  )
}