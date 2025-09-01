"use client"

import Image from "next/image"
import { useLanguage } from "@/hooks/useLanguage"
import type { ProfessorUser } from "@/types/professor"

interface Props {
  professor: ProfessorUser
  className?: string
}

export default function ProfessorCard({ professor, className = "" }: Props) {
  const { t, isRTL } = useLanguage()

  // Get the first assigned module name or fallback (general for now)
  const primaryModule = professor.assignedModules?.[0]?.name || t("professor.general") || "General"

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={`w-full h-[342px] flex items-center rounded-[56px] border-[5px] border-[var(--BASE-Primary-100,#A3BAD6)] bg-[var(--Surface-Level-2,#F8F8F8)] dark:bg-[#1A1A1A] overflow-hidden relative ${className}`}
      role="region"
      aria-label={`${t("professor.dr")} ${professor.firstName} ${professor.lastName} profile card`}
    >
      {/* Profile Picture */}
      {!isRTL && (
        <div className="ml-8 inline-flex items-center justify-center w-[232px] h-[232px] rounded-[48px] overflow-hidden flex-shrink-0 bg-neutral-200 dark:bg-neutral-800">
          <Image 
            src={professor.avatar || "/profile.png"} 
            alt={`${t("professor.dr")} ${professor.firstName} ${professor.lastName}`} 
            width={232} 
            height={232} 
            className="w-full h-full object-cover" 
          />
        </div>
      )}

      {/* Content Section */}
      <div className={`mx-8 flex-1 h-[232px] flex flex-col justify-center ${isRTL ? "items-end" : "items-start"}`}>
        {/* Professor Name */}
        <h2 className="text-4xl md:text-4xl font-bold text-neutral-900 dark:text-white leading-tight">
          {professor.firstName} {professor.lastName}
        </h2>
        
        {/* Module and Title */}
        <div className="mt-2 text-lg text-neutral-500 dark:text-neutral-400">
          {primaryModule} {t("professor.professor") || "Professor"}
        </div>
      </div>

      {/* Profile Picture */}
      {isRTL && (
        <div className="mr-8 inline-flex items-center justify-center w-[232px] h-[232px] rounded-[48px] overflow-hidden flex-shrink-0 bg-neutral-200 dark:bg-neutral-800">
          <Image 
            src={professor.avatar || "/profile.png"} 
            alt={`${t("professor.dr")} ${professor.firstName} ${professor.lastName}`} 
            width={232} 
            height={232} 
            className="w-full h-full object-cover" 
          />
        </div>
      )}
    </div>
  )
}