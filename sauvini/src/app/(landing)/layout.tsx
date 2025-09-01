"use client"

import { useEffect, useState } from "react"
import Footer from "@/components/ui/footer"
import { useLanguage } from "@/hooks/useLanguage"
import { RTL_LANGUAGES } from "@/lib/language"

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage()
  const isRTL = RTL_LANGUAGES.includes(language)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    onResize()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <main className="w-full" dir={isRTL ? "rtl" : "ltr"}>
        {children}
      </main>

      <div className="flex justify-center mt-10">
        <div className="w-full max-w-[1200px] px-3">
          <Footer />
        </div>
      </div>
    </div>
  )
}