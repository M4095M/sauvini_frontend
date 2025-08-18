"use client"

import { useEffect, useState } from "react"
import ExamsGrid from "@/components/modules/ExamsGrid"
import { MOCK_EXAMS_DATA } from "@/data/mockModules"

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

export default function ExamsPage() {
  const isMobile = useIsMobile()

  return (
    <ExamsGrid
      exams={MOCK_EXAMS_DATA.exams}
      modules={MOCK_EXAMS_DATA.modules}
      isMobile={isMobile}
      userLevel={MOCK_EXAMS_DATA.userProfile?.level || 1}
    />
  )
}