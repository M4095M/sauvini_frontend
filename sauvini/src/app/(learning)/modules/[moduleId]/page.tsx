"use client"

import { useEffect, useState } from "react"
import { useParams, notFound } from "next/navigation"
import ContentHeader from "@/components/modules/ContentHeader"
import ChaptersSection from "@/components/modules/ChaptersSection"
import { MOCK_MODULES_DATA } from "@/data/mockModules"
import type { Module } from "@/types/modules"
import Loader from '@/components/ui/Loader'

export default function ModuleChaptersPage() {
  const params = useParams()
  const moduleId = params.moduleId as string
  const [isMobile, setIsMobile] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  // Find the module by ID
  const currentModule = MOCK_MODULES_DATA.modules.find(
    (module) => module.id === moduleId
  )

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    onResize()
    setIsLoaded(true)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  // Handle not found module
  if (isLoaded && !currentModule) {
    notFound()
  }

  if (!isLoaded || !currentModule) {
    return (
      <div className="self-stretch w-full">
        <Loader label="Loading module..." />
      </div>
    )
  }

  return (
    <>
      {/* Desktop header */}
      {!isMobile && (
        <ContentHeader 
          content={currentModule} 
          contentType="module" 
          pageType="chapters"
        />
      )}

      <ChaptersSection
        chapters={currentModule.chapters}
        isMobile={isMobile}
        userLevel={MOCK_MODULES_DATA.userProfile?.level || 1}
        moduleData={currentModule} // for mobile summary
      />
    </>
  )
}