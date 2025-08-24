"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import ProfessorNotificationsGrid from "@/components/professor/notifs/ProfessorNotificationsGrid";
import Loader from "@/components/ui/Loader";
import { MOCK_PROFESSOR_NOTIFICATIONS, MOCK_PROFESSOR } from "@/data/mockProfessor";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return isMobile
}

export default function ProfessorNotificationsPage() {
  const { language } = useLanguage()
  const isMobile = useIsMobile()
  const userProfile = MOCK_PROFESSOR

  return (
    <ProfessorNotificationsGrid
      notifications={MOCK_PROFESSOR_NOTIFICATIONS}
      isMobile={isMobile}
    />
  )
}