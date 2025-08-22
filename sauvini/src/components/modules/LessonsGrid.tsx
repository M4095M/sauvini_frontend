"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, Bell, Menu, ChevronDown } from "lucide-react"
import { useSidebar } from "@/context/SideBarContext"
import { useLanguage } from "@/hooks/useLanguage"
import QuestionCard from "@/components/questions/questionCard"
import type { Question } from "@/types/modules"

interface QuestionsGridProps {
  questions: Question[]
  isMobile?: boolean
  userLevel?: number
}

export default function QuestionsGrid({ questions, isMobile = false, userLevel = 6 }: QuestionsGridProps) {
  const { t, isRTL } = useLanguage()
  const { toggle } = useSidebar()

  // Filters
  const [visibility, setVisibility] = useState<"All" | "Public" | "Private">("All")
  const [teacherResponse, setTeacherResponse] = useState<"All" | "Answered" | "Pending" | "Closed">("All")
  const [moduleFilter, setModuleFilter] = useState<string>("All")

  const content = {
    title: t("questions.title") || "My Questions",
    description:
      t("questions.description") ||
      "View all your questions from chapters you own. Filter by status to find new, answered, or pending questions. Click a card for details or to submit.",
  }

  // Unique module names for filter
  const moduleNames = Array.from(
    new Set(
      (questions ?? []).map((q) => q?.moduleName).filter((m): m is string => Boolean(m && typeof m === "string")),
    ),
  )

  // Localized labels (values stay in English for logic)
  const visibilityOptions = [
    { value: "All", label: t("questions.filters.all") },
    { value: "Public", label: t("questions.filters.public") },
    { value: "Private", label: t("questions.filters.private") },
  ]
  const teacherOptions = [
    { value: "All", label: t("questions.filters.all") },
    { value: "Answered", label: t("questions.filters.answered") },
    { value: "Pending", label: t("questions.filters.pending") },
    { value: "Closed", label: t("questions.filters.closed") },
  ]
  const moduleOptions = [
    { value: "All", label: t("questions.filters.all") },
    ...moduleNames.map((m) => ({ value: m, label: m })),
  ]

  // Map Question -> QuestionCard props
  const toCardProps = (q: Question) => {
    const path =
      q.moduleName && q.chapterName
        ? `${q.moduleName} / ${q.chapterName}`
        : q.moduleName || q.subject || t("questions.card.pathPlaceholder")
    const detailed =
      q.replies?.find((r) => r.isAnswer)?.content ?? q.replies?.[0]?.content ?? t("questions.card.noAnswerYet")
    return {
      title: q.title,
      isAnwsered: q.status === "answered",
      isPublic: true,
      icon: <div className="w-full h-full" />,
      question: q.content,
      detailed_anwser: detailed,
      path,
    } as const
  }

  // Apply filters (visibility is mocked: Public = all, Private = none)
  const filtered = (questions ?? []).filter((q) => {
    if (!q) return false

    const visMatch = visibility === "All" ? true : visibility === "Public"
    const respMatch =
      teacherResponse === "All"
        ? true
        : teacherResponse === "Answered"
          ? q.status === "answered"
          : teacherResponse === "Pending"
            ? q.status === "pending"
            : q.status === "closed" // Closed
    const moduleMatch = moduleFilter === "All" ? true : q.moduleName === moduleFilter

    return visMatch && respMatch && moduleMatch
  })

  // MOBILE LAYOUT (stacked rows)
  if (isMobile) {
    return (
      <div
        className="flex flex-col items-start self-stretch rounded-[52px] bg-[#F8F8F8] dark:bg-[#1A1A1A] w-full"
        style={{ padding: "24px 0px", gap: "12px", direction: isRTL ? "rtl" : "ltr" }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Mobile Top Bar */}
        <div className={`flex justify-between items-end w-full px-4 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Image src="/S_logo.svg" alt="Sauvini S Logo" width={40} height={40} className="dark:brightness-150" />
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="flex items-center gap-2 bg-[#E6EBF4] dark:bg-[#324C72] px-3 py-2 rounded-full">
              <Heart className="w-4 h-4 text-[#324C72] dark:text-[#90B0E0] fill-current" />
              <span
                className={`text-sm font-medium text-[#324C72] dark:text-[#CEDAE9] ${isRTL ? "font-arabic" : "font-sans"}`}
              >
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

        {/* Title and description */}
        <div className={`w-full mb-6 px-4 ${isRTL ? "text-right" : "text-left"}`}>
          <h2
            className={`text-2xl font-bold text-gray-900 dark:text-white mb-2 ${isRTL ? "font-arabic" : "font-sans"}`}
          >
            {content.title}
          </h2>
          <p className={`text-gray-600 dark:text-gray-300 ${isRTL ? "font-arabic text-right" : "font-sans text-left"}`}>
            {content.description}
          </p>
        </div>

        {/* Filters (mobile) */}
        <div className="w-full px-4 space-y-3">
          <SelectMobile
            label={t("questions.filters.visibility")}
            value={visibility}
            onChange={(v) => setVisibility(v as any)}
            options={visibilityOptions}
            isRTL={isRTL}
          />
          <SelectMobile
            label={t("questions.filters.teacherResponse")}
            value={teacherResponse}
            onChange={(v) => setTeacherResponse(v as any)}
            options={teacherOptions}
            isRTL={isRTL}
          />
          <SelectMobile
            label={t("questions.filters.module")}
            value={moduleFilter}
            onChange={setModuleFilter}
            options={moduleOptions}
            isRTL={isRTL}
          />
        </div>

        {/* Cards (mobile) */}
        <div className="flex flex-col w-full px-4 gap-6 mt-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full py-16">
              <p
                className={`text-lg text-gray-500 dark:text-gray-400 text-center ${isRTL ? "font-arabic" : "font-sans"}`}
              >
                {t("questions.noQuestions") || "No questions found"}
              </p>
            </div>
          ) : (
            filtered.map((q) => <QuestionCard key={q.id} {...toCardProps(q)} />)
          )}
        </div>
      </div>
    )
  }

  // Desktop
  return (
    <div
      className="flex flex-col items-stretch self-stretch w-full flex-1 min-w-0 rounded-[52px] bg-[#F8F8F8] dark:bg-[#1A1A1A]"
      style={{ padding: "24px 12px", gap: "12px", direction: isRTL ? "rtl" : "ltr" }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full px-4" style={{ padding: "0 16px" }}>
        <h2 className={`text-2xl font-bold text-gray-900 dark:text-white ${isRTL ? "text-right font-arabic" : "text-left font-sans"}`}>
          {t("lesson.lessonsTitle")}
        </h2>
      </div>

      <div
        className="bg-[#F8F8F8] dark:bg-[#1A1A1A]"
        style={{
          display: "flex",
          padding: "24px",
          flexDirection: "column",
          alignItems: "stretch",
          gap: 16,
          alignSelf: "stretch",
          borderRadius: 52,
        }}
      >
        {/* Filters */}
        <div
          className={`w-full flex flex-wrap gap-4 ${isRTL ? "justify-end flex-row-reverse" : "justify-start"}`}
          style={{ direction: isRTL ? "rtl" : "ltr" }}
        >
          <SelectDesktop
            value={visibility}
            onChange={setVisibility}
            options={visibilityOptions}
            isRTL={isRTL}
            label={t("questions.filters.visibility")}
          />
          <SelectDesktop
            value={teacherResponse}
            onChange={setTeacherResponse}
            options={teacherOptions}
            isRTL={isRTL}
            label={t("questions.filters.teacherResponse")}
          />
          <SelectDesktop
            value={moduleFilter}
            onChange={setModuleFilter}
            options={moduleOptions}
            isRTL={isRTL}
            label={t("questions.filters.module")}
          />
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 w-full">
            <p className={`text-lg text-gray-500 dark:text-gray-400 ${isRTL ? "font-arabic" : "font-sans"}`}>
              {t("questions.noQuestions") || "No questions found"}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 w-full mt-2">
            {filtered.map((q) => (
              <QuestionCard key={q.id} {...toCardProps(q)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function SelectDesktop({
  value,
  onChange,
  options,
  isRTL,
  label,
}: {
  value: string
  onChange: (v: any) => void
  options: { value: string; label: string }[]
  isRTL: boolean
  label: string
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg min-w-[220px] ${isRTL ? "text-right font-arabic" : "text-left font-sans"}`}
      dir={isRTL ? "rtl" : "ltr"}
      aria-label={label}
      title={label}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className={isRTL ? "font-arabic" : "font-sans"}>
          {label} : {opt.label}
        </option>
      ))}
    </select>
  )
}

function SelectMobile({
  label,
  value,
  onChange,
  options,
  isRTL,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  isRTL: boolean
}) {
  return (
    <div className="relative w-full">
      <select
        dir={isRTL ? "rtl" : "ltr"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-3 bg-white dark:bg-gray-800 border border-[#A3BAD6] rounded-lg appearance-none ${isRTL ? "text-right font-arabic pr-10 pl-3" : "text-left font-sans pl-3 pr-10"}`}
        aria-label={label}
        title={label}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className={isRTL ? "font-arabic" : "font-sans"}>
            {label} : {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none ${isRTL ? "left-3" : "right-3"}`}
      />
    </div>
  )
}
