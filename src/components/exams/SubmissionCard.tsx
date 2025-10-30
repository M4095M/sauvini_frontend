"use client"

import { useLanguage } from "@/hooks/useLanguage"
import { CheckCircle, Clock, XCircle, Download } from "lucide-react"
import Button from "@/components/ui/button"
import type { ExamSubmission } from "@/types/modules"

interface SubmissionCardProps {
  submission: ExamSubmission
  isMobile?: boolean
}

const getStatusIcon = (status: ExamSubmission["status"]) => {
  switch (status) {
    case "submitted":
      return <Clock className="w-8 h-8 text-yellow-500" />
    case "passed":
      return <CheckCircle className="w-8 h-8 text-green-500" />
    case "failed":
      return <XCircle className="w-8 h-8 text-error-400" />
    default:
      return <Clock className="w-8 h-8 text-gray-500" />
  }
}

const getStatusColor = (status: ExamSubmission["status"]) => {
  switch (status) {
    case "submitted":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    case "passed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "failed":
      return "bg-red-100 text-error-400 dark:bg-red-900 dark:text-red-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }
}

const getStatusText = (status: ExamSubmission["status"]) => {
  switch (status) {
    case "submitted":
      return "Under review"
    case "passed":
      return "Passed"
    case "failed":
      return "Failed"
    default:
      return status
  }
}

export default function SubmissionCard({ submission, isMobile = false }: SubmissionCardProps) {
  const { t, isRTL } = useLanguage()

  const handleDownloadSolution = () => {
    console.log("Downloading solution:", submission.solutionPdfUrl)
  }

  const handleDownloadReview = () => {
    if (submission.professorReviewPdfUrl) {
      console.log("Downloading professor review:", submission.professorReviewPdfUrl)
    }
  }

  const getIconPosition = (position: "left" | "right"): "left" | "right" => {
    if (!isRTL) return position
    return position === "left" ? "right" : "left"
  }

  if (isMobile) {
    return (
      <div
        className="bg-white dark:bg-gray-800 border border-[#BDBDBD] dark:border-gray-600"
        style={{
          display: "flex",
          padding: "36px 20px",
          flexDirection: "column",
          alignItems: "center",
          gap: "28px",
          alignSelf: "stretch",
          borderRadius: "48px",
          direction: isRTL ? "rtl" : "ltr",
        }}
      >
        {/* First Frame - Icon + Date, Title, Status */}
        <div
          className="flex items-center gap-4 w-full"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            alignSelf: "stretch",
            flexDirection: "row",
          }}
        >
          {/* Status Icon */}
          <div className="flex-shrink-0">{getStatusIcon(submission.status)}</div>

          {/* Date, Title, Status - Stacked vertically */}
          <div className={`flex flex-col gap-1 flex-1 ${isRTL ? "items-start text-right" : "items-start text-left"}`}>
            {/* Date */}
            <span className={`text-sm text-gray-600 dark:text-gray-300 ${isRTL ? "font-arabic" : "font-sans"}`}>
              {new Date(submission.submittedAt).toLocaleDateString()}
            </span>

            {/* File Name */}
            <span
              className={`text-base font-medium text-gray-900 dark:text-white ${isRTL ? "font-arabic" : "font-sans"}`}
            >
              Submission-file.pdf
            </span>

            {/* Status Badge */}
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(submission.status)} w-fit`}>
              {t?.(`exams.${submission.status}`) || getStatusText(submission.status)}
            </span>
          </div>
        </div>

        {/* Grade, Student Notes and Professor Notes */}
        {submission.status !== "submitted" || submission.studentNotes || submission.professorNotes ? (
          <div className={`w-full ${isRTL ? "text-right" : "text-left"}`}>
            {/* Grade */}
            {submission.status !== "submitted" && submission.grade !== undefined && (
              <div className="mb-4">
                <h3
                  className={`text-2xl font-bold ${isRTL ? "font-arabic" : "font-sans"} ${
                    submission.status === "passed" ? "text-green-600" : "text-error-400"
                  }`}
                >
                  {t("exams.grade") || "Grade"}: {submission.grade}/20
                </h3>
              </div>
            )}

            {/* Student Notes */}
            {submission.studentNotes && (
              <div className="mb-3">
                <h4
                  className={`text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${
                    isRTL ? "font-arabic" : "font-sans"
                  }`}
                >
                  {t("exams.studentNotes") || "Student notes:"}
                </h4>
                <p
                  className={`text-sm text-gray-600 dark:text-gray-400 leading-relaxed ${
                    isRTL ? "font-arabic" : "font-sans"
                  }`}
                >
                  {submission.studentNotes}
                </p>
              </div>
            )}

            {/* Professor Notes */}
            {submission.professorNotes && (
              <div>
                <h4
                  className={`text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${
                    isRTL ? "font-arabic" : "font-sans"
                  }`}
                >
                  {t("exams.professorNotes") || "Professor notes:"}
                </h4>
                <p
                  className={`text-sm text-gray-600 dark:text-gray-400 leading-relaxed ${
                    isRTL ? "font-arabic" : "font-sans"
                  }`}
                >
                  {submission.professorNotes}
                </p>
              </div>
            )}
          </div>
        ) : null}

        {/* Buttons Frame - Vertical layout */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: isRTL ? "flex-start" : "center",
            gap: "14px",
            alignSelf: "stretch",
          }}
        >
          {/* Download Submission Button */}
          <Button
            state="outlined"
            size="S"
            icon_position="left"
            icon={<Download className="w-4 h-4" />}
            text={t("exams.downloadSubmissionFile") || "Download Submission File"}
            onClick={handleDownloadSolution}
          />

          {/* Download Review Button - Only for graded submissions */}
          {submission.status !== "submitted" && submission.professorReviewPdfUrl && (
            <Button
              state="filled"
              size="S"
              icon_position="left"
              icon={<Download className="w-4 h-4" />}
              text={t("exams.downloadReviewFile") || "Download review file"}
              onClick={handleDownloadReview}
            />
          )}
        </div>
      </div>
    )
  }

  // Desktop layout
  return (
    <div
      className="bg-white dark:bg-gray-800 border border-[#BDBDBD] dark:border-gray-600"
      style={{
        borderRadius: "48px",
        padding: "24px",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      {/* First Frame - Always visible */}
      <div
        className="flex items-center gap-4 "
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          alignSelf: "stretch",
          justifyContent: "flex-start",
        }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Status Icon */}
        <div className="flex-shrink-0">{getStatusIcon(submission.status)}</div>

        {/* Date, Title, Status - Stacked vertically */}
        <div className={`flex flex-col gap-1 flex-1 ${isRTL ? "items-start text-right" : "items-start text-left"}`}>
          <span className={`text-sm text-gray-600 dark:text-gray-300 ${isRTL ? "font-arabic" : "font-sans"}`}>
            {new Date(submission.submittedAt).toLocaleDateString()}
          </span>
          <span
            className={`text-base font-medium text-gray-900 dark:text-white ${isRTL ? "font-arabic" : "font-sans"}`}
          >
            Submission-file.pdf
          </span>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(submission.status)} w-fit`}>
            {t?.(`exams.${submission.status}`) || getStatusText(submission.status)}
          </span>
        </div>

        {/* Download Submission Button - Rightmost in LTR */}
        <div className="flex-shrink-0">
          <Button
            state="outlined"
            size="S"
            icon_position="left"
            icon={<Download className="w-4 h-4" />}
            text={t("exams.downloadSubmissionFile") || "Download Submission File"}
            onClick={handleDownloadSolution}
          />
        </div>
      </div>

      {/* Second Frame - Grade + Notes + Review */}
      {(submission.status !== "submitted" || submission.studentNotes || submission.professorNotes) && (
        <div className="mt-6 flex justify-between gap-6" dir={isRTL ? "rtl" : "ltr"}>
          {/* Review button in RTL */}

          <div className={`flex-1  ${isRTL ? "text-right" : "text-left"}`}>
            {/* Grade */}
            {submission.status !== "submitted" && submission.grade !== undefined && (
              <div className="mb-4">
                <h3
                  className={`text-2xl font-bold ${isRTL ? "font-arabic" : "font-sans"} ${
                    submission.status === "passed" ? "text-green-600" : "text-error-400"
                  }`}
                >
                  {t("exams.grade") || "Grade"}: {submission.grade}/20
                </h3>
              </div>
            )}

            {/* Student Notes */}
            {submission.studentNotes && (
              <div className="mb-3">
                <h4
                  className={`text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${
                    isRTL ? "font-arabic" : "font-sans"
                  }`}
                >
                  {t("exams.studentNotes") || "Student notes:"}
                </h4>
                <p
                  className={`text-sm text-gray-600 dark:text-gray-400 leading-relaxed ${
                    isRTL ? "font-arabic" : "font-sans"
                  }`}
                >
                  {submission.studentNotes}
                </p>
              </div>
            )}

            {/* Professor Notes */}
            {submission.professorNotes && (
              <div>
                <h4
                  className={`text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${
                    isRTL ? "font-arabic" : "font-sans"
                  }`}
                >
                  {t("exams.professorNotes") || "Professor notes:"}
                </h4>
                <p
                  className={`text-sm text-gray-600 dark:text-gray-400 leading-relaxed ${
                    isRTL ? "font-arabic" : "font-sans"
                  }`}
                >
                  {submission.professorNotes}
                </p>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 ">
            <Button
              state="filled"
              size="S"
              icon_position="left"
              icon={<Download className="w-4 h-4" />}
              text={t("exams.downloadReviewFile") || "Download review file"}
              onClick={handleDownloadReview}
            />
          </div>
        </div>
      )}
    </div>
  )
}
