"use client"

import { useState } from "react"
import type { Chapter } from "@/types/modules"
import ChaptersGrid from "./ChaptersGrid"
import { useLanguage } from "@/hooks/useLanguage"
import { RTL_LANGUAGES } from "@/lib/language"

interface ChaptersSectionProps {
  chapters: Chapter[]
  isMobile?: boolean
  userLevel?: number
}

export default function ChaptersSection({ chapters, isMobile = false, userLevel }: ChaptersSectionProps) {
  const [showPurchasedOnly, setShowPurchasedOnly] = useState(false)
  const { language } = useLanguage()
  const isRTL = RTL_LANGUAGES.includes(language)

  const filteredChapters = showPurchasedOnly ? chapters.filter((chapter) => chapter.isPurchased) : chapters

  return (
    <section style={{ direction: isRTL ? "rtl" : "ltr" }}>
      <ChaptersGrid
        chapters={filteredChapters}
        showPurchasedOnly={showPurchasedOnly}
        onToggleChange={setShowPurchasedOnly}
        isMobile={isMobile}
        userLevel={userLevel}
      />
    </section>
  )
}
