"use client";

import Image from "next/image"
import { useLanguage } from "@/hooks/useLanguage"
import type { Module, Chapter } from "@/types/modules"

// Mobile summary used for exams/exercises headers
function MobileContentSummary({
  title,
  description,
  pageType,
  isRTL,
}: {
  title: string
  description?: string
  pageType?: "exams" | "exercises"
  isRTL: boolean
}) {
  const borderClass =
    pageType === "exams" || pageType === "exercises"
      ? "border-[5px] border-[#A3BAD6]"
      : "border-[3px] border-[#90B0E0]"

  return (
    <div
      className={`bg-white dark:bg-gray-800 p-6 mx-4 mb-6 rounded-[32px] ${borderClass}`}
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      <h1
        className={`text-2xl font-bold text-[#324C72] dark:text-[#90B0E0] mb-3 ${
          isRTL ? "font-arabic text-right" : "font-sans text-left"
        }`}
      >
        {title}
      </h1>
      {description ? (
        <p
          className={`text-gray-600 dark:text-gray-300 leading-relaxed ${
            isRTL ? "font-arabic text-right" : "font-sans text-left"
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}

const getColorClasses = (color: Module["color"]) => {
  const colorMap: Record<NonNullable<Module["color"]>, string> = {
    yellow: "border-yellow-400",
    blue: "border-blue-400",
    purple: "border-purple-400",
    green: "border-green-400",
    red: "border-red-400",
  }
  return colorMap[color] || "border-blue-400"
}

const getProgressColorClasses = (color: Module["color"]) => {
  const colorMap: Record<NonNullable<Module["color"]>, string> = {
    yellow: "bg-yellow-400",
    blue: "bg-blue-400",
    purple: "bg-purple-400",
    green: "bg-green-400",
    red: "bg-red-400",
  }
  return colorMap[color] || "bg-blue-400"
}

type PageType = "exams" | "exercises" | "modules" | "chapters"

type ContentHeaderProps =
  | {
      // Page header (exams/exercises)
      pageType: "exams" | "exercises"
      title: string
      description?: string
      isMobile?: boolean
      // content mode props must be absent
      content?: undefined
      contentType?: undefined
      parentModule?: undefined
    }
  | {
      // Content header (modules/chapters)
      pageType?: "modules" | "chapters"
      title?: undefined
      description?: undefined
      isMobile?: boolean
      content: Module | Chapter
      contentType: "module" | "chapter"
      parentModule?: Module // required when contentType === "chapter"
    }

export default function ContentHeader(props: ContentHeaderProps) {
  const { t, language } = useLanguage()
  const isRTL = language === "ar"

  // PAGE MODE (exams/exercises)
  if (props.pageType === "exams" || props.pageType === "exercises") {
    const { title, description, isMobile = false, pageType } = props
    const illustrationSrc = pageType === "exercises" ? "/pana.svg" : "/amico.svg"

    if (isMobile) {
      return (
        <MobileContentSummary
          title={title}
          description={description}
          pageType={pageType}
          isRTL={isRTL}
        />
      )
    }

    return (
      <div
        className="relative flex h-[332px] w-full rounded-[56px] border-[5px] border-[#A3BAD6] mb-16 bg-[#F8F8F8] dark:bg-[#1A1A1A]"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Title and Description */}
        <div
          className={`flex w-[469px] flex-col gap-3 p-8 pt-12 items-start ${
            !isRTL ? "pr-8" : "pl-8"
          }`}
        >
          <h1
            className={`text-5xl font-bold text-gray-900 dark:text-white leading-tight ${
              isRTL ? "font-arabic" : "font-sans"
            }`}
          >
            {title}
          </h1>

          {description ? (
            <p
              className={`text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-md ${
                isRTL ? "font-arabic" : "font-sans"
              }`}
            >
              {description}
            </p>
          ) : null}
        </div>

        {/* Illustration */}
        <div
          className={`absolute top-0 z-10 flex w-[373px] h-[393px] flex-col justify-start items-center flex-shrink-0 ${
            isRTL ? "left-1/4" : "right-1/4"
          }`}
          style={{ transform: isRTL ? "translateX(-50%)" : "translateX(50%)" }}
        >
          <Image
            src={illustrationSrc}
            alt={title}
            width={373}
            height={393}
            className="w-full h-full object-contain object-top dark:brightness-110 dark:contrast-125"
            priority
          />
        </div>
      </div>
    )
  }

  // CONTENT MODE (modules/chapters)
  if (!("content" in props) || !props.content) return null

  const { content, contentType, parentModule, isMobile = false } = props

  // Progress + colors
  const getProgressData = () => {
    if (contentType === "module") {
      const module = content as Module
      return {
        completed: module.completedLessons || 0,
        total: module.totalLessons || 0,
        label: t("chapters.lesson"),
      }
    } else {
      const chapter = content as Chapter
      return {
        completed: chapter.completedLessons || 0,
        total: chapter.totalLessons || 0,
        label: t("lesson.lessonsTitle"),
      }
    }
  }

  const getContentColor = (): Module["color"] => {
    if (contentType === "module") {
      const module = content as Module
      return module.color
    }
    // chapter: use parent module color if provided
    return parentModule?.color || "blue"
  }

  const progressData = getProgressData()
  const progressPercentage =
    progressData.total > 0
      ? (progressData.completed / progressData.total) * 100
      : 0
  const contentColor = getContentColor()

  const getIllustration = () => {
    if (contentType === "module") {
      return (content as Module).illustration
    }
    return (content as Chapter).image
  }

  const getContentTitle = () => {
    if (contentType === "module") {
      return (content as Module).name
    }
    return (content as Chapter).title
  }

  return (
    <div
      className={`relative flex h-[332px] w-full rounded-[56px] border-[5px] mb-16 bg-[#F8F8F8] dark:bg-[#1A1A1A] ${getColorClasses(
        contentColor
      )}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Title and Description */}
      <div
        className={`flex w-[469px] flex-col gap-3 p-8 pt-12 items-start ${
          !isRTL ? "pr-8" : "pl-8"
        }`}
      >
        <h1
          className={`text-5xl font-bold text-gray-900 dark:text-white leading-tight ${
            isRTL ? "font-arabic" : "font-sans"
          }`}
        >
          {getContentTitle()}
        </h1>

        {"description" in content && content.description ? (
          <p
            className={`text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-md ${
              isRTL ? "font-arabic" : "font-sans"
            }`}
          >
            {(content as any).description}
          </p>
        ) : null}
      </div>

      {/* Progress */}
      <div className="absolute bottom-6 left-8 right-8 flex flex-col gap-2 w-fit">
        <div className="w-80 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getProgressColorClasses(
              contentColor
            )}`}
            style={{
              width: `${progressPercentage}%`,
              [isRTL ? "right" : "left"]: 0,
            }}
          />
        </div>

        <span
          className={`text-base text-gray-500 dark:text-gray-400 font-medium self-end ${
            isRTL ? "font-arabic" : "font-sans"
          }`}
        >
          {progressData.completed}/{progressData.total} {progressData.label}
        </span>
      </div>

      {/* Illustration */}
      <div
        className={`absolute top-0 z-10 flex w-[373px] h-[393px] flex-col justify-start items-center flex-shrink-0 ${
          isRTL ? "left-1/4" : "right-1/4"
        }`}
        style={{ transform: isRTL ? "translateX(-50%)" : "translateX(50%)" }}
      >
        <img
          src={getIllustration() || "/placeholder.svg"}
          alt={getContentTitle()}
          className="w-full h-full object-contain object-top dark:brightness-110 dark:contrast-125"
        />
      </div>
    </div>
  )
}
