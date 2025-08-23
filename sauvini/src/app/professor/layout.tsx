"use client"

import type React from "react"

import { useState, useEffect } from "react"
import ProfessorHeader from "@/components/professor/ProfessorHeader"
import Footer from "@/components/ui/footer"
import { useLanguage } from "@/hooks/useLanguage"
import { RTL_LANGUAGES } from "@/lib/language"
import { MOCK_PROFESSOR } from "@/data/mockProfessor"
import ProfessorSidebar from "@/components/professor/SideBar"
import { SidebarProvider } from "@/context/SideBarContext"

export default function ProfessorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { language } = useLanguage()
  const isRTL = RTL_LANGUAGES.includes(language)
  const [isMobile, setIsMobile] = useState(false)
  const professorProfile = MOCK_PROFESSOR

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  return (
    <SidebarProvider>
      {/* Desktop */}
      <div className="hidden md:flex min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 justify-center">
        {/* Professor Sidebar */}
        <ProfessorSidebar />

        {/* Main Content */}
        <div
          style={{
            display: "flex",
            width: 1200,
            padding: "20px 12px 0 12px",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 10,
            flexShrink: 0,
            marginLeft: isRTL ? 0 : 240,
            marginRight: isRTL ? 240 : 0,
            direction: isRTL ? "rtl" : "ltr",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 24,
              alignSelf: "stretch",
              width: "100%",
            }}
          >
            <ProfessorHeader professorProfile={professorProfile} />
            {children}
            <Footer isRTL={isRTL} />
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div
        className="flex flex-col min-h-screen w-full md:hidden bg-gradient-to-br from-purple-100 to-blue-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800"
        style={{
          paddingTop: 60,
          gap: 24,
          direction: isRTL ? "rtl" : "ltr",
        }}
      >
        {/* Mobile Professor Sidebar Drawer */}
        <ProfessorSidebar />

        {children}

        <div className="mt-auto w-full">
          <Footer isMobile isRTL={isRTL} />
        </div>
      </div>
    </SidebarProvider>
  )
}
