"use client"

import type { Module } from "@/types/modules"
import { useLanguage } from "@/hooks/useLanguage"
import { RTL_LANGUAGES } from "@/lib/language"

interface ModuleHeaderProps {
  module: Module
}

const getColorClasses = (color: Module["color"]) => {
  const colorMap = {
    yellow: "border-yellow-400",
    blue: "border-blue-400",
    purple: "border-purple-400",
    green: "border-green-400",
    red: "border-red-400",
  }
  return colorMap[color]
}

const getProgressColorClasses = (color: Module["color"]) => {
  const colorMap = {
    yellow: "bg-yellow-400",
    blue: "bg-blue-400",
    purple: "bg-purple-400",
    green: "bg-green-400",
    red: "bg-red-400",
  }
  return colorMap[color]
}

export default function ModuleHeader({ module }: ModuleHeaderProps) {
  const { language, t } = useLanguage()
  const isRTL = RTL_LANGUAGES.includes(language)

  const progressPercentage = module.totalLessons > 0 ? (module.completedLessons / module.totalLessons) * 100 : 0

  return (
    <div
      className={`
      flex h-[332px] w-full rounded-[56px] border-[5px] bg-[#F8F8F8] p-6
      ${getColorClasses(module.color)}
      ${isRTL ? "flex-row-reverse" : "flex-row"}
    `}
    >
      {/* Title and Description Section */}
      <div
        className={`
        flex w-[469px] flex-col gap-3
        ${isRTL ? "items-end text-right" : "items-start text-left"}
      `}
      >
        <h1
          className={`
          text-4xl font-bold text-gray-900
          ${isRTL ? "font-arabic" : "font-sans"}
        `}
        >
          {module.name}
        </h1>

        <p
          className={`
          text-lg text-gray-600 leading-relaxed
          ${isRTL ? "font-arabic" : "font-sans"}
        `}
        >
          {module.description}
        </p>

        {/* Progress Section */}
        <div
          className={`
          mt-auto flex flex-col gap-2
          ${isRTL ? "items-end" : "items-start"}
        `}
        >
          {/* Progress Bar */}
          <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getProgressColorClasses(module.color)}`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Progress Text */}
          <span
            className={`
            text-sm text-gray-500
            ${isRTL ? "font-arabic" : "font-sans"}
          `}
          >
            {module.completedLessons}/{module.totalLessons} {t("lesson")}
          </span>
        </div>
      </div>

      {/* Illustration Section */}
      <div className="flex w-[373px] h-[393px] flex-col justify-center items-center flex-shrink-0 px-0 py-[11px]">
        <img
          src={module.illustration || "/placeholder.svg"}
          alt={module.name}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  )
}
