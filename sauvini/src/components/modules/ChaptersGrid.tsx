"use client"

import Image from "next/image"
import { Heart, Bell, Menu } from "lucide-react"
import type { Chapter, Module } from "@/types/modules"
import ChapterCard from "./ChapterCard"
import { useLanguage } from "@/hooks/useLanguage"
import MobileContentSummary from "./MobileContentSummary" 
import { useSidebar } from "@/context/SidebarContext"

interface ChaptersGridProps {
  chapters: Chapter[]
  showPurchasedOnly?: boolean
  onToggleChange?: (v: boolean) => void
  isMobile?: boolean
  userLevel?: number
  moduleData?: Module           
}

export default function ChaptersGrid({
  chapters,
  showPurchasedOnly,
  onToggleChange,
  isMobile = false,
  userLevel = 6,
  moduleData,                   
}: ChaptersGridProps) {
  const { t, isRTL } = useLanguage()
  const { toggle } = useSidebar()
  const noChapters = chapters.length === 0

  if (isMobile) {
    return (
      <div
        className="flex flex-col items-stretch self-stretch w-full flex-1 min-w-0 rounded-[52px] bg-[#F8F8F8] dark:bg-[#1A1A1A]"
        style={{ padding: "24px 12px", gap: "12px", direction: isRTL ? "rtl" : "ltr" }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Mobile top bar */}
        <div className={`flex justify-between items-end w-full px-4 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Image src="/S_logo.svg" alt="Sauvini S Logo" width={40} height={40} className="dark:brightness-150" />
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="flex items-center gap-2 bg-[#DCE6F5] dark:bg-[#2B3E5A] px-3 py-2 rounded-full">
              <Heart className="w-4 h-4 text-[#324C72] dark:text-[#90B0E0] fill-current" />
              <span className={`text-sm font-medium text-gray-700 dark:text-gray-300 ${isRTL ? "font-arabic" : "font-sans"}`}>
                {t("modules.level")} {userLevel}
              </span>
            </div>
            <button 
              className="flex items-center justify-center w-10 h-10 bg-[#DCE6F5] dark:bg-[#2B3E5A] rounded-full"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-[#324C72] dark:text-[#90B0E0]" />
            </button>
            <button 
              className="flex items-center justify-center w-10 h-10 bg-[#DCE6F5] dark:bg-[#2B3E5A] rounded-full"
              onClick={toggle}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-[#324C72] dark:text-[#90B0E0]" />
            </button>
          </div>
        </div>

        {/* Mobile content summary */}
        {moduleData && (
          <MobileContentSummary
            title={moduleData.name}
            description={moduleData.description}
            completed={moduleData.completedLessons || 0}
            total={moduleData.totalLessons || 0}
            color={moduleData.color}
          />
        )}

        {/* Title + grid */}
        <div className="w-full px-4 mt-4">
          <h2 className={`text-xl font-bold text-gray-900 dark:text-white mb-4 ${isRTL ? "text-right font-arabic" : "text-left font-sans"}`}>
            {t("chapters.chaptersTitle")}
          </h2>

          {noChapters ? (
            <div className="flex flex-col items-center justify-center w-full py-16">
              <p className={`text-lg text-gray-500 dark:text-gray-400 text-center ${isRTL ? "font-arabic" : "font-sans"}`}>
                {t("chapters.noPurchasedChapters")}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 w-full grid-cols-1">
              {chapters.map((chapter) => (
                <ChapterCard key={chapter.id} chapter={chapter} />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex flex-col items-stretch self-stretch w-full flex-1 min-w-0 rounded-[52px] bg-[#F8F8F8] dark:bg-[#1A1A1A]"
      style={{ padding: "24px 12px", gap: "12px", direction: isRTL ? "rtl" : "ltr" }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Desktop: Chapters Title */}
      <div
        className={`flex items-center self-stretch ${isRTL ? "justify-end" : "justify-start"}`}
        style={{
          padding: "0 16px",
          gap: "10px",
        }}
      >
        <h2 className={`text-2xl font-bold text-gray-900 dark:text-white ${isRTL ? "text-right font-arabic" : "text-left font-sans"}`}>
          {t("chapters.chaptersTitle")}
        </h2>
      </div>

      {/* Chapters Grid */}
      <div className="w-full max-w-full px-4">
        {noChapters ? (
          <div className="flex flex-col items-center justify-center w-full py-16">
            <p className={`text-lg text-gray-500 dark:text-gray-400 text-center ${isRTL ? "font-arabic" : "font-sans"}`}>
              {t("chapters.noPurchasedChapters")}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {chapters.map((chapter) => (
              <ChapterCard key={chapter.id} chapter={chapter} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
