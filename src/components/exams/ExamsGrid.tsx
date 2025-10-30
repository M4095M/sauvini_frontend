"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/hooks/useLanguage'
import { Heart, Bell, Menu, ChevronDown } from "lucide-react"
import { useSidebar } from "@/context/SideBarContext"
import ContentHeader from '@/components/modules/ContentHeader'
import ExamCard from '@/components/exams/ExamCard'
import Button from '@/components/ui/button'
import type { Exam } from '@/types/modules'

interface ExamsGridProps {
  exams: Exam[]
  modules: any[] // For filtering dropdown
  isMobile?: boolean
  userLevel?: number
}

export default function ExamsGrid({ 
  exams, 
  modules, 
  isMobile = false, 
  userLevel = 6 
}: ExamsGridProps) {
  const { t, isRTL } = useLanguage()
  const { toggle } = useSidebar()
  
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [moduleFilter, setModuleFilter] = useState<string>("All")

  const examContent = {
    title: t("exams.title") || "My Exams",
    description: t("exams.description") || "View all your exams from chapters you own. Filter by status to find new, submitted, passed, or failed exams. Click a card for details or to submit."
  }

  // Filter exams based on selected filters
  const filteredExams = exams.filter(exam => {
    const statusMatch = statusFilter === "All" || exam.status === statusFilter.toLowerCase()
    const moduleMatch = moduleFilter === "All" || exam.moduleName === moduleFilter
    return statusMatch && moduleMatch
  })

  // Mobile Layout
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

        {/* Mobile header */}
        <div className="w-full px-4">
          <h2 className={`text-2xl font-bold text-gray-900 dark:text-white ${isRTL ? "text-right font-arabic" : "text-left font-sans"}`}>
            {examContent.title}
          </h2>
          <p className={`mt-2 text-gray-600 dark:text-gray-300 ${isRTL ? "text-right font-arabic" : "text-left font-sans"}`}>
            {examContent.description}
          </p>
        </div>

        {/* Mobile Filters */}
        <div className="flex flex-col w-full px-4 gap-4">
          {/* Status Filter */}
          <div className="relative">
            <select
              dir={isRTL ? "rtl" : "ltr"}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`w-full p-3 bg-white dark:bg-gray-800 border border-[#A3BAD6] rounded-lg appearance-none ${isRTL ? "text-right font-arabic pr-8" : "text-left font-sans pl-8"}`}
            >
              <option value="All">{t("exams.statusAll") || "Exam Status : All"}</option>
              <option value="new">{t("exams.statusNew") || "New"}</option>
              <option value="submitted">{t("exams.statusSubmitted") || "Submitted"}</option>
              <option value="passed">{t("exams.statusPassed") || "Passed"}</option>
              <option value="failed">{t("exams.statusFailed") || "Failed"}</option>
            </select>
            <ChevronDown className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none ${isRTL ? "left-3" : "right-3"}`} />
          </div>

          {/* Module Filter */}
          <div className="relative">
            <select
              dir={isRTL ? "rtl" : "ltr"}
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className={`w-full p-3 bg-white dark:bg-gray-800 border border-[#A3BAD6] rounded-lg appearance-none ${isRTL ? "text-right font-arabic pr-8" : "text-left font-sans pl-8"}`}
            >
              <option value="All">{t("exams.modulesAll") || "Modules : All"}</option>
              {modules.map(module => (
                <option key={module.id} value={module.name}>{module.name}</option>
              ))}
            </select>
            <ChevronDown className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none ${isRTL ? "left-3" : "right-3"}`} />
          </div>
        </div>

        {/* List title and cards */}
        <div className="flex flex-col w-full px-4 gap-6 mt-4">
          <h3 className={`text-xl font-bold text-gray-900 dark:text-white ${isRTL ? "text-right font-arabic" : "text-left font-sans"}`}>
            {t("exams.title") || "Exams"}
          </h3>

          <div className="w-full flex flex-col gap-6">
            {filteredExams.length === 0 ? (
              <div className="flex flex-col items-center justify-center w-full py-16">
                <p className={`text-lg text-gray-500 dark:text-gray-400 text-center ${isRTL ? "font-arabic" : "font-sans"}`}>
                  {t("exams.noExams") || "No exams found"}
                </p>
              </div>
            ) : (
              filteredExams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} isMobile={true} />
              ))
            )}
          </div>
        </div>
      </div>
    )
  }

  // Desktop Layout
  return (
    <div 
      className="w-full"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      {/* Desktop Content Header */}
      <ContentHeader
        title={examContent.title}
        description={examContent.description}
        pageType="exams"
        isMobile={false}
      />

      {/* Desktop Exams Section */}
      <div 
        className="bg-[#F8F8F8] dark:bg-[#1A1A1A]"
        style={{
          display: 'flex',
          padding: '24px 32px', 
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 12,
          alignSelf: 'stretch',
          borderRadius: 52,
        }}
      >
        {/* Title */}
        <h2 className={`text-2xl font-bold text-gray-900 dark:text-white ${isRTL ? "font-arabic" : "font-sans"}`}>
          {t("exams.title") || "Exams"}
        </h2>
        
        {/* Filters */}
        <div 
          className={`flex items-center gap-6 w-full ${isRTL ? "justify-end flex-row-reverse" : "justify-start"}`}
          style={{
            direction: isRTL ? 'rtl' : 'ltr'
          }}
        >
          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg appearance-none min-w-[150px] ${isRTL ? "text-right font-arabic pr-8 pl-2" : "text-left font-sans pr-8 pl-2"}`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <option value="All">Exam Status : All</option>
              <option value="new">New</option>
              <option value="submitted">Submitted</option>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
            </select>
            <ChevronDown className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none ${isRTL ? "left-2" : "right-2"}`} />
          </div>

          {/* Module Filter */}
          <div className="relative">
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className={`p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg appearance-none min-w-[200px] ${isRTL ? "text-right font-arabic pr-8 pl-2" : "text-left font-sans pr-8 pl-2"}`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <option value="All">Modules : All</option>
              {modules.map(module => (
                <option key={module.id} value={module.name}>{module.name}</option>
              ))}
            </select>
            <ChevronDown className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none ${isRTL ? "left-2" : "right-2"}`} />
          </div>
        </div>

        {/* Desktop Exams Grid */}
        {filteredExams.length === 0 ? (
          <div className="text-center py-16 w-full">
            <p className={`text-lg text-gray-500 dark:text-gray-400 ${isRTL ? "font-arabic" : "font-sans"}`}>
              {t("exams.noExams") || "No exams found"}
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4 w-full">
            {filteredExams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} isMobile={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}