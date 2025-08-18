"use client"

import { useLanguage } from "@/hooks/useLanguage"

interface LoaderProps {
  label?: string
  minHeight?: string | number
}

export default function Loader({ label, minHeight = "60vh" }: LoaderProps) {
  const { isRTL } = useLanguage()

  return (
    <div
      className="flex items-center justify-center w-full rounded-[52px] bg-[#F8F8F8] dark:bg-[#1A1A1A]"
      style={{ minHeight, padding: "32px 24px", direction: isRTL ? "rtl" : "ltr" }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Simple ring with two visible arcs */}
        <div
          className="
            h-12 w-12 rounded-full
            border-4 border-primary-300 dark:border-primary-400
            border-t-transparent border-l-transparent
            animate-spin [animation-duration:1s]
            shadow-[0_0_10px_rgba(59,130,246,0.15)] dark:shadow-[0_0_10px_rgba(59,130,246,0.25)]
          "
          aria-label="Loading"
          role="status"
        />
        {label && (
          <p className={`text-sm text-gray-600 dark:text-gray-300 ${isRTL ? "font-arabic" : "font-sans"}`}>
            {label}
          </p>
        )}
      </div>
    </div>
  )
}