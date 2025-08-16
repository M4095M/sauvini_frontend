"use client"

import { useEffect, useState } from "react"
import ContentHeader from "@/components/modules/ContentHeader"
import LessonsSection from "@/components/modules/LessonsSection"
import { MOCK_MODULES_DATA } from "@/data/mockModules"

export default function LessonsPage() {
  const [isMobile, setIsMobile] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  const currentModule = MOCK_MODULES_DATA.modules?.[0]
  const currentChapter = currentModule?.chapters?.[0]

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    setIsLoaded(true)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (!isLoaded || !currentModule || !currentChapter) return null

  return (
    <>
      {/* Desktop header only */}
      {!isMobile && (
        <ContentHeader
          content={currentChapter}
          contentType="chapter"
          parentModule={currentModule}
        />
      )}

      <div className="w-full">
        <LessonsSection
          lessons={currentChapter.lessons || []}
          isMobile={isMobile}
          userLevel={MOCK_MODULES_DATA.userProfile?.level || 1}
        />
      </div>
    </>
  )
}