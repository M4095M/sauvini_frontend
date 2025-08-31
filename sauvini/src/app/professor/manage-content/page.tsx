"use client"

import { useState, useEffect } from "react"
import ProfessorModulesSection from "@/components/professor/modules/ModulesSection"
import Loader from "@/components/ui/Loader"
import { MOCK_PROFESSOR_MODULES } from "@/data/mockProfessor"

export default function ProfessorModulesPage() {
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
        <Loader label="Loading modules..." />
      </div>
    )
  }

  return <ProfessorModulesSection modules={MOCK_PROFESSOR_MODULES} isMobile={isMobile} />
}
