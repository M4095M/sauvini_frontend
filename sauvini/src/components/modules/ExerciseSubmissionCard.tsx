"use client"

import { useLanguage } from "@/hooks/useLanguage"
import { CheckCircle2, Clock, Download } from "lucide-react"
import Button from "@/components/ui/button"
import type { ExerciseSubmission } from "@/types/modules"

interface ExerciseSubmissionCardProps {
  submission: ExerciseSubmission
  isMobile?: boolean
}

const getStatusIcon = (status: ExerciseSubmission["status"]) => {
  switch (status) {
    case "graded":
      return <CheckCircle2 className="w-8 h-8 text-green-500" />
    case "submitted":
    default:
      return <Clock className="w-8 h-8 text-yellow-500" />
  }
}

const getStatusColor = (status: ExerciseSubmission["status"]) => {
  switch (status) {
    case "graded":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "submitted":
    default:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
  }
}

const getStatusText = (status: ExerciseSubmission["status"]) => {
  switch (status) {
    case "graded":
      return "Graded"
    case "submitted":
    default:
      return "Submitted"
  }
}

export default function ExerciseSubmissionCard({ submission, isMobile = false }: ExerciseSubmissionCardProps) {
  const { t, isRTL } = useLanguage()

  const handleDownloadSolution = () => {
    console.log("Downloading solution:", submission.solutionPdfUrl)
  }

  const handleDownloadReview = () => {
    if (submission.professorReviewPdfUrl) {
      console.log("Downloading professor review:", submission.professorReviewPdfUrl)
    }
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
        {/* Header row: icon + date/file/status */}
        <div className="flex items-center gap-4 w-full">
          <div className="flex-shrink-0">{getStatusIcon(submission.status)}</div>

          <div className={`flex flex-col gap-1 flex-1 ${isRTL ? "items-start text-right" : "items-start text-left"}`}>
            <span className={`text-sm text-gray-600 dark:text-gray-300 ${isRTL ? "font-arabic" : "font-sans"}`}>
              {new Date(submission.submittedAt).toLocaleDateString()}
            </span>

            <span className={`text-base font-medium text-gray-900 dark:text-white ${isRTL ? "font-arabic" : "font-sans"}`}>
              Solution-file.pdf
            </span>

            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(submission.status)} w-fit`}>
              {t?.(`exercises.${submission.status}`) || getStatusText(submission.status)}
            </span>
          </div>
        </div>

        {/* Grade + notes (only when graded or notes exist) */}
        {(submission.status === "graded" || submission.studentNotes || submission.professorNotes) && (
          <div className={`w-full ${isRTL ? "text-right" : "text-left"}`}>
            {typeof submission.grade === "number" && (
              <div className="mb-4">
                <h3 className={`text-2xl font-bold ${isRTL ? "font-arabic" : "font-sans"} text-green-600`}>
                  {t("exercises.grade") || "Grade"}: {submission.grade}
                  {(submission as any).totalMarks ? `/${(submission as any).totalMarks}` : ""}
                </h3>
              </div>
            )}

            {submission.studentNotes && (
              <div className="mb-3">
                <h4 className={`text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${isRTL ? "font-arabic" : "font-sans"}`}>
                  {t("exercises.studentNotes") || "Student notes:"}
                </h4>
                <p className={`text-sm text-gray-600 dark:text-gray-400 leading-relaxed ${isRTL ? "font-arabic" : "font-sans"}`}>
                  {submission.studentNotes}
                </p>
              </div>
            )}

            {submission.professorNotes && (
              <div>
                <h4 className={`text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${isRTL ? "font-arabic" : "font-sans"}`}>
                  {t("exercises.professorNotes") || "Professor notes:"}
                </h4>
                <p className={`text-sm text-gray-600 dark:text-gray-400 leading-relaxed ${isRTL ? "font-arabic" : "font-sans"}`}>
                  {submission.professorNotes}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Buttons (stacked) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: isRTL ? "flex-start" : "center",
            gap: "14px",
            alignSelf: "stretch",
          }}
        >
          <Button
            state="outlined"
            size="S"
            icon_position="left"
            icon={<Download className="w-4 h-4" />}
            text={t("exercises.downloadSubmissionFile") || "Download Submission File"}
            onClick={handleDownloadSolution}
          />

          {submission.professorReviewPdfUrl && (
            <Button
              state="filled"
              size="S"
              icon_position="left"
              icon={<Download className="w-4 h-4" />}
              text={t("exercises.downloadReviewFile") || "Download review file"}
              onClick={handleDownloadReview}
            />
          )}
        </div>
      </div>
    )
  }

  // Desktop
  return (
    <div
      className="bg-white dark:bg-gray-800 border border-[#BDBDBD] dark:border-gray-600"
      style={{ borderRadius: "48px", padding: "24px", direction: isRTL ? "rtl" : "ltr" }}
    >
      {/* Row 1 */}
      <div className="flex items-center gap-4">
        {/* In RTL, put download button first */}
        {isRTL && (
          <div className="flex-shrink-0">
            <Button
              state="outlined"
              size="S"
              icon_position="left"
              icon={<Download className="w-4 h-4" />}
              text={t("exercises.downloadSubmissionFile") || "Download Submission File"}
              onClick={handleDownloadSolution}
            />
          </div>
        )}

        <div className="flex-shrink-0">{getStatusIcon(submission.status)}</div>

        <div className={`flex flex-col gap-1 flex-1 ${isRTL ? "items-start text-right" : "items-start text-left"}`}>
          <span className={`text-sm text-gray-600 dark:text-gray-300 ${isRTL ? "font-arabic" : "font-sans"}`}>
            {new Date(submission.submittedAt).toLocaleDateString()}
          </span>
          <span className={`text-base font-medium text-gray-900 dark:text-white ${isRTL ? "font-arabic" : "font-sans"}`}>
            Solution-file.pdf
          </span>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(submission.status)} w-fit`}>
            {t?.(`exercises.${submission.status}`) || getStatusText(submission.status)}
          </span>
        </div>

        {!isRTL && (
          <div className="flex-shrink-0">
            <Button
              state="outlined"
              size="S"
              icon_position="left"
              icon={<Download className="w-4 h-4" />}
              text={t("exercises.downloadSubmissionFile") || "Download Submission File"}
              onClick={handleDownloadSolution}
            />
          </div>
        )}
      </div>

      {/* Row 2: grade + notes + review button */}
      {(submission.status === "graded" || submission.studentNotes || submission.professorNotes) && (
        <div className="mt-6 flex items-start gap-6">
          {/* In RTL, put review download first */}
          {isRTL && submission.professorReviewPdfUrl && (
            <div className="flex-shrink-0">
              <Button
                state="filled"
                size="S"
                icon_position="left"
                icon={<Download className="w-4 h-4" />}
                text={t("exercises.downloadReviewFile") || "Download review file"}
                onClick={handleDownloadReview}
              />
            </div>
          )}

          <div className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
            {typeof submission.grade === "number" && (
              <div className="mb-4">
                <h3 className={`text-2xl font-bold ${isRTL ? "font-arabic" : "font-sans"} text-green-600`}>
                  {t("exercises.grade") || "Grade"}: {submission.grade}
                  {(submission as any).totalMarks ? `/${(submission as any).totalMarks}` : ""}
                </h3>
              </div>
            )}

            {submission.studentNotes && (
              <div className="mb-3">
                <h4 className={`text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${isRTL ? "font-arabic" : "font-sans"}`}>
                  {t("exercises.studentNotes") || "Student notes:"}
                </h4>
                <p className={`text-sm text-gray-600 dark:text-gray-400 leading-relaxed ${isRTL ? "font-arabic" : "font-sans"}`}>
                  {submission.studentNotes}
                </p>
              </div>
            )}

            {submission.professorNotes && (
              <div>
                <h4 className={`text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${isRTL ? "font-arabic" : "font-sans"}`}>
                  {t("exercises.professorNotes") || "Professor notes:"}
                </h4>
                <p className={`text-sm text-gray-600 dark:text-gray-400 leading-relaxed ${isRTL ? "font-arabic" : "font-sans"}`}>
                  {submission.professorNotes}
                </p>
              </div>
            )}
          </div>

          {!isRTL && submission.professorReviewPdfUrl && (
            <div className="flex-shrink-0">
              <Button
                state="filled"
                size="S"
                icon_position="left"
                icon={<Download className="w-4 h-4" />}
                text={t("exercises.downloadReviewFile") || "Download review file"}
                onClick={handleDownloadReview}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}