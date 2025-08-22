"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, Bell, Menu, ChevronDown } from "lucide-react"
import { useSidebar } from "@/context/SideBarContext"
import { useLanguage } from "@/hooks/useLanguage"
import ContentHeader from "@/components/modules/ContentHeader"
import ExerciseCard from "@/components/exercises/ExerciseCard"
import type { Exercise } from "@/types/modules"

interface ExercisesGridProps {
  exercises: Exercise[]
  modules: any[]
  isMobile?: boolean
  userLevel?: number
}

export default function ExercisesGrid({ exercises, modules, isMobile = false, userLevel = 6 }: ExercisesGridProps) {
  const { t, isRTL } = useLanguage()
  const { toggle } = useSidebar()

  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [moduleFilter, setModuleFilter] = useState<string>("All")

  const content = {
    title: t("exercises.title") || "My Exercises",
    description:
      t("exercises.description") ||
      "View all your exercises from chapters you own. Filter by status to find new, submitted, or graded exercises. Click a card for details or to submit.",
  }

  const filtered = exercises.filter((ex) => {
    const statusMatch = statusFilter === "All" || ex.status === statusFilter.toLowerCase()
    const moduleMatch = moduleFilter === "All" || ex.moduleName === moduleFilter
    return statusMatch && moduleMatch
  })

  if (isMobile) {
    return (
      <div
        className="flex flex-col items-start self-stretch rounded-[52px] bg-[#F8F8F8] dark:bg-[#1A1A1A] w-full"
        style={{ padding: "24px 12px", gap: "12px", direction: isRTL ? "rtl" : "ltr" }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Mobile Top Bar */}
        <div className={`flex justify-between items-end w-full px-4 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Image src="/S_logo.svg" alt="Sauvini S Logo" width={40} height={40} className="dark:brightness-150" />
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="flex items-center gap-2 bg-[#E6EBF4] dark:bg-[#324C72] px-3 py-2 rounded-full">
              <Heart className="w-4 h-4 text-[#324C72] dark:text-[#90B0E0] fill-current" />
              <span className={`text-sm font-medium text-[#324C72] dark:text-[#CEDAE9] ${isRTL ? "font-arabic" : "font-sans"}`}>
                {t("modules.level")} {userLevel}
              </span>
            </div>
            <button className="flex items-center justify-center w-10 h-10 bg-[#DCE6F5] dark:bg-[#2B3E5A] rounded-full" aria-label="Notifications">
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

        {/* Header (mobile) */}
        <div className="w-full px-4">
          <h2 className={`text-2xl font-bold text-gray-900 dark:text-white ${isRTL ? "text-right font-arabic" : "text-left font-sans"}`}>
            {content.title}
          </h2>
          <p className={`mt-2 text-gray-600 dark:text-gray-300 ${isRTL ? "text-right font-arabic" : "text-left font-sans"}`}>{content.description}</p>
        </div>

        {/* Filters (mobile) */}
        <div className="flex flex-col w-full px-4 gap-4">
          <div className="relative">
            <select
              dir={isRTL ? "rtl" : "ltr"}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`w-full p-3 bg-white dark:bg-gray-800 border border-[#A3BAD6] rounded-lg appearance-none ${
                isRTL ? "text-right font-arabic pr-8" : "text-left font-sans pl-8"
              }`}
            >
              <option value="All">{t("exercises.statusAll") || "Exercise Status : All"}</option>
              <option value="new">{t("exercises.statusNew") || "New"}</option>
              <option value="submitted">{t("exercises.statusSubmitted") || "Submitted"}</option>
              <option value="graded">{t("exercises.statusGraded") || "Graded"}</option>
            </select>
            <ChevronDown className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none ${isRTL ? "left-3" : "right-3"}`} />
          </div>

          <div className="relative">
            <select
              dir={isRTL ? "rtl" : "ltr"}
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className={`w-full p-3 bg-white dark:bg-gray-800 border border-[#A3BAD6] rounded-lg appearance-none ${
                isRTL ? "text-right font-arabic pr-8" : "text-left font-sans pl-8"
              }`}
            >
              <option value="All">{t("exercises.modulesAll") || "Modules : All"}</option>
              {modules.map((m: any) => (
                <option key={m.id} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
            <ChevronDown className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none ${isRTL ? "left-3" : "right-3"}`} />
          </div>
        </div>

        {/* Cards (mobile) */}
        <div className="flex flex-col w-full px-4 gap-6 mt-4">
          <h3 className={`text-xl font-bold text-gray-900 dark:text-white ${isRTL ? "text-right font-arabic" : "text-left font-sans"}`}>
            {t("exercises.title") || "Exercises"}
          </h3>

          <div className="w-full flex flex-col gap-6">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center w-full py-16">
                <p className={`text-lg text-gray-500 dark:text-gray-400 text-center ${isRTL ? "font-arabic" : "font-sans"}`}>
                  {t("exercises.noExercises") || "No exercises found"}
                </p>
              </div>
            ) : (
              filtered.map((exercise) => <ExerciseCard key={exercise.id} exercise={exercise} isMobile={true} />)
            )}
          </div>
        </div>
      </div>
    )
  }

  // Desktop
  return (
    <div className="w-full" style={{ direction: isRTL ? "rtl" : "ltr" }}>
      <ContentHeader title={content.title} description={content.description} pageType="exercises" isMobile={false} />

      <div
        className="bg-[#F8F8F8] dark:bg-[#1A1A1A]"
        style={{ display: "flex", padding: "24px 32px", flexDirection: "column", alignItems: "flex-start", gap: 12, alignSelf: "stretch", borderRadius: 52 }}
      >
        <h2 className={`text-2xl font-bold text-gray-900 dark:text-white ${isRTL ? "font-arabic" : "font-sans"}`}>{t("exercises.title") || "Exercises"}</h2>

        {/* Filters */}
        <div className={`flex items-center gap-6 w-full ${isRTL ? "justify-end flex-row-reverse" : "justify-start"}`} style={{ direction: isRTL ? "rtl" : "ltr" }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg min-w-[180px] ${isRTL ? "text-right font-arabic" : "text-left font-sans"}`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <option value="All">Exercise Status : All</option>
            <option value="new">New</option>
            <option value="submitted">Submitted</option>
            <option value="graded">Graded</option>
          </select>

          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className={`p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg min-w-[200px] ${isRTL ? "text-right font-arabic" : "text-left font-sans"}`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <option value="All">Modules : All</option>
            {modules.map((m: any) => (
              <option key={m.id} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 w-full">
            <p className={`text-lg text-gray-500 dark:text-gray-400 ${isRTL ? "font-arabic" : "font-sans"}`}>{t("exercises.noExercises") || "No exercises found"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-4">
            {filtered.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} isMobile={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}