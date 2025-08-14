"use client"

import type { Lesson } from "@/types/modules"
import LessonCard from "./LessonCard"
import { useLanguage } from "@/hooks/useLanguage"
import { RTL_LANGUAGES } from "@/lib/language"

interface LessonsGridProps {
  lessons: Lesson[]
  isMobile?: boolean
}

export default function LessonsGrid({ lessons, isMobile = false }: LessonsGridProps) {
  const { t, language } = useLanguage()
  const isRTL = RTL_LANGUAGES.includes(language)

  return (
    <div
      className="flex flex-col items-start self-stretch rounded-[52px] bg-[#F8F8F8] dark:bg-[#1A1A1A]"
      style={{
        padding: "24px 12px",
        gap: "12px",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      {/* Desktop: Lessons Title with padding */}
      {!isMobile && (
        <div
          className={`flex items-center self-stretch ${isRTL ? "justify-end" : "justify-start"}`}
          style={{
            padding: "0 16px",
            gap: "10px",
          }}
        >
          <h2 className={`text-2xl font-bold text-gray-900 dark:text-white ${isRTL ? "text-right font-arabic" : "text-left font-sans"}`}>
            {t("lesson.lessonsTitle")}
          </h2>
        </div>
      )}

      {/* Lessons Cards Frame */}
      <div
        className="flex flex-col items-start self-stretch"
        style={{
          gap: "28px",
        }}
      >
        {lessons.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full py-16">
            <p className={`text-lg text-gray-500 dark:text-gray-400 text-center ${isRTL ? "font-arabic" : "font-sans"}`}>
              {t("lesson.noLessons")}
            </p>
          </div>
        ) : (
          lessons.map((lesson, index) => (
            <LessonCard 
              key={lesson.id} 
              lesson={lesson} 
              lessonNumber={index + 1}
            />
          ))
        )}
      </div>
    </div>
  )
}
