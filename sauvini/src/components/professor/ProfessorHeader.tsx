"use client"

import Image from "next/image"
import { Bell } from "lucide-react"
import Button from "@/components/ui/button"
import type { ProfessorUser } from "@/types/professor"
import { LanguageSwitcher } from "../ui/language-switcher"
import { useLanguage } from "@/hooks/useLanguage"

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

      {/* Actions Section: Notifications, Language Switcher */}
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
      </div>
    </header>
  )
}
