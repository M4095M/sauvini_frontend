"use client"

import { useEffect, useState } from "react"
import { useParams, notFound } from "next/navigation"
import { MOCK_EXERCISES_DATA } from "@/data/mockModules"
import ExerciseDetailsGrid from "@/components/exercises/ExerciseDetailsGrid"
import Loader from '@/components/ui/Loader'

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

export default function ExerciseDetailsPage() {
  const params = useParams()
  const exerciseId = params.exerciseId as string
  const isMobile = useIsMobile()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const exercise = MOCK_EXERCISES_DATA.exercises.find(e => e.id === exerciseId)

  if (!isLoaded) {
    return (
      <div className="self-stretch w-full">
        <Loader label="Loading exercise..." />
      </div>
    )
  }

  if (!exercise) {
    notFound()
  }

  return (
    <ExerciseDetailsGrid
      exercise={exercise}
      submission={exercise.submission}
      userProfile={MOCK_EXERCISES_DATA.userProfile}
      isMobile={isMobile}
    />
  )
}