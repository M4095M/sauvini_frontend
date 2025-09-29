"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import ProfessorChaptersSection from "@/components/professor/chapters/ChaptersSection"
import Loader from "@/components/ui/Loader"
import { MOCK_PROFESSOR_MODULES } from "@/data/mockProfessor"

export default function ProfessorChaptersPage() {
  const params = useParams()
  const moduleId = params.moduleId as string
  const [isMobile, setIsMobile] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Find the module by ID
  const mod = MOCK_PROFESSOR_MODULES.find((mod) => mod.id === moduleId)

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
        <Loader label="Loading chapters..." />
      </div>
    )
  }

  if (!mod) {
    return (
      <div className="self-stretch w-full flex items-center justify-center py-16">
        <p className="text-lg text-gray-500 dark:text-gray-400">Module not found</p>
      </div>
    )
  }

  return <ProfessorChaptersSection module={mod} isMobile={isMobile} />
}
