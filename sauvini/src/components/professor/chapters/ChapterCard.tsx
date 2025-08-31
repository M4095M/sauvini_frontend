"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChevronRight, ChevronLeft, CheckCircle, Clock, Eye } from "lucide-react"
import type { Chapter } from "@/types/modules"
import { useLanguage } from "@/hooks/useLanguage"
import { RTL_LANGUAGES } from "@/lib/language"

interface ProfessorChapterCardProps {
  chapter: Chapter
  moduleColor: string
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

// mock chapter state logic
const getChapterState = (chapter: Chapter) => {
  const statusObj = (chapter as any).status
  if (statusObj && typeof statusObj === "object") {
    if (statusObj.hasPublishedVersion) {
      return { status: "published", priority: "published" }
    }
    if (statusObj.hasValidatedVersion) {
      return { status: "validated", priority: "validated" }
    }
    if (statusObj.hasWaitingVersion) {
      return { status: "waiting", priority: "waiting" }
    }
  }

  // Fallback deterministic logic (MOCK THO)
  const totalLessons = chapter.totalLessons || (Array.isArray(chapter.lessons) ? chapter.lessons.length : 0)

  if (totalLessons === 0) {
    return { status: "waiting", priority: "waiting" }
  }
  return { status: "published", priority: "published" }
}

const getStatusConfig = (priority: string, t: (key: string) => string) => {
  switch (priority) {
    case "published":
      return {
        label: t("professor.chapters.status.published"),
        color: "#22C55E",
        bgColor: "#DCFCE7",
        icon: Eye,
      }
    case "validated":
      return {
        label: t("professor.chapters.status.validated"),
        color: "#3B82F6",
        bgColor: "#DBEAFE",
        icon: CheckCircle,
      }
    case "waiting":
    default:
      return {
        label: t("professor.chapters.status.waiting"),
        color: "#F59E0B",
        bgColor: "#FEF3C7",
        icon: Clock,
      }
  }
}

export default function ProfessorChapterCard({
  chapter,
  moduleColor,
  isRTL: propIsRTL,
  isMobile = false,
  className = "",
}: ProfessorChapterCardProps) {
  const { t, language } = useLanguage()
  const router = useRouter()
  const isRTL = propIsRTL !== undefined ? propIsRTL : RTL_LANGUAGES.includes(language)

  // Computed values
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight
  const totalLessons = chapter.totalLessons || 0
  const chapterColor = COLOR_MAP[moduleColor] || "#6B7280"
  const chapterState = getChapterState(chapter)
  const statusConfig = getStatusConfig(chapterState.priority, t)
  const StatusIcon = statusConfig.icon

  // Check if chapter is complete (has lessons and exam)
  const isComplete = totalLessons > 0 && chapter.lessons && chapter.lessons.length > 0

  // Event handlers
  const handleChapterClick = () => {
    const moduleId = chapter.moduleId || ""
    const url = `/professor/manage-chapter?chapterId=${encodeURIComponent(chapter.id)}&moduleId=${encodeURIComponent(
      moduleId
    )}`
    router.push(url)
  }

  // Utility functions
  const truncateDescription = (text: string, maxLength = 100): string => {
    return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          handleChapterClick()
        }
      }}
      className={`
        flex w-[373px] min-h-[260px] flex-col items-start gap-[8px] rounded-[28px] 
        transition-all duration-200 hover:shadow-md cursor-pointer
        border border-[#BDBDBD] bg-white
        dark:border-[#7C7C7C] dark:bg-[#1A1A1A]
        ${className}
      `}
      style={{ padding: "16px 24px 20px 24px" }}
      onClick={handleChapterClick}
    >
      <div className="flex flex-col items-start gap-2 self-stretch h-full">
        {/* Icon + Title + Description + Arrow */}
        <div className={`flex justify-between items-start self-stretch`} dir={isRTL ? "rtl" : "ltr"}>
          {/* Icon and content */}
          <div className={`flex items-start gap-3 flex-1`} dir={isRTL ? "rtl" : "ltr"}>
            {/* Chapter Icon */}
            <div className="flex justify-center items-center w-[60px] h-[60px] flex-shrink-0">
              <Image
                src={chapter.image || "/placeholder.svg?height=70&width=72&query=chapter"}
                alt={`${chapter.title} illustration`}
                width={60}
                height={60}
                className="object-cover"
              />
            </div>

            {/* Title and description */}
            <div className={`flex flex-col gap-1 flex-1`} dir={isRTL ? "rtl" : "ltr"}>
              <h3
                className={`font-semibold text-base leading-tight 
                             text-gray-900 dark:text-white 
                             ${isRTL ? "text-right font-arabic" : "text-left font-sans"}`}
              >
                {chapter.title}
              </h3>
              <p
                className={`text-xs leading-relaxed line-clamp-2 
                           text-gray-600 dark:text-gray-300
                           ${isRTL ? "text-right font-arabic" : "text-left font-sans"}`}
              >
                {truncateDescription(chapter.description, 80)}
              </p>
            </div>
          </div>

          {/* Arrow */}
          <ChevronIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-1" />
        </div>

        {/* Content Section */}
        <div className="flex flex-col gap-2.5 self-stretch mt-auto">
          {/* Academic Stream Tags */}
          <div
            className={`flex flex-wrap items-center gap-1.5 ${isRTL ? "justify-end" : "justify-start"}`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {chapter.academicStreams.slice(0, 3).map((stream) => (
              <span
                key={stream}
                className={`text-xs font-medium text-white px-2.5 py-1 rounded-full flex-shrink-0 ${isRTL ? "font-arabic" : "font-sans"}`}
                style={{
                  backgroundColor: chapterColor,
                  fontSize: "11px",
                  lineHeight: "1.3",
                }}
              >
                {t(`professor.academicStreams.${stream.toLowerCase().replace(/[^a-z0-9]/g, "")}`)}
              </span>
            ))}
            {chapter.academicStreams.length > 3 && (
              <span
                className={`text-xs font-medium text-gray-500 dark:text-gray-400 ${isRTL ? "font-arabic" : "font-sans"}`}
              >
                +{chapter.academicStreams.length - 3}
              </span>
            )}
          </div>

          {/* Status Indicator */}
          <div
            className={`flex items-center gap-2 ${isRTL ? "justify-end" : "justify-start"}`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ backgroundColor: statusConfig.bgColor }}
            >
              <StatusIcon className="w-3 h-3" style={{ color: statusConfig.color }} />
              <span
                className={`text-xs font-medium ${isRTL ? "font-arabic" : "font-sans"}`}
                style={{ color: statusConfig.color }}
              >
                {statusConfig.label}
              </span>
            </div>
          </div>

          {/* Lessons Count */}
          <div
            className={`flex items-center ${isRTL ? "justify-end" : "justify-start"}`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <p
              className={`text-xs text-gray-500 dark:text-gray-400 font-medium ${isRTL ? "font-arabic" : "font-sans"}`}
            >
              {t("professor.chapters.lessonsCount")}: {totalLessons}
            </p>
          </div>

          {/* Last Version */}
          <div
            className={`flex items-center ${isRTL ? "justify-end" : "justify-start"}`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <p
              className={`text-xs text-gray-500 dark:text-gray-400 font-medium ${isRTL ? "font-arabic" : "font-sans"}`}
            >
              {t("professor.chapters.lastVersion")}: Under review
            </p>
          </div>

          {/* Completion Status */}
          {!isComplete && (
            <div
              className={`flex items-center gap-1.5 ${isRTL ? "justify-end flex-row-reverse" : "justify-start"}`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              <span className={`text-xs text-gray-500 dark:text-gray-400 ${isRTL ? "font-arabic" : "font-sans"}`}>
                {t("professor.chapters.incomplete")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}