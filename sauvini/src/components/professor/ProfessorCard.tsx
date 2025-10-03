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
      className={`w-full max-w-[1176px] mx-auto min-h-[342px] flex flex-col md:flex-row items-center rounded-[56px] border-4 md:border-[5px] border-[var(--BASE-Primary-100,#A3BAD6)] bg-[var(--Surface-Level-2,#F8F8F8)] dark:bg-[#1A1A1A] overflow-hidden relative p-6 md:p-0 gap-6 md:gap-0 ${className}`}
      role="region"
      aria-label={`${t("professor.dr")} ${professor.firstName} ${professor.lastName} profile card`}
    >
      {/* Profile Picture - LTR */}
      {!isRTL && (
        <div className="inline-flex items-center justify-center w-[160px] h-[160px] md:w-[232px] md:h-[232px] md:ml-8 rounded-[32px] md:rounded-[48px] overflow-hidden flex-shrink-0 bg-neutral-200 dark:bg-neutral-800">
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
      <div className={`flex-1 min-w-0 flex flex-col justify-center py-4 md:py-6 md:mx-8 ${isRTL ? "items-end" : "items-start"}`}>
        {/* Professor Name */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white leading-tight truncate w-full">
          {professor.firstName} {professor.lastName}
        </h2>
        
        {/* Module and Title */}
        <div className="mt-2 text-base md:text-lg text-neutral-500 dark:text-neutral-400 truncate w-full">
          {primaryModule} {t("professor.professor") || "Professor"}
        </div>
      </div>

      {/* Profile Picture - RTL */}
      {isRTL && (
        <div className="inline-flex items-center justify-center w-[160px] h-[160px] md:w-[232px] md:h-[232px] md:mr-8 rounded-[32px] md:rounded-[48px] overflow-hidden flex-shrink-0 bg-neutral-200 dark:bg-neutral-800">
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