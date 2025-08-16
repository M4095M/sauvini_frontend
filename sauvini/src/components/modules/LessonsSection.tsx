"use client"

import type { Lesson } from "@/types/modules"
import LessonsGrid from "./LessonsGrid"
import { useLanguage } from "@/hooks/useLanguage"
import { RTL_LANGUAGES } from "@/lib/language"

interface LessonsSectionProps {
  lessons: Lesson[]
  isMobile?: boolean
  userLevel?: number
}

export default function LessonsSection({ lessons, isMobile = false, userLevel }: LessonsSectionProps) {
  const { language } = useLanguage()
  const isRTL = RTL_LANGUAGES.includes(language)

  return (
    <section style={{ direction: isRTL ? "rtl" : "ltr" }}>
      <LessonsGrid lessons={lessons} isMobile={isMobile} userLevel={userLevel} />
    </section>
  )
}
