"use client"

import { useLanguage } from "@/hooks/useLanguage"
import type { Module } from "@/types/modules"

type Color = Module["color"]

const colorMap: Record<Color, string> = {
  yellow: "bg-yellow-400",
  blue: "bg-blue-400",
  purple: "bg-purple-400",
  green: "bg-green-400",
  red: "bg-red-400",
}

interface MobileContentSummaryProps {
  title: string
  description?: string
  completed?: number
  total?: number
  color?: Color
}

export default function MobileContentSummary({
  title,
  description,
  completed = 0,
  total = 0,
  color = "blue",
}: MobileContentSummaryProps) {
  const { isRTL, t } = useLanguage()
  const percent = total > 0 ? Math.min(100, Math.max(0, (completed / total) * 100)) : 0

  return (
    <div className="md:hidden w-full px-4" dir={isRTL ? "rtl" : "ltr"}>
      <h1 className={`text-2xl font-bold text-gray-900 dark:text-white ${isRTL ? "text-right font-arabic" : "text-left font-sans"}`}>
        {title}
      </h1>
      {description && (
        <p className={`mt-1 text-sm text-gray-600 dark:text-gray-300 leading-relaxed ${isRTL ? "text-right font-arabic" : "text-left font-sans"}`}>
          {description}
        </p>
      )}

      <div className="mt-4">
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className={`h-full transition-all duration-300 ${colorMap[color]}`} style={{ width: `${percent}%` }} />
        </div>
        <div className={`mt-1 text-xs text-gray-500 dark:text-gray-400 ${isRTL ? "text-left" : "text-right"}`}>
          {completed}/{total} {t("lesson.lessonsTitle")}
        </div>
      </div>
    </div>
  )
}