"use client"

import Image from 'next/image'
import { Heart, Bell } from 'lucide-react'
import { Chapter } from '@/types/modules'
import ChapterCard from './ChapterCard'
import { useLanguage } from '@/hooks/useLanguage'
import { RTL_LANGUAGES } from '@/lib/language'

interface ChaptersGridProps {
  chapters: Chapter[]
  showPurchasedOnly: boolean
  onToggleChange: (value: boolean) => void
  isMobile?: boolean
  userLevel?: number
}

export default function ChaptersGrid({ 
  chapters, 
  showPurchasedOnly, 
  onToggleChange, 
  isMobile = false, 
  userLevel = 6 
}: ChaptersGridProps) {
  const { t, language } = useLanguage()
  const isRTL = RTL_LANGUAGES.includes(language)
  const noChapters = chapters.length === 0

  return (
    <div
      className="flex flex-col items-start self-stretch rounded-[52px] bg-[#F8F8F8] dark:bg-[#1A1A1A] w-full"
      style={{
        padding: "24px 12px",
        gap: "12px",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      {/* Mobile Header with Logo, Level, Notifications */}
      {isMobile && (
        <div className={`flex justify-between items-end w-full mb-6 px-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* S Logo */}
          <div>
            <Image
              src="/S_logo.svg"
              alt="Sauvini S Logo"
              width={40}
              height={40}
              className="dark:brightness-150" // Slightly brighten logo in dark mode
            />
          </div>
          
          {/* Right Section: Level + Notifications */}
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Level Badge */}
            <div className="flex items-center gap-2 bg-white dark:bg-[#2A2A2A] px-3 py-2 rounded-full">
              <Heart className="w-4 h-4 text-[#324C72] dark:text-[#90B0E0] fill-current" />
              <span className={`text-sm font-medium text-gray-700 dark:text-gray-300 ${isRTL ? "font-arabic" : "font-sans"}`}>
                {t("modules.level")} {userLevel}
              </span>
            </div>

            {/* Notifications Icon Only */}
            <button className="flex items-center justify-center w-10 h-10 bg-[#324C72] dark:bg-[#213757] rounded-full">
              <Bell className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Desktop: Chapters Title */}
      {!isMobile && (
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
      )}

      {/* Mobile: Chapters Title with padding */}
      {isMobile && (
        <div className={`w-full px-4 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
          <h2 className={`text-2xl font-bold text-gray-900 dark:text-white ${isRTL ? "font-arabic" : "font-sans"}`}>
            {t("chapters.chaptersTitle")}
          </h2>
        </div>
      )}
      
      {/* Filter toggle row */}
      <div
        className={`flex items-center self-stretch ${isRTL ? "justify-end" : "justify-start"} mb-4`}
        style={{
          padding: isMobile ? "0 16px" : "0 16px",
        }}
      >
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className={`text-sm text-gray-600 dark:text-gray-300 ${isRTL ? "font-arabic" : "font-sans"}`}>
            {t("chapters.showPurchasedOnly")}
          </span>
          <button
            onClick={() => onToggleChange(!showPurchasedOnly)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              showPurchasedOnly ? 'bg-[#324C72]' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                showPurchasedOnly 
                  ? (isRTL ? 'translate-x-1' : 'translate-x-6') 
                  : (isRTL ? 'translate-x-6' : 'translate-x-1')
              }`}
            />
          </button>
        </div>
      </div>

      {/* Chapters Grid */}
      <div className={`w-full ${isMobile ? 'px-4' : 'px-4'}`}>
        {noChapters ? (
          <div className="flex flex-col items-center justify-center w-full py-16">
            <p className={`text-lg text-gray-500 dark:text-gray-400 text-center ${isRTL ? "font-arabic" : "font-sans"}`}>
              {t("chapters.noPurchasedChapters")}
            </p>
          </div>
        ) : (
          <div className={`grid gap-6 w-full ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
            {chapters.map((chapter) => (
              <ChapterCard 
                key={chapter.id} 
                chapter={chapter} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
