"use client"

import { useState } from "react"
import { ChevronDown, Bell, Menu, Plus } from "lucide-react"
import Image from "next/image"
import type { Module } from "@/types/modules"
import ProfessorChapterCard from "./ChapterCard"
import { useLanguage } from "@/hooks/useLanguage"
import { RTL_LANGUAGES } from "@/lib/language"
import { useSidebar } from "@/context/SideBarContext"
import Button from "@/components/ui/button"

interface ProfessorChaptersSectionProps {
  module: Module
  isMobile?: boolean
}

// Academic streams for filtering
const ACADEMIC_STREAMS = [
  { value: "all", labelKey: "all" },
  { value: "mathematics", labelKey: "mathematics" },
  { value: "experimentalsciences", labelKey: "experimentalsciences" },
  { value: "literature", labelKey: "literature" },
  { value: "mathtechnique", labelKey: "mathtechnique" },
]

export default function ProfessorChaptersSection({ module, isMobile = false }: ProfessorChaptersSectionProps) {
  const { t, language } = useLanguage()
  const { open } = useSidebar()
  const isRTL = RTL_LANGUAGES.includes(language)
  const [selectedStream, setSelectedStream] = useState("all")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [showAddChapterDialog, setShowAddChapterDialog] = useState(false)

  // Filter chapters based on selected academic stream
  const filteredChapters = module.chapters.filter((chapter) => {
    if (selectedStream === "all") return true
    return chapter.academicStreams.some((stream) => stream.toLowerCase().replace(/[^a-z0-9]/g, "") === selectedStream)
  })

  const selectedStreamLabel = ACADEMIC_STREAMS.find((stream) => stream.value === selectedStream)?.labelKey || "all"

  const handleAddChapter = () => {
    setShowAddChapterDialog(true)
  }

  return (
    <div
      className="flex flex-col items-start self-stretch bg-neutral-100 dark:bg-neutral-600"
      style={{
        display: "flex",
        padding: "24px 12px",
        flexDirection: "column",
        alignItems: "flex-start",
        alignSelf: "stretch",
        borderRadius: 52,
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      {/* Mobile Top Bar */}
      {isMobile && (
        <div className={`flex justify-between items-end w-full px-4 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Image src="/S_logo.svg" alt="Sauvini S Logo" width={40} height={40} className="dark:brightness-150" />
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <button className="flex items-center justify-center w-10 h-10 bg-[#DCE6F5] dark:bg-[#2B3E5A] rounded-full">
              <Bell className="w-5 h-5 text-[#324C72] dark:text-[#90B0E0]" />
            </button>
            <button
              className="flex items-center justify-center w-10 h-10 bg-[#DCE6F5] dark:bg-[#2B3E5A] rounded-full"
              onClick={open}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-[#324C72] dark:text-[#90B0E0]" />
            </button>
          </div>
        </div>
      )}

      {/* Module Title and Chapter Count Frame */}
      <div
        className={`w-full ${isMobile ? "px-4" : ""}`}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 8,
          padding: isMobile ? "0" : "0 16px",
          alignSelf: "stretch",
        }}
      >
        <h1
          className={`${isMobile ? "text-3xl" : "text-4xl"} font-bold text-gray-900 dark:text-white ${
            isRTL ? "font-arabic text-right" : "font-sans text-left"
          }`}
        >
          {module.name}
        </h1>
        <p
          className={`${isMobile ? "text-xl" : "text-2xl"} text-gray-600 dark:text-neutral-200 ${
            isRTL ? "font-arabic text-right" : "font-sans text-left"
          }`}
        >
          {t("professor.chapters.title")}: {module.chapters.length}
        </p>
      </div>

      {/* Filter and Add Chapter Button Frame */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 24,
          alignSelf: "stretch",
        }}
      >
        {/* Filter and Add Button Row */}
        <div
          className={`w-full ${isMobile ? "px-4" : ""} ${
            isMobile ? "flex flex-col gap-3" : "flex items-center justify-between"
          }`}
          style={{
            marginTop: 16,
          }}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {/* Academic Streams Filter */}
          <div className={`relative ${isMobile ? "w-full" : ""}`}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors ${
                isRTL ? "flex-row-reverse" : ""
              } ${isMobile ? "w-full justify-between" : ""}`}
              style={{ minWidth: isMobile ? "auto" : 200 }}
            >
              <span className={`text-sm text-gray-900 dark:text-white ${isRTL ? "font-arabic" : "font-sans"}`}>
                {t("professor.chapters.academicStream")}: {t(`professor.academicStreams.${selectedStreamLabel}`)}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div
                className={`absolute top-full mt-1 w-full bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-10 ${
                  isRTL ? "right-0" : "left-0"
                }`}
              >
                {ACADEMIC_STREAMS.map((stream) => (
                  <button
                    key={stream.value}
                    onClick={() => {
                      setSelectedStream(stream.value)
                      setIsDropdownOpen(false)
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      selectedStream === stream.value
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        : "text-gray-900 dark:text-white"
                    } ${isRTL ? "text-right font-arabic" : "text-left font-sans"}`}
                  >
                    {t(`professor.academicStreams.${stream.labelKey}`)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add Chapter Button */}
          <div className={isMobile ? "w-full" : ""}>
            <Button
              state="filled"
              size="M"
              icon_position="left"
              icon={<Plus className="w-4 h-4" />}
              text={t("professor.chapters.addChapter")}
              onClick={handleAddChapter}
              optionalStyles={isMobile ? "" : "!w-auto"}
            />
          </div>
        </div>

        {/* Chapters Cards Frame */}
        <div
          className={`${isMobile ? "px-4" : ""}`}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 12,
            alignSelf: "stretch",
          }}
        >
          {filteredChapters.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full py-16">
              <p
                className={`text-lg text-gray-500 dark:text-gray-400 text-center ${
                  isRTL ? "font-arabic" : "font-sans"
                }`}
              >
                {t("professor.chapters.noChaptersFound")}
              </p>
            </div>
          ) : (
            <div
              className={`grid gap-6 w-full ${isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}
            >
              {filteredChapters.map((chapter) => (
                <ProfessorChapterCard
                  key={chapter.id}
                  chapter={chapter}
                  moduleColor={module.color}
                  isMobile={isMobile}
                  isRTL={isRTL}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Chapter Dialog */}
      {showAddChapterDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="shadow-xl border border-gray-200 dark:border-gray-700"
            style={{
              display: "flex",
              width: isMobile ? 366 : 868,
              padding: isMobile ? "44px 20px" : "44px 40px",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: isMobile ? 24 : 52,
              borderRadius: 28,
              background: "var(--surface, #ffffff)",
              maxWidth: "90vw",
              maxHeight: "90vh",
              overflow: "auto",
              backgroundColor: "var(--white)",
            }}
          >
            {/* Dialog Header */}
            <div
              className="flex flex-col items-start gap-2 self-stretch"
              style={{
                alignItems: "flex-start",
                gap: 8,
                alignSelf: "stretch",
              }}
            >
              <h2
                className={`text-2xl font-bold text-gray-900 dark:text-white ${
                  isRTL ? "font-arabic text-right" : "font-sans text-left"
                }`}
              >
                {t("professor.chapters.createNewChapter")}
              </h2>
              <p
                className={`text-base text-gray-600 dark:text-neutral-200 ${
                  isRTL ? "font-arabic text-right" : "font-sans text-left"
                }`}
              >
                {t("professor.chapters.createNewChapterSubtitle")}
              </p>
            </div>

            {/* Form Fields */}
            <div
              className="flex flex-col items-start gap-6 self-stretch"
              style={{
                alignItems: "flex-start",
                gap: 24,
                alignSelf: "stretch",
              }}
            >
              {/* Chapter Name Field */}
              <div className="flex flex-col items-start gap-2 self-stretch">
                <label
                  className={`text-sm font-medium text-gray-700 dark:text-neutral-200 ${
                    isRTL ? "font-arabic text-right" : "font-sans text-left"
                  }`}
                >
                  {t("professor.chapters.chapterName")}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-[28px] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                  placeholder={t("professor.chapters.chapterNamePlaceholder")}
                />
              </div>

              {/* Chapter Description Field */}
              <div className="flex flex-col items-start gap-2 self-stretch">
                <label
                  className={`text-sm font-medium text-gray-700 dark:text-neutral-200 ${
                    isRTL ? "font-arabic text-right" : "font-sans text-left"
                  }`}
                >
                  {t("professor.chapters.chapterDescription")}
                </label>
                <textarea
                  rows={6}
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-[28px] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                  placeholder={t("professor.chapters.chapterDescriptionPlaceholder")}
                />
              </div>
            </div>

            {/* Helper Text */}
            <p
              className={`text-sm text-gray-500 dark:text-gray-400 text-center self-stretch ${
                isRTL ? "font-arabic" : "font-sans"
              }`}
            >
              {t("professor.chapters.editLaterNote")}
            </p>

            {/* Action Buttons */}
            <div
              className={`flex items-center gap-4 self-stretch ${isRTL ? "flex-row-reverse" : ""}`}
              style={{
                alignItems: "center",
                gap: 16,
                alignSelf: "stretch",
              }}
            >
              <div className="flex-1">
                <Button
                  state="outlined"
                  size="M"
                  icon_position="none"
                  text={t("common.cancel")}
                  onClick={() => setShowAddChapterDialog(false)}
                  optionalStyles="!w-full"
                />
              </div>

              <div className="flex-1">
                <Button
                  state="filled"
                  size="M"
                  icon_position="none"
                  text={t("professor.chapters.createChapter")}
                  onClick={() => {
                    // TODO: Implement chapter creation logic
                    setShowAddChapterDialog(false)
                  }}
                  optionalStyles="!w-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
