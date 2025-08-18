"use client"

import { useState } from "react"
import { useLanguage } from "@/hooks/useLanguage"
import { X, Upload, FileText } from "lucide-react"
import Button from "@/components/ui/button"

interface SolutionSubmissionDialogProps {
  examId: string
  onClose: () => void
  onSubmit: (data: { file: File }) => void
}

export default function SolutionSubmissionDialog({
  examId,
  onClose,
  onSubmit,
}: SolutionSubmissionDialogProps) {
  const { t, isRTL } = useLanguage()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setSelectedFile(file)
    } else {
      alert(t("examss.pdfOnlyError") || "Please select a PDF file only")
    }
  }

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert(t("examss.selectFileError") || "Please select a PDF file")
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({ file: selectedFile })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
      >
        {/* Header */}
        <div className={`flex items-center justify-between mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
          <h2 className={`text-xl font-bold text-gray-900 dark:text-white ${isRTL ? "font-arabic" : "font-sans"}`}>
            {t("exams.submitSolution") || "Submit Solution"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className={`flex items-start gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <FileText className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
            <p className={`text-sm text-blue-700 dark:text-blue-300 ${isRTL ? "font-arabic text-right" : "font-sans text-left"}`}>
              {t("exams.submissionInstructions") || 
               "Please upload your solution as a PDF file. If you have images, convert them to PDF using online tools."}
            </p>
          </div>
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${isRTL ? "font-arabic text-right" : "font-sans text-left"}`}>
            {t("exams.solutionFile") || "Solution File (PDF)"}
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="solution-file"
            />
            <label
              htmlFor="solution-file"
              className={`flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-400 transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <Upload className="w-6 h-6 text-gray-400" />
              <div className={isRTL ? "text-right" : "text-left"}>
                <p className={`text-sm font-medium text-gray-700 dark:text-gray-300 ${isRTL ? "font-arabic" : "font-sans"}`}>
                  {selectedFile ? selectedFile.name : (t("exams.selectPdf") || "Click to select PDF file")}
                </p>
                <p className={`text-xs text-gray-500 dark:text-gray-400 ${isRTL ? "font-arabic" : "font-sans"}`}>
                  {t("exams.pdfOnly") || "PDF files only"}
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
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