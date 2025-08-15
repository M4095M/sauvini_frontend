"use client";

import type { Module } from "@/types/modules";
import { useLanguage } from "@/hooks/useLanguage";
import { RTL_LANGUAGES } from "@/lib/language";

interface ModuleHeaderProps {
  module: Module;
}

const getColorClasses = (color: Module["color"]) => {
  const colorMap = {
    yellow: "border-yellow-400",
    blue: "border-blue-400",
    purple: "border-purple-400",
    green: "border-green-400",
    red: "border-red-400",
  };
  return colorMap[color];
};

const getProgressColorClasses = (color: Module["color"]) => {
  const colorMap = {
    yellow: "bg-yellow-400",
    blue: "bg-blue-400",
    purple: "bg-purple-400",
    green: "bg-green-400",
    red: "bg-red-400",
  };
  return colorMap[color];
};

export default function ModuleHeader({ module }: ModuleHeaderProps) {
  const { t, language, isRTL } = useLanguage();

  const progressPercentage =
    module.totalLessons > 0
      ? (module.completedLessons / module.totalLessons) * 100
      : 0;

  return (
    <div
      className={`
      relative flex h-[332px] w-full rounded-[56px] border-[5px] mb-16
      bg-[#F8F8F8] dark:bg-[#1A1A1A]
      ${getColorClasses(module.color)}
    `}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Title and Description Section */}
      <div
        className={`
        flex w-[469px] flex-col gap-3 p-8 pt-12 items-start
        ${!isRTL ? "pr-8" : " pl-8"}
      `}
      >
        <h1
          className={`
          text-5xl font-bold text-gray-900 dark:text-white leading-tight
          ${isRTL ? "font-arabic" : "font-sans"}
        `}
        >
          {module.name}
          {/* {"الأعداد المركبة"} */}
        </h1>

        <p
          className={`
          text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-md
          ${isRTL ? "font-arabic" : "font-sans"}
        `}
        >
          {module.description}
          {/* {"نص تجريبي لتوضيح المحتوى النصي لهذه البطاقة. قد يتغير حسب الحاجة."} */}
        </p>
      </div>

      {/* Progress Section  */}
      <div
        className={`
        absolute bottom-6 left-8 right-8 flex flex-col gap-2 w-fit
      `}
      >
        {/* Progress Bar */}
        <div className="w-80 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getProgressColorClasses(
              module.color
            )}`}
            style={{
              width: `${progressPercentage}%`,
              [isRTL ? "right" : "left"]: 0,
            }}
          />
        </div>

        {/* Progress Text */}
        <span
          className={`
          text-base text-gray-500 dark:text-gray-400 font-medium self-end
        `}
        >
          {module.completedLessons}/{module.totalLessons} {t("chapters.lesson")}
        </span>
      </div>

      {/* Illustration Section */}
      <div
        className={`
        absolute top-0 z-10 flex w-[373px] h-[393px] flex-col justify-start items-center flex-shrink-0
        ${isRTL ? "left-1/4" : "right-1/4"}
      `}
        style={{
          transform: isRTL ? "translateX(-50%)" : "translateX(50%)",
        }}
      >
        <img
          src={module.illustration || "/placeholder.svg"}
          alt={module.name}
          className="w-full h-full object-contain object-top dark:brightness-110 dark:contrast-125"
        />
      </div>
    </div>
  );
}
