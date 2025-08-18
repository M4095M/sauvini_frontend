"use client"

import Image from "next/image"
import { useLanguage } from "@/hooks/useLanguage"
import Button from "@/components/ui/button"
import type { Exam } from "@/types/modules"

interface ExamCardProps {
  exam: Exam
  isMobile?: boolean
}

const getStatusColor = (status: Exam["status"]) => {
  switch (status) {
    case "new":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    case "submitted":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    case "passed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "failed":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    case "archived":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }
}

const getStatusText = (status: Exam["status"]) => {
  switch (status) {
    case "new":
      return "New"
    case "submitted":
      return "Submitted"
    case "passed":
      return "Passed"
    case "failed":
      return "Failed"
    case "archived":
      return "Archived"
    default:
      return status
  }
}

export default function ExamCard({ exam, isMobile = false }: ExamCardProps) {
  const { t, language, isRTL } = useLanguage()

  // Prefer Arabic fields if available, else EN
  const pick = (en?: string, ar?: string) => {
    if (language === "ar" && ar && ar.trim()) return ar
    return en || ""
  }

  const moduleLabel = pick(exam.moduleName, (exam as any).moduleNameAr)
  const chapterLabel = pick(exam.chapterName, (exam as any).chapterNameAr)

  // Shared image block (show full image, not cropped)
  const Picture = (
    <div
      style={{
        width: 93,
        height: 60,
        flexShrink: 0,
        aspectRatio: "29/19",
      }}
    >
      <Image
        src={exam.chapterImage}
        alt={chapterLabel || exam.chapterName}
        width={93}
        height={60}
        className="w-full h-full object-contain"
      />
    </div>
  )

  // Mobile Card
  if (isMobile) {
    return (
      <div
        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-[#7C7C7C] rounded-[28px]"
        style={{
          display: "flex",
          padding: "20px 24px 44px 24px",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 16,
          alignSelf: "stretch",
          direction: isRTL ? "rtl" : "ltr",
        }}
      >
        <div
          className={isRTL ? "flex-row-reverse" : ""}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 16,
            alignSelf: "stretch",
          }}
        >
          {Picture}

          <div
            className={isRTL ? "items-end" : "items-start"}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 4,
              flex: "1 0 0",
            }}
          >
            <span className={`text-sm text-gray-500 dark:text-gray-400 ${isRTL ? "font-arabic" : "font-sans"}`}>
              {moduleLabel}
            </span>
            <h3 className={`text-base font-medium text-gray-900 dark:text-white ${isRTL ? "font-arabic" : "font-sans"}`}>
              {chapterLabel}
            </h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(exam.status)}`}>
              {t?.(`exams.${exam.status}`) || getStatusText(exam.status)}
            </span>
          </div>
        </div>

        <Button state="outlined" size="M" icon_position="none" text={t("exams.details") || "Details"} />
      </div>
    )
  }

  // Desktop Card
  return (
    <div
      className="bg-white dark:bg-gray-800 border border-[#BDBDBD] dark:border-gray-600"
      style={{
        display: "flex",
        width: 373,
        height: 200,
        padding: "24px 24px 8px 24px",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        borderRadius: 28,
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <div
        className={isRTL ? "flex-row-reverse" : ""}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 12,
          alignSelf: "stretch",
        }}
      >
        {Picture}

        <div
          className={isRTL ? "items-end" : "items-start"}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 4,
            flex: "1 0 0",
          }}
        >
          <span className={`text-sm text-gray-500 dark:text-gray-400 ${isRTL ? "font-arabic" : "font-sans"}`}>
            {moduleLabel}
          </span>
          <h3 className={`text-base font-medium text-gray-900 dark:text-white ${isRTL ? "font-arabic" : "font-sans"}`}>
            {chapterLabel}
          </h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(exam.status)}`}>
            {t?.(`exams.${exam.status}`) || getStatusText(exam.status)}
          </span>
        </div>
      </div>

      {/* Spacer to push button to bottom */}
      <div className="flex-1" />

      {/* Details Button */}
      <Button
        state="outlined"
        size="M"
        icon_position="none"
        text={t("exams.details") || "Details"}
      />
    </div>
  )
}