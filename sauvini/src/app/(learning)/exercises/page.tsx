"use client"

import { useEffect, useState } from "react"
import { MOCK_EXERCISES_DATA } from "@/data/mockModules"
import ExercisesGrid from "@/components/exercises/ExercisesGrid"
import Loader from "@/components/ui/Loader"

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

export default function ExercisesPage() {
  const isMobile = useIsMobile()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  if (!isLoaded) {
    return (
      <div className="self-stretch w-full">
        <Loader label="Loading exercises..." />
      </div>
    )
  }

  return (
    <ExercisesGrid
      exercises={MOCK_EXERCISES_DATA.exercises}
      modules={MOCK_EXERCISES_DATA.modules}
      isMobile={isMobile}
      userLevel={MOCK_EXERCISES_DATA.userProfile?.level || 1}
    />
  )
}