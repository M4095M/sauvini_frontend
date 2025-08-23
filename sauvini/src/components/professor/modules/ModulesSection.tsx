"use client"

import { useState } from "react"
import { ChevronDown, Bell, Menu } from "lucide-react"
import Image from "next/image"
import type { Module } from "@/types/modules"
import ProfessorModuleCard from "./ModuleCard"
import { useLanguage } from "@/hooks/useLanguage"
import { RTL_LANGUAGES } from "@/lib/language"
import { useSidebar } from "@/context/SideBarContext"

interface ProfessorModulesSectionProps {
  modules: Module[]
  isMobile?: boolean
}

// Academic streams for filtering
const ACADEMIC_STREAMS = [
  { value: "all", labelKey: "all" },
  { value: "mathematics", labelKey: "mathematics" },
  { value: "experimentalsciences", labelKey: "experimentalsciences" },
  { value: "literature", labelKey: "literature" },
  { value: "philosophy", labelKey: "philosophy" },
  { value: "mathtechnique", labelKey: "mathtechnique" },
]

export default function ProfessorModulesSection({ modules, isMobile = false }: ProfessorModulesSectionProps) {
  const { t, language } = useLanguage()
  const { open } = useSidebar()
  const isRTL = RTL_LANGUAGES.includes(language)
  const [selectedStream, setSelectedStream] = useState("all")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Filter modules based on selected academic stream
  const filteredModules = modules.filter((module) => {
    if (selectedStream === "all") return true
    return module.academicStreams.some((stream) => stream.toLowerCase().replace(/[^a-z0-9]/g, "") === selectedStream)
  })

  const selectedStreamLabel = ACADEMIC_STREAMS.find((stream) => stream.value === selectedStream)?.labelKey || "all"

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

      {/* Module Title Frame */}
      <div
        className={`w-full ${isMobile ? "px-4" : ""}`}
        style={{
          display: "flex",
          padding: isMobile ? "0" : "0 16px",
          alignItems: "center",
          alignSelf: "stretch",
        }}
      >
        <h1
          className={`text-2xl font-bold text-gray-900 dark:text-white ${
            isRTL ? "font-arabic text-right" : "font-sans text-left"
          }`}
        >
          {t("professor.modules.title")}
        </h1>
      </div>

      {/* Academic Streams Filter and Modules Cards Frame */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 24,
          alignSelf: "stretch",
        }}
      >
        {/* Academic Streams Filter */}
        <div
          className={`${isMobile ? "px-4" : ""}`}
          style={{
            display: "flex",
            alignItems: "center",
            alignSelf: "stretch",
            marginTop: 16,
          }}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {/* Custom Dropdown */}
          <div className={`relative ${isMobile ? "w-full" : ""}`}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors ${
                isRTL ? "flex-row-reverse" : ""
              } ${isMobile ? "w-full justify-between" : ""}`}
              style={{ minWidth: isMobile ? "auto" : 200 }}
            >
              <span className={`text-sm text-gray-900 dark:text-white ${isRTL ? "font-arabic" : "font-sans"}`}>
                {t("professor.modules.academicStream")} : {t(`professor.academicStreams.${selectedStreamLabel}`)}
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
        </div>

        {/* Modules Cards Frame */}
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
          {filteredModules.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full py-16">
              <p
                className={`text-lg text-gray-500 dark:text-gray-400 text-center ${
                  isRTL ? "font-arabic" : "font-sans"
                }`}
              >
                {t("professor.modules.noModulesFound")}
              </p>
            </div>
          ) : (
            <div
              className={`grid gap-6 w-full ${isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}
            >
              {filteredModules.map((module) => (
                <ProfessorModuleCard key={module.id} module={module} isMobile={isMobile} isRTL={isRTL} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
