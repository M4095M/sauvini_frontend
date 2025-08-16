"use client"

import Image from "next/image"
import { Heart, Bell } from "lucide-react"
import type { Lesson } from "@/types/modules"
import LessonCard from "./LessonCard"
import { useLanguage } from "@/hooks/useLanguage"
import { RTL_LANGUAGES } from "@/lib/language"

interface LessonsGridProps {
  lessons: Lesson[]
  isMobile?: boolean
  userLevel?: number
}

export default function LessonsGrid({ lessons, isMobile = false, userLevel = 6 }: LessonsGridProps) {
  const { t, language } = useLanguage()
  const isRTL = RTL_LANGUAGES.includes(language)

  if (isMobile) {
    return (
      <div
        className="flex flex-col items-start self-stretch rounded-[52px] bg-[#F8F8F8] dark:bg-[#1A1A1A] w-full"
        style={{ padding: "24px 12px", gap: "12px", direction: isRTL ? "rtl" : "ltr" }}
      >
        {/* Mobile Top Bar */}
        <div className={`flex justify-between items-end w-full px-4 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
          <div>
            <Image src="/S_logo.svg" alt="Sauvini S Logo" width={40} height={40} className="dark:brightness-150" />
          </div>

          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="flex items-center gap-2 bg-[#E6EBF4] dark:bg-[#324C72] px-3 py-2 rounded-full">
              <Heart className="w-4 h-4 text-[#324C72] dark:text-[#90B0E0] fill-current" />
              <span className={`text-sm font-medium text-[#324C72] dark:text-[#CEDAE9] ${isRTL ? "font-arabic" : "font-sans"}`}>
                {t("modules.level")} {userLevel}
              </span>
            </div>

            <button className="flex items-center justify-center w-10 h-10 bg-[#324C72] dark:bg-[#213757] rounded-full">
              <Bell className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Lessons Content */}
        <div className="flex flex-col items-start w-full px-4 gap-6">
          {/* Title */}
          <h2 className={`text-xl font-bold text-gray-900 dark:text-white ${isRTL ? "text-right font-arabic" : "text-left font-sans"}`}>
            {t("lesson.lessonsTitle")}
          </h2>

          <div className="w-full flex flex-col gap-6">
            {lessons.length === 0 ? (
              <div className="flex flex-col items-center justify-center w-full py-16">
                <p className={`text-lg text-gray-500 dark:text-gray-400 text-center ${isRTL ? "font-arabic" : "font-sans"}`}>
                  {t("lesson.noLessons")}
                </p>
              </div>
            ) : (
              lessons.map((lesson, index) => (
                <LessonCard key={lesson.id} lesson={lesson} lessonNumber={index + 1} />
              ))
            )}
          </div>
        </div>
      </div>
    )
  }

  // Desktop 
  return (
    <div
      className="flex flex-col items-start self-stretch rounded-[52px] bg-[#F8F8F8] dark:bg-[#1A1A1A] w-full"
      style={{ padding: "24px 12px", gap: "12px", direction: isRTL ? "rtl" : "ltr" }}
    >
      <div className={`flex items-center self-stretch ${isRTL ? "justify-end" : "justify-start"}`} style={{ padding: "0 16px" }}>
        <h2 className={`text-2xl font-bold text-gray-900 dark:text-white ${isRTL ? "text-right font-arabic" : "text-left font-sans"}`}>
          {t("lesson.lessonsTitle")}
        </h2>
      </div>

      <div className="w-full px-4">
        {lessons.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full py-16">
            <p className={`text-lg text-gray-500 dark:text-gray-400 text-center ${isRTL ? "font-arabic" : "font-sans"}`}>
              {t("lesson.noLessons")}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {lessons.map((lesson, index) => (
              <LessonCard key={lesson.id} lesson={lesson} lessonNumber={index + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
