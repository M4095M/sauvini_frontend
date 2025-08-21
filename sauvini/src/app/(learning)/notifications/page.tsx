"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/hooks/useLanguage"
import NotificationsGrid from "@/components/notifs/NotificationsGrid"
import { MOCK_USER_PROFILE, MOCK_NOTIFICATIONS } from "@/data/mockModules"

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

export default function NotificationsPage() {
  const { language } = useLanguage()
  const isMobile = useIsMobile()
  const userProfile = MOCK_USER_PROFILE

  return (
    <NotificationsGrid
      notifications={MOCK_NOTIFICATIONS}
      isMobile={isMobile}
      userLevel={userProfile?.level}
    />
  )
}