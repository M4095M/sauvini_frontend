"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import ExamDetailsGrid from "@/components/modules/ExamDetailsGrid"
import { MOCK_EXAMS_DATA, MOCK_EXAM_SUBMISSIONS } from "@/data/mockModules"

function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") return false
    return window.innerWidth < 768
  })

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return isMobile
}

export default function ExamDetailsPage() {
  const params = useParams()
  const examId = params.examId as string
  const isMobile = useIsMobile()

  // Find the exam
  const exam = MOCK_EXAMS_DATA.exams.find(e => e.id === examId)
  
  if (!exam) {
    return <div>Exam not found</div>
  }

  // Get submissions for this exam
  const submissions = MOCK_EXAM_SUBMISSIONS.filter(s => s.examId === examId)

  return (
    <ExamDetailsGrid
      exam={exam}
      submissions={submissions}
      userProfile={MOCK_EXAMS_DATA.userProfile}
      isMobile={isMobile}
    />
  )
}