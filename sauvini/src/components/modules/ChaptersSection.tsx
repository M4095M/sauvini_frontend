"use client"

import ChaptersGrid from "./ChaptersGrid"
import type { Chapter, Module } from "@/types/modules"
import { useLanguage } from "@/hooks/useLanguage"
import { RTL_LANGUAGES } from "@/lib/language"

interface ChaptersSectionProps {
  chapters: Chapter[]
  isMobile?: boolean
  userLevel?: number
  moduleData?: Module   
}

export default function ChaptersSection({
  chapters,
  isMobile = false,
  userLevel,
  moduleData,         
}: ChaptersSectionProps) {
  const { isRTL } = useLanguage()

  return (
    <section style={{ direction: isRTL ? "rtl" : "ltr" }}>
      <ChaptersGrid
        chapters={chapters}
        isMobile={isMobile}
        userLevel={userLevel}
        moduleData={moduleData}   
      />
    </section>
  )
}
