"use client"

import { useEffect, useState } from "react"
import ContentHeader from "@/components/modules/ContentHeader"
import ChaptersSection from "@/components/modules/ChaptersSection"
import { MOCK_MODULES_DATA } from "@/data/mockModules"

export default function ChaptersPage() {
  const [isMobile, setIsMobile] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  const currentModule = MOCK_MODULES_DATA.modules?.[0]
  const chapters = currentModule?.chapters || []

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    onResize()
    setIsLoaded(true)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  if (!isLoaded || !currentModule) return null

  return (
    <>
      {!isMobile && (
        <ContentHeader 
          content={currentModule} 
          contentType="module" 
        />
      )}

      <ChaptersSection
        chapters={chapters}
        isMobile={isMobile}
        userLevel={MOCK_MODULES_DATA.userProfile?.level || 1}
        moduleData={currentModule}  // pass for mobile summary
      />
    </>
  )
}