"use client"

import type { Lesson, Chapter, Module } from "@/types/modules"
import LessonsGrid from "./LessonsGrid"
import { useLanguage } from "@/hooks/useLanguage"
import { RTL_LANGUAGES } from "@/lib/language"

interface LessonsSectionProps {
  lessons: any[]
  isMobile?: boolean
  userLevel?: number
  chapterData?: Chapter
  moduleData?: Module
}

export default function LessonsSection({
  lessons,
  isMobile = false,
  userLevel,
  chapterData,
  moduleData,
}: LessonsSectionProps) {
  const { isRTL } = useLanguage()

  return (
    <section style={{ direction: isRTL ? "rtl" : "ltr" }}>
      <LessonsGrid
        lessons={lessons}
        isMobile={isMobile}
        userLevel={userLevel}
        chapterData={chapterData}
        moduleData={moduleData}
      />
    </section>
  )
}
