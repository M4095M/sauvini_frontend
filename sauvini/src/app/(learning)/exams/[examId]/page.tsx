"use client"

import { useEffect, useState } from "react"
import { useParams, notFound } from "next/navigation"
import ExamDetailsGrid from "@/components/exams/ExamDetailsGrid"
import Loader from '@/components/ui/Loader'
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

  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const exam = MOCK_EXAMS_DATA.exams.find(e => e.id === examId)

  if (!isLoaded) {
    return (
      <div className="self-stretch w-full">
        <Loader label="Loading exam..." />
      </div>
    )
  }

  if (!exam) {
    notFound()
  }

  const submissions = MOCK_EXAM_SUBMISSIONS.filter(s => s.examId === examId)

  return (
    <ExamDetailsGrid
      exam={exam!}
      submissions={submissions}
      userProfile={MOCK_EXAMS_DATA.userProfile}
      isMobile={isMobile}
    />
  )
}