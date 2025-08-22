"use client"

import { useState } from "react"
import { useLanguage } from "@/hooks/useLanguage"
import { X, Upload } from "lucide-react"
import Button from "@/components/ui/button"

interface SolutionSubmissionDialogProps {
  examId: string
  onClose: () => void
  onSubmit: (data: { file: File; notes?: string }) => void | Promise<void>
}

export default function SolutionSubmissionDialog({
  examId,
  onClose,
  onSubmit,
}: SolutionSubmissionDialogProps) {
  const { t, isRTL } = useLanguage()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [notes, setNotes] = useState("")

  const inputId = `solution-file-${examId}`
  const maxBytes = 10 * 1024 * 1024 // 10 MB

  const acceptPdf = (file: File) => file.type === "application/pdf"

  const handlePickedFile = (file?: File) => {
    if (!file) return
    if (!acceptPdf(file)) {
      alert(t("exams.pdfOnlyError") || "Please select a PDF file")
      return
    }
    if (file.size > maxBytes) {
      alert(t("exams.maxSizeError") || "File size must be under 10 MB")
      return
    }
    setSelectedFile(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handlePickedFile(e.target.files?.[0] || undefined)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    handlePickedFile(e.dataTransfer.files?.[0])
  }

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert(t("exams.selectFileError") || "Please select a PDF file")
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({ file: selectedFile, notes }) 
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#111] rounded-3xl shadow-2xl p-6 sm:p-8"
        style={{ direction: isRTL ? "rtl" : "ltr" }}
      >
        {/* Header */}
        <div className={`flex items-start justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
          <div>
            <h2 className={`text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white ${isRTL ? "font-arabic" : "font-sans"}`}>
              {t("exams.submitSolution") || "Submit Your Solution"}
            </h2>
            <p className={`mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 ${isRTL ? "font-arabic" : "font-sans"}`}>
              {t("exams.submissionSubtitle") ||
                "Upload your solution in PDF format. If your solution contains images, please convert them into a single PDF before uploading."}
            </p>
          </div>

          <button
            onClick={onClose}
            className="ml-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition"
            aria-label={t("common.close") || "Close"}
          >
            <X className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </button>
        </div>

        {/* Dropzone */}
        <div className="mt-6">
          <input id={inputId} type="file" accept=".pdf" onChange={handleInputChange} className="hidden" />
          <label
            htmlFor={inputId}
            onDragEnter={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={(e) => {
              e.preventDefault()
              setIsDragging(false)
            }}
            onDrop={handleDrop}
            className={[
              "block w-full rounded-2xl border-2 border-dashed cursor-pointer transition-colors",
              "min-h-[220px] p-8 sm:p-10",
              "bg-gray-50 dark:bg-white/[0.03]",
              isDragging
                ? "border-blue-400 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-500/10"
                : "border-gray-300 dark:border-white/20",
            ].join(" ")}
          >
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 mb-4">
                <Upload className="w-6 h-6 text-blue-500" />
              </div>

              {selectedFile ? (
                <>
                  <p className={`text-sm sm:text-base font-medium text-gray-800 dark:text-gray-100 ${isRTL ? "font-arabic" : "font-sans"}`}>
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {(t("exams.changeFileHint") || "Click to change file")}
                  </p>
                </>
              ) : (
                <>
                  <p className={`text-sm sm:text-base text-gray-700 dark:text-gray-200 ${isRTL ? "font-arabic" : "font-sans"}`}>
                    {t("exams.dragOrBrowse") || "Drag your file or"}{" "}
                    <span className="text-blue-600 dark:text-blue-400 underline underline-offset-2">
                      {t("exams.browse") || "Browse"}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {t("exams.maxFilesHint") || "PDF only • Max 10 MB"}
                  </p>
                </>
              )}
            </div>
          </label>
        </div>

        {/* Additional Notes */}
        <div className="mt-6">
          <label
            htmlFor={`exam-notes-${examId}`}
            className={`block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200 ${isRTL ? "font-arabic text-right" : "font-sans text-left"}`}
          >
            {t("exams.additionalNotes") || "Additional Notes"}
          </label>
          <textarea
            id={`exam-notes-${examId}`}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={6}
            placeholder={t("exams.notesPlaceholder") || "Optional: Add any details for the reviewer..."}
            className={[
              "w-full min-h-[160px] rounded-2xl",
              "bg-white dark:bg-transparent",
              "border border-gray-200 dark:border-white/20",
              "px-4 py-3 text-sm sm:text-base text-gray-800 dark:text-gray-100",
              "outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30",
              isRTL ? "text-right" : "text-left",
            ].join(" ")}
          />
        </div>

        {/* Actions */}
        <div className={`mt-6 grid grid-cols-2 gap-3 ${isRTL ? "direction-rtl" : ""}`}>
          <Button
            state="text"
            size="M"
            icon_position="none"
            text={t("common.cancel") || "Cancel"}
            onClick={onClose}
            disabled={isSubmitting}
          />
          <Button
            state="filled"
            size="M"
            icon_position="none"
            text={isSubmitting ? (t("exams.submitting") || "Submitting...") : (t("exams.submit") || "Submit")}
            onClick={handleSubmit}
            disabled={!selectedFile || isSubmitting}
          />
        </div>
      </div>
    </div>
  )
}