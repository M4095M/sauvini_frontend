"use client"

import { useState } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/hooks/useLanguage'
import { Heart, Bell, Menu, Download, Upload, FileText } from "lucide-react"
import { useSidebar } from "@/context/SideBarContext"
import ContentHeader from '@/components/modules/ContentHeader'
import SubmissionCard from '@/components/exams/SubmissionCard'
import SolutionSubmissionDialog from '@/components/exams/SolutionSubmissionDialog'
import Button from '@/components/ui/button'
import type { Exam, ExamSubmission, UserProfile } from '@/types/modules'

interface ExamDetailsGridProps {
  exam: Exam
  submissions: ExamSubmission[]
  userProfile: UserProfile | null
  isMobile?: boolean
}

export default function ExamDetailsGrid({ 
  exam, 
  submissions, 
  userProfile, 
  isMobile = false 
}: ExamDetailsGridProps) {
  const { t, isRTL } = useLanguage()
  const { toggle } = useSidebar()
  const [showSubmissionDialog, setShowSubmissionDialog] = useState(false)

  // Get last submission to determine current exam status
  const lastSubmission = submissions.length > 0 
    ? submissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())[0]
    : null

  // Determine if student can submit
  const canSubmit = !lastSubmission || 
                   (lastSubmission.status === "failed") ||
                   (lastSubmission.status === "passed" && exam.attempts < exam.maxAttempts)

  const handleDownloadExam = () => {
    // Mock download - in real app, this would download the exam PDF
    console.log("Downloading exam PDF for:", exam.title)
  }

  const handleSubmitSolution = () => {
    setShowSubmissionDialog(true)
  }

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
                {t("modules.level")} {userProfile?.level || 1}
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
          <h1 className={`text-3xl font-bold text-gray-900 dark:text-white ${isRTL ? "text-right font-arabic" : "text-left font-sans"}`}>
            {exam.chapterName}
          </h1>
          <p className={`mt-1 text-lg text-gray-600 dark:text-gray-300 ${isRTL ? "text-right font-arabic" : "text-left font-sans"}`}>
            {exam.moduleName}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col w-full px-4 gap-4">
          {/* Download Exam PDF Button  */}
          <button
            onClick={handleDownloadExam}
            className="flex items-center justify-center bg-white border-2 border-[#DFD8FF] rounded-[24px] transition-all hover:bg-gray-50"
            style={{
              display: 'flex',
              height: '51px',
              padding: '8px 16px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              borderRadius: '24px',
              border: '2px solid #DFD8FF',
              background: '#FFF',
            }}
          >
            <div className="w-6 h-6 rounded flex items-center justify-center">
              <FileText className="w-4 h-4 text-[#8B5A2B]" />
            </div>
            <span className={`text-sm font-medium text-gray-900 ${isRTL ? "font-arabic" : "font-sans"}`}>
              {t("exams.examPdf") || "Exam.pdf"}
            </span>
            <Download className="w-4 h-4 text-gray-600" />
          </button>
          
          {/* Submit Solution Button */}
          {canSubmit && (
            <Button
              state="filled"
              size="M"
              icon_position="none"
              text={t("exams.submitSolution") || "Submit your solution"}
              onClick={handleSubmitSolution}
            />
          )}
        </div>

        {/* Submissions Section */}
        <div className="flex flex-col w-full px-4 gap-6 mt-6">
          <h2 className={`text-xl font-bold text-gray-900 dark:text-white ${isRTL ? "text-right font-arabic" : "text-left font-sans"}`}>
            {t("exams.submissions") || "Submissions"}
          </h2>

          <div className="w-full flex flex-col gap-4">
            {submissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center w-full py-16">
                <p className={`text-lg text-gray-500 dark:text-gray-400 text-center ${isRTL ? "font-arabic" : "font-sans"}`}>
                  {t("exams.noSubmissions") || "No submissions yet"}
                </p>
              </div>
            ) : (
              submissions
                .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
                .map((submission) => (
                  <SubmissionCard key={submission.id} submission={submission} isMobile={true} />
                ))
            )}
          </div>
        </div>

        {/* Solution Submission Dialog */}
        {showSubmissionDialog && (
          <SolutionSubmissionDialog
            examId={exam.id}
            onClose={() => setShowSubmissionDialog(false)}
            onSubmit={(data) => {
              // Handle submission
              console.log("Submitting solution:", data)
              setShowSubmissionDialog(false)
            }}
          />
        )}
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
      <div
        className="relative flex h-[332px] w-full rounded-[56px] border-[5px] border-[#A3BAD6] mb-16 bg-[#F8F8F8] dark:bg-[#1A1A1A]"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Title and Description Section */}
        <div
          className={`flex w-[469px] flex-col gap-3 p-8 pt-12 items-start ${
            !isRTL ? "pr-8" : "pl-8"
          }`}
        >
          <h1
            className={`text-5xl font-bold text-gray-900 dark:text-white leading-tight ${
              isRTL ? "font-arabic" : "font-sans"
            }`}
          >
            {exam.chapterName}
          </h1>

          <p
            className={`text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-md ${
              isRTL ? "font-arabic" : "font-sans"
            }`}
          >
            {exam.moduleName}
          </p>
        </div>

        {/* Action Buttons Section */}
        <div className="absolute bottom-6 left-8 right-8">
          <div className="flex gap-4 items-center">
            {/* Download Exam PDF Button */}
            <button
              onClick={handleDownloadExam}
              className="flex items-center justify-center bg-white border-2 border-[#DFD8FF] rounded-[24px] transition-all hover:bg-gray-50"
              style={{
                display: 'flex',
                height: '51px',
                padding: '8px 16px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                borderRadius: '24px',
                border: '2px solid #DFD8FF',
                background: '#FFF',
                minWidth: 'fit-content',
              }}
            >
              <div className="w-6 h-6 rounded flex items-center justify-center">
                <FileText className="w-4 h-4 text-[#8B5A2B]" />
              </div>
              <span className={`text-sm font-medium text-gray-900 ${isRTL ? "font-arabic" : "font-sans"}`}>
                {t("exams.examPdf") || "Exam.pdf"}
              </span>
              <Download className="w-4 h-4 text-gray-600" />
            </button>
            
            {/* Submit Solution Button (only appears if he didnt submit) */}
            {canSubmit && (
              <div style={{ width: 'fit-content' }}>
                <Button
                  state="filled"
                  size="M"
                  icon_position="none"
                  text={t("exams.submitSolution") || "Submit your solution"}
                  onClick={handleSubmitSolution}
                />
              </div>
            )}
          </div>
        </div>

        {/* Illustration Section */}
        <div
          className={`absolute top-0 z-10 flex w-[373px] h-[393px] flex-col justify-start items-center flex-shrink-0 ${
            isRTL ? "left-1/4" : "right-1/4"
          }`}
          style={{
            transform: isRTL ? "translateX(-50%)" : "translateX(50%)",
          }}
        >
          <Image
            src={exam.chapterImage}
            alt={exam.chapterName}
            width={373}
            height={393}
            className="w-full h-full object-contain object-top dark:brightness-110 dark:contrast-125"
            priority
          />
        </div>
      </div>

      {/* Desktop Submissions Section */}
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
          {t("exams.submissions") || "Submissions"}
        </h2>

        {/* Desktop Submissions Grid */}
        {submissions.length === 0 ? (
          <div className="text-center py-16 w-full">
            <p className={`text-lg text-gray-500 dark:text-gray-400 ${isRTL ? "font-arabic" : "font-sans"}`}>
              {t("exams.noSubmissions") || "No submissions yet"}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 w-full mt-4">
            {submissions
              .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
              .map((submission) => (
                <SubmissionCard key={submission.id} submission={submission} isMobile={false} />
              ))}
          </div>
        )}
      </div>

      {/* Solution Submission Dialog */}
      {showSubmissionDialog && (
        <SolutionSubmissionDialog
          examId={exam.id}
          onClose={() => setShowSubmissionDialog(false)}
          onSubmit={(data) => {
            // Handle submission
            console.log("Submitting solution:", data)
            setShowSubmissionDialog(false)
          }}
        />
      )}
    </div>
  )
}