"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChevronRight, ChevronLeft } from "lucide-react"
import type { Module } from "@/types/modules"
import { useLanguage } from "@/hooks/useLanguage"
import { RTL_LANGUAGES } from "@/lib/language"
import Tag from "@/components/professor/tag"

interface ProfessorModuleCardProps {
  module: Module
  isRTL?: boolean
  isMobile?: boolean
  className?: string
}

// Module color mapping
const COLOR_MAP: Record<string, string> = {
  yellow: "#FFD427",
  blue: "#27364D",
  purple: "#9663FE",
  green: "#22C55E",
  red: "#EF4444",
} as const

// Card styling constants
const CARD_STYLES = {
  desktop: {
    width: 373,
    height: 220,
    padding: "20px 24px 30px 24px",
  },
  mobile: {
    height: 220,
    padding: "20px 20px 30px 24px",
  },
} as const

const ILLUSTRATION_SIZE = {
  width: 114,
  height: 120,
} as const

// Configuration
const MAIN_ACADEMIC_STREAMS = ["Mathematics", "Experimental Sciences", "Literature", "Math-Technique"]

export default function ProfessorModuleCard({
  module,
  isRTL: propIsRTL,
  isMobile = false,
  className = "",
}: ProfessorModuleCardProps) {
  const { t, language } = useLanguage()
  const router = useRouter()
  const isRTL = propIsRTL !== undefined ? propIsRTL : RTL_LANGUAGES.includes(language)

  // Computed values
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight
  const numberOfChapters = module.chapters?.length || 0
  const coversAllStreams = MAIN_ACADEMIC_STREAMS.every((stream) => module.academicStreams.includes(stream))
  const cardStyles = isMobile ? CARD_STYLES.mobile : CARD_STYLES.desktop
  const moduleColor = COLOR_MAP[module.color] || "#6B7280" 

  // Event handlers
  const handleModuleClick = () => {
    router.push(`/professor/manage-content/${module.id}`)
  }

  // Utility functions
  const truncateDescription = (text: string, maxLength = 90): string => {
    return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text
  }

  return (
    <div
      className={`
        relative flex items-center justify-center
        rounded-[28px] border border-gray-300 bg-white
        dark:border-[#7C7C7C] dark:bg-[#1A1A1A]
        transition-all duration-200 hover:shadow-lg cursor-pointer hover:shadow-md
        ${isMobile ? "self-stretch" : ""}
        ${className}
      `}
      style={cardStyles}
      onClick={handleModuleClick}
    >
      
      <div
        className="flex flex-col items-start gap-2"
        style={{
          width: 325,
          flexShrink: 0,
          height: "100%",
          paddingTop: 2,
          paddingBottom: 6,
        }}
      >
        {/* Illustration + Module Info */}
        <div className={`flex w-full items-start gap-4`} dir={isRTL ? "rtl" : "ltr"}>
          {/* Module Illustration */}
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

          {/* Module Content */}
          <div className="flex-1 min-w-0 flex flex-col justify-between" style={{ height: ILLUSTRATION_SIZE.height }}>
            <div>
              {/* Title + Action Icon */}
              <div className={`flex items-start justify-between gap-2`} dir={isRTL ? "rtl" : "ltr"}>
                <h3
                  className={`
                    text-xl font-semibold text-gray-900 dark:text-white leading-tight
                    ${isRTL ? "text-right font-arabic" : "text-left font-sans"}
                  `}
                >
                  {module.name}
                </h3>
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

        {/* Chapter Count */}
        <div className="w-full mt-2">
          <p
            className={`text-sm text-gray-500 dark:text-gray-400 font-medium ${
              isRTL ? "text-right font-arabic" : "text-left font-sans"
            }`}
          >
            {t("professor.numberOfChapters")} {numberOfChapters}
          </p>
        </div>

        {/*Academic Stream */}
        <div className="w-full mt-auto mb-4">
          <div
            className={`flex flex-wrap items-center gap-1 ${isRTL ? "justify-end" : "justify-start"}`}
            style={{
              maxWidth: "100%",
              lineHeight: 1.2,
            }}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {coversAllStreams ? (
              // Show "All" tag when module covers all streams
              <span className="inline-flex rounded-full" style={{ backgroundColor: moduleColor }}>
                <Tag
                  icon={null}
                  text={t("professor.academicStreams.all")}
                  className={`text-[11px] font-medium text-white px-2 py-0.5 ${isRTL ? "font-arabic" : "font-sans"}`}
                />
              </span>
            ) : (
              module.academicStreams.map((stream) => (
                <span key={stream} className="inline-flex rounded-full" style={{ backgroundColor: moduleColor }}>
                  <Tag
                    icon={null}
                    text={t(`professor.academicStreams.${stream.toLowerCase().replace(/[^a-z0-9]/g, "")}`)}
                    className={`text-[11px] font-medium text-white px-2 py-0.5 ${isRTL ? "font-arabic" : "font-sans"}`}
                  />
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
