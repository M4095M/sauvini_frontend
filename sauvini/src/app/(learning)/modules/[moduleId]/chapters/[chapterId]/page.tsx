"use client"

import { useEffect, useState } from "react"
import { useParams, notFound } from "next/navigation"
import ContentHeader from "@/components/modules/ContentHeader"
import LessonsSection from "@/components/modules/LessonsSection"
import { MOCK_MODULES_DATA } from "@/data/mockModules"
import type { Module, Chapter } from "@/types/modules"
import Loader from '@/components/ui/Loader'

export default function ChapterLessonsPage() {
  const params = useParams()
  const moduleId = params.moduleId as string
  const chapterId = params.chapterId as string
  const [isMobile, setIsMobile] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  // Find the module and chapter by IDs
  const currentModule = MOCK_MODULES_DATA.modules.find(
    (module) => module.id === moduleId
  )
  const currentChapter = currentModule?.chapters.find(
    (chapter) => chapter.id === chapterId
  )

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    setIsLoaded(true)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Handle not found module or chapter
  if (isLoaded && (!currentModule || !currentChapter)) {
    notFound()
  }

  if (!isLoaded || !currentModule || !currentChapter) {
    return (
      <div className="self-stretch w-full">
        <Loader label="Loading chapter..." />
      </div>
    )
  }

  return (
    <>
      {/* Desktop header */}
      {!isMobile && (
        <ContentHeader
          content={currentChapter}
          contentType="chapter"
          parentModule={currentModule}
          pageType="lessons"
        />
      )}

      <LessonsSection
        lessons={currentChapter.lessons || []}
        isMobile={isMobile}
        userLevel={MOCK_MODULES_DATA.userProfile?.level || 1}
        chapterData={currentChapter}
        moduleData={currentModule}
      />
    </>
  )
}