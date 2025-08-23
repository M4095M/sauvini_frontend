"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChevronRight, ChevronLeft } from "lucide-react"
import type { Module } from "@/types/modules"
import { useLanguage } from "@/hooks/useLanguage"
import { RTL_LANGUAGES } from "@/lib/language"

interface ProfessorModuleCardProps {
  module: Module
  isRTL?: boolean
  isMobile?: boolean
  className?: string
}

const ACADEMIC_STREAM_COLORS = {
  Mathematics: "#3B82F6",
  "Experimental Sciences": "#10B981",
  Literature: "#8B5CF6",
  Philosophy: "#F59E0B",
  "Math-Technique": "#EF4444",
  All: "#6B7280",
} as const

const ILLUSTRATION_SIZE = {
  width: 114,
  height: 120,
} as const

const MAIN_ACADEMIC_STREAMS = ["Mathematics", "Experimental Sciences", "Literature", "Philosophy"]

export default function ProfessorModuleCard({
  module,
  isRTL: propIsRTL,
  isMobile = false,
  className = "",
}: ProfessorModuleCardProps) {
  const { t, language } = useLanguage()
  const router = useRouter()
  const isRTL = propIsRTL !== undefined ? propIsRTL : RTL_LANGUAGES.includes(language)

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight
  const numberOfChapters = module.chapters?.length || 0

  // Check if module covers all main academic streams
  const coversAllStreams = MAIN_ACADEMIC_STREAMS.every((stream) => module.academicStreams.includes(stream))

  const handleModuleClick = () => {
    router.push(`/professor/modules/${module.id}`)
  }

  const truncateDescription = (text: string, maxLength = 90): string => {
    return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text
  }

  return (
    <div
      className={`
        relative cursor-pointer transition-all duration-200 hover:shadow-lg
        ${className}
      `}
      style={{
        display: "flex",
        width: isMobile ? "100%" : 373,
        height: 220,
        padding: "20px 24px 30px 24px",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 28,
        border: "1px solid var(--Card-Outline-Default, #BDBDBD)",
        background: "var(--Card-Bg-Default, #FFF)",
      }}
      onClick={handleModuleClick}
    >
      {/* Internal frame */}
      <div className="flex flex-col items-start gap-2" style={{ width: 325, flexShrink: 0, height: "100%" }}>
        {/* Top Row: illustration + info */}
        <div className={`flex w-full items-start gap-4`} dir={isRTL ? "rtl" : "ltr"}>
          {/* Illustration */}
          <div
            className="relative flex-shrink-0 flex items-center justify-center"
            style={{
              width: ILLUSTRATION_SIZE.width,
              height: ILLUSTRATION_SIZE.height,
              padding: "3px 0 3.458px 0",
            }}
          >
            <Image
              src={module.illustration || "/placeholder.svg"}
              alt={`${module.name} illustration`}
              fill
              className="object-contain"
              sizes="114px"
            />
          </div>

          {/* Module info */}
          <div className="flex-1 min-w-0 flex flex-col justify-between" style={{ height: ILLUSTRATION_SIZE.height }}>
            <div>
              <div className={`flex items-start justify-between gap-2`} dir={isRTL ? "rtl" : "ltr"}>
                {/* Module title */}
                <h3
                  className={`
                  text-xl font-semibold text-gray-900 dark:text-white leading-tight
                  ${isRTL ? "text-right font-arabic" : "text-left font-sans"}
                `}
                >
                  {module.name}
                </h3>
                {/* Action icon */}
                <div className="flex-shrink-0 mt-1">
                  <ChevronIcon
                    className="w-5 h-5 text-gray-400 dark:text-gray-500 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                    aria-hidden="true"
                  />
                </div>
              </div>
              {/* Description */}
              <p
                className={`
                text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed
                ${isRTL ? "text-right font-arabic" : "text-left font-sans"}
              `}
              >
                {truncateDescription(module.description)}
              </p>
            </div>
          </div>
        </div>

        {/* Number of Chapters */}
        <div className="w-full mt-2">
          <p
            className={`text-sm text-gray-500 dark:text-gray-400 font-medium ${
              isRTL ? "text-right font-arabic" : "text-left font-sans"
            }`}
          >
            {language === "ar" ? `عدد الفصول: ${numberOfChapters}` : `Number of Chapters: ${numberOfChapters}`}
          </p>
        </div>

        {/* Academic Streams Tags */}
        <div className="w-full mt-auto">
          <div className={`flex flex-wrap gap-2 ${isRTL ? "justify-end" : "justify-start"}`}>
            {coversAllStreams ? (
              <span
                className="text-xs font-medium text-white"
                style={{
                  display: "flex",
                  padding: "6px 12px",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 20,
                  backgroundColor: ACADEMIC_STREAM_COLORS["All"],
                }}
              >
                {t("professor.academicStreams.all")}
              </span>
            ) : (
              module.academicStreams.map((stream) => (
                <span
                  key={stream}
                  className="text-xs font-medium text-white"
                  style={{
                    display: "flex",
                    padding: "6px 12px",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 20,
                    backgroundColor: ACADEMIC_STREAM_COLORS[stream] || "#6B7280",
                  }}
                >
                  {t(`professor.academicStreams.${stream.toLowerCase().replace(/[^a-z0-9]/g, "")}`)}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
