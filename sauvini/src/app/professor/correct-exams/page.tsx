"use client"

import { useState, useEffect } from "react"
import ExamsGrid from "@/components/professor/exams/ExamsSubmissionsGrid"
import Loader from "@/components/ui/Loader"
import { MOCK_EXAM_SUBMISSIONS } from "@/data/mockExams"

export default function CorrectExamsPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    setIsLoaded(true)
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  if (!isLoaded) {
    return (
      <div className="self-stretch w-full">
        <Loader label="Loading exam submissions..." />
      </div>
    )
  }

  return <ExamsGrid submissions={MOCK_EXAM_SUBMISSIONS} isMobile={isMobile} />
}
