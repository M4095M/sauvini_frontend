"use client"

import { useState } from "react"
import Image from "next/image"
import { useLanguage } from "@/hooks/useLanguage"
import Button from "@/components/ui/button"
import ExerciseSubmissionCard from "@/components/modules/ExerciseSubmissionCard"
import ExerciseSubmissionDialog from "@/components/modules/ExerciseSubmissionDialog"
import { Heart, Bell, Menu, Download, FileText } from "lucide-react"
import type { Exercise, ExerciseSubmission, UserProfile } from "@/types/modules"
import { useSidebar } from "@/context/SideBarContext"

interface ExerciseDetailsGridProps {
  exercise: Exercise
  submission?: ExerciseSubmission | null
  userProfile: UserProfile | null
  isMobile?: boolean
}

export default function ExerciseDetailsGrid({ exercise, submission, userProfile, isMobile = false }: ExerciseDetailsGridProps) {
  const { t, isRTL } = useLanguage()
  const { toggle } = useSidebar()
  const [showDialog, setShowDialog] = useState(false)

  const imageSrc =
    (exercise as any).lessonImage ||
    (exercise as any).chapterImage ||
    "/illustrations/lesson-fallback.svg"

  const canSubmit = !submission // single submission rule

  const handleDownloadPdf = () => {
    console.log("Downloading exercise PDF:", exercise.exercisePdfUrl)
    // window.open(exercise.exercisePdfUrl, "_blank")
  }

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
            <button className="flex items-center justify-center w-10 h-10 bg-[#DCE6F5] dark:bg-[#2B3E5A] rounded-full" aria-label="Notifications">
              <Bell className="w-5 h-5 text-[#324C72] dark:text-[#90B0E0]" />
            </button>
            <button className="flex items-center justify-center w-10 h-10 bg-[#DCE6F5] dark:bg-[#2B3E5A] rounded-full" onClick={toggle} aria-label="Open menu">
              <Menu className="w-5 h-5 text-[#324C72] dark:text-[#90B0E0]" />
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="w-full px-4">
          <h1 className={`text-3xl font-bold text-gray-900 dark:text-white ${isRTL ? "text-right font-arabic" : "text-left font-sans"}`}>
            {exercise.lessonName}
          </h1>
          <p className={`mt-1 text-lg text-gray-600 dark:text-gray-300 ${isRTL ? "text-right font-arabic" : "text-left font-sans"}`}>
            {exercise.moduleName} : {exercise.chapterName}
          </p>
          <p className={`mt-1 text-sm text-gray-500 dark:text-gray-400 ${isRTL ? "text-right font-arabic" : "text-left font-sans"}`}>
            {exercise.totalMarks} {t("exercises.pointsTotal") || "points in total"}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col w-full px-4 gap-4">
          <button
            onClick={handleDownloadPdf}
            className="flex items-center justify-center bg-white border-2 border-[#DFD8FF] rounded-[24px] transition-all hover:bg-gray-50"
            style={{ height: 51, padding: "8px 16px", gap: 8 }}
          >
            <div className="w-6 h-6 rounded flex items-center justify-center">
              <FileText className="w-4 h-4 text-[#8B5A2B]" />
            </div>
            <span className={`text-sm font-medium text-gray-900 ${isRTL ? "font-arabic" : "font-sans"}`}>
              {t("exercises.exercisePdf") || "Exercise.pdf"}
            </span>
            <Download className="w-4 h-4 text-gray-600" />
          </button>

          {canSubmit && (
            <Button state="filled" size="M" icon_position="none" text={t("exercises.submitSolution") || "Submit your solution"} onClick={() => setShowDialog(true)} />
          )}
        </div>

        {/* Submissions */}
        <div className="flex flex-col w-full px-4 gap-6 mt-6">
          <h2 className={`text-xl font-bold text-gray-900 dark:text-white ${isRTL ? "text-right font-arabic" : "text-left font-sans"}`}>
            {t("exercises.submissions") || "Submissions"}
          </h2>
          <div className="w-full flex flex-col gap-4">
            {!submission ? (
              <div className="flex flex-col items-center justify-center w-full py-16">
                <p className={`text-lg text-gray-500 dark:text-gray-400 text-center ${isRTL ? "font-arabic" : "font-sans"}`}>
                  {t("exercises.noSubmissions") || "No submissions yet"}
                </p>
              </div>
            ) : (
              <ExerciseSubmissionCard submission={submission} isMobile />
            )}
          </div>
        </div>

        {showDialog && (
          <ExerciseSubmissionDialog
            exerciseId={exercise.id}
            onClose={() => setShowDialog(false)}
            onSubmit={(data) => {
              console.log("Submitting exercise:", data)
              setShowDialog(false)
            }}
          />
        )}
      </div>
    )
  }

  // Desktop
  return (
    <div className="w-full" style={{ direction: isRTL ? "rtl" : "ltr" }}>
      <div
        className="relative flex h-[332px] w-full rounded-[56px] border-[5px] border-[#A3BAD6] mb-16 bg-[#F8F8F8] dark:bg-[#1A1A1A]"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Left text block */}
        <div className={`flex w-[469px] flex-col gap-2 p-8 pt-12 items-start ${!isRTL ? "pr-8" : "pl-8"}`}>
          <h1 className={`text-5xl font-bold text-gray-900 dark:text-white leading-tight ${isRTL ? "font-arabic" : "font-sans"}`}>
            {exercise.lessonName}
          </h1>
          <p className={`text-lg text-gray-600 dark:text-gray-300 ${isRTL ? "font-arabic" : "font-sans"}`}>
            {exercise.moduleName} : {exercise.chapterName}
          </p>
          <p className={`text-sm text-gray-500 dark:text-gray-400 ${isRTL ? "font-arabic" : "font-sans"}`}>
            {exercise.totalMarks} {t("exercises.pointsTotal") || "points in total"}
          </p>
        </div>

        {/* Buttons row */}
        <div className="absolute bottom-6 left-8 right-8">
          <div className="flex gap-4 items-center">
            <button
              onClick={handleDownloadPdf}
              className="flex items-center justify-center bg-white border-2 border-[#DFD8FF] rounded-[24px] transition-all hover:bg-gray-50"
              style={{ height: 51, padding: "8px 16px", gap: 8, minWidth: "fit-content" }}
            >
              <div className="w-6 h-6 rounded flex items-center justify-center">
                <FileText className="w-4 h-4 text-[#8B5A2B]" />
              </div>
              <span className={`text-sm font-medium text-gray-900 ${isRTL ? "font-arabic" : "font-sans"}`}>
                {t("exercises.exercisePdf") || "Exercise.pdf"}
              </span>
              <Download className="w-4 h-4 text-gray-600" />
            </button>

            {canSubmit && (
              <div style={{ width: "fit-content" }}>
                <Button state="filled" size="M" icon_position="none" text={t("exercises.submitSolution") || "Submit your solution"} onClick={() => setShowDialog(true)} />
              </div>
            )}
          </div>
        </div>

        {/* Illustration */}
        <div
          className={`absolute top-0 z-10 flex w-[373px] h-[393px] flex-col justify-start items-center flex-shrink-0 ${
            isRTL ? "left-1/4" : "right-1/4"
          }`}
          style={{ transform: isRTL ? "translateX(-50%)" : "translateX(50%)" }}
        >
          <Image
            src={imageSrc}
            alt={exercise.lessonName || "Lesson"}
            width={373}
            height={393}
            className="w-full h-full object-contain object-top dark:brightness-110 dark:contrast-125"
            priority
          />
        </div>
      </div>

      {/* Submissions */}
      <div
        className="bg-[#F8F8F8] dark:bg-[#1A1A1A]"
        style={{ display: "flex", padding: "24px 32px", flexDirection: "column", alignItems: "flex-start", gap: 12, alignSelf: "stretch", borderRadius: 52 }}
      >
        <h2 className={`text-2xl font-bold text-gray-900 dark:text-white ${isRTL ? "font-arabic" : "font-sans"}`}>{t("exercises.submissions") || "Submissions"}</h2>

        {!submission ? (
          <div className="text-center py-16 w-full">
            <p className={`text-lg text-gray-500 dark:text-gray-400 ${isRTL ? "font-arabic" : "font-sans"}`}>{t("exercises.noSubmissions") || "No submissions yet"}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 w-full mt-4">
            <ExerciseSubmissionCard submission={submission} />
          </div>
        )}
      </div>

      {showDialog && (
        <ExerciseSubmissionDialog
          exerciseId={exercise.id}
          onClose={() => setShowDialog(false)}
          onSubmit={(data) => {
            console.log("Submitting exercise:", data)
            setShowDialog(false)
          }}
        />
      )}
    </div>
  )
}