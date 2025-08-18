"use client";

import Image from "next/image"
import { useLanguage } from "@/hooks/useLanguage"
import type { Module, Chapter } from "@/types/modules"

interface ContentHeaderProps {
  // For modules and chapters
  content?: Module | Chapter
  contentType?: "module" | "chapter"
  parentModule?: Module // Required when contentType is "chapter"
  // For exams page
  title?: string
  description?: string
  imageSrc?: string
  imageAlt?: string
  pageType?: "exams"
  isMobile?: boolean
}

function MobileContentSummary({ 
  title, 
  description, 
  pageType,
  isRTL 
}: { 
  title: string
  description: string
  pageType?: "exams"
  isRTL: boolean
}) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 p-6 mx-4 mb-6 rounded-[32px] ${
        pageType === "exams" 
          ? "border-[5px] border-[#A3BAD6]" 
          : "border-[3px] border-[#90B0E0]"
      }`}
      style={{
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <h1 
        className={`text-2xl font-bold text-[#324C72] dark:text-[#90B0E0] mb-3 ${
          isRTL ? "font-arabic text-right" : "font-sans text-left"
        }`}
      >
        {title}
      </h1>
      <p 
        className={`text-gray-600 dark:text-gray-300 leading-relaxed ${
          isRTL ? "font-arabic text-right" : "font-sans text-left"
        }`}
      >
        {description}
      </p>
    </div>
  )
}

const getColorClasses = (color: Module["color"]) => {
  const colorMap = {
    yellow: "border-yellow-400",
    blue: "border-blue-400",
    purple: "border-purple-400",
    green: "border-green-400",
    red: "border-red-400",
  };
  return colorMap[color] || "border-blue-400";
};

const getProgressColorClasses = (color: Module["color"]) => {
  const colorMap = {
    yellow: "bg-yellow-400",
    blue: "bg-blue-400",
    purple: "bg-purple-400",
    green: "bg-green-400",
    red: "bg-red-400",
  };
  return colorMap[color] || "bg-blue-400";
};

export default function ContentHeader({
  content,
  contentType,
  parentModule,
  title,
  description,
  imageSrc,
  imageAlt,
  pageType,
  isMobile = false,
}: ContentHeaderProps) {
  const { t, language } = useLanguage()
  const isRTL = language === 'ar'

  // Handle exams page
  if (pageType === "exams") {
    // Mobile version for exams
    if (isMobile) {
      return (
        <MobileContentSummary 
          title={title || ""}
          description={description || ""}
          pageType="exams"
          isRTL={isRTL}
        />
      )
    }

    // Desktop version for exams
    return (
      <div
        className="relative flex h-[332px] w-full rounded-[56px] border-[5px] border-[#A3BAD6] mb-16 bg-[#F8F8F8] dark:bg-[#1A1A1A]"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Title and Description Section */}
        <div
          className={`flex w-[469px] flex-col gap-3 p-8 pt-12 items-start ${
            !isRTL ? "pr-8" : "pl-8"
          }`}
        >
          <h1
            className={`text-5xl font-bold text-gray-900 dark:text-white leading-tight ${
              isRTL ? "font-arabic" : "font-sans"
            }`}
          >
            {title}
          </h1>

          <p
            className={`text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-md ${
              isRTL ? "font-arabic" : "font-sans"
            }`}
          >
            {description}
          </p>
        </div>

        {/* Illustration Section */}
        <div
          className={`absolute top-0 z-10 flex w-[373px] h-[393px] flex-col justify-start items-center flex-shrink-0 ${
            isRTL ? "left-1/4" : "right-1/4"
          }`}
          style={{
            transform: isRTL ? "translateX(-50%)" : "translateX(50%)",
          }}
        >
          <Image
            src="/amico.svg"
            alt={imageAlt || title || "Exams illustration"}
            width={373}
            height={393}
            className="w-full h-full object-contain object-top dark:brightness-110 dark:contrast-125"
            priority
          />
        </div>
      </div>
    )
  }

  // Existing logic for modules and chapters
  if (!content) {
    return null
  }

  const getProgressData = () => {
    if (contentType === "module") {
      const module = content as Module;
      return {
        completed: module.completedLessons || 0,
        total: module.totalLessons || 0,
        label: t("chapters.lesson"),
      };
    } else {
      const chapter = content as Chapter;
      return {
        completed: chapter.completedLessons || 0,
        total: chapter.totalLessons || 0,
        label: t("lesson.lessonsTitle"),
      };
    }
  };

  // appropriate color based on content type
  const getContentColor = (): Module["color"] => {
    if (contentType === "module") {
      const module = content as Module;
      return module.color;
    } else {
      // For chapters, use parent module's color
      if (!parentModule) {
        console.warn("parentModule is required when contentType is 'chapter'");
        return "blue"; // fallback
      }
      return parentModule.color;
    }
  };

  const progressData = getProgressData();
  const progressPercentage =
    progressData.total > 0 ? (progressData.completed / progressData.total) * 100 : 0
  const contentColor = getContentColor()

  const getIllustration = () => {
    if (contentType === "module") {
      return (content as Module).illustration;
    } else {
      return (content as Chapter).image;
    }
  };

  // Get the appropriate name/title
  const getContentTitle = () => {
    if (contentType === "module") {
      return (content as Module).name;
    } else {
      return (content as Chapter).title;
    }
  };

  return (
    <div
      className={`relative flex h-[332px] w-full rounded-[56px] border-[5px] mb-16 bg-[#F8F8F8] dark:bg-[#1A1A1A] ${getColorClasses(contentColor)}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Title and Description Section */}
      <div
        className={`flex w-[469px] flex-col gap-3 p-8 pt-12 items-start ${
          !isRTL ? "pr-8" : "pl-8"
        }`}
      >
        <h1
          className={`text-5xl font-bold text-gray-900 dark:text-white leading-tight ${
            isRTL ? "font-arabic" : "font-sans"
          }`}
        >
          {getContentTitle()}
        </h1>

        <p
          className={`text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-md ${
            isRTL ? "font-arabic" : "font-sans"
          }`}
        >
          {content.description}
        </p>
      </div>

      {/* Progress Section */}
      <div className="absolute bottom-6 left-8 right-8 flex flex-col gap-2 w-fit">
        <div className="w-80 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getProgressColorClasses(contentColor)}`}
            style={{
              width: `${progressPercentage}%`,
              [isRTL ? "right" : "left"]: 0,
            }}
          />
        </div>

        <span
          className={`text-base text-gray-500 dark:text-gray-400 font-medium self-end ${
            isRTL ? "font-arabic" : "font-sans"
          }`}
        >
          {progressData.completed}/{progressData.total} {progressData.label}
        </span>
      </div>

      {/* Illustration Section */}
      <div
        className={`absolute top-0 z-10 flex w-[373px] h-[393px] flex-col justify-start items-center flex-shrink-0 ${
          isRTL ? "left-1/4" : "right-1/4"
        }`}
        style={{
          transform: isRTL ? "translateX(-50%)" : "translateX(50%)",
        }}
      >
        <img
          src={getIllustration() || "/placeholder.svg"}
          alt={getContentTitle()}
          className="w-full h-full object-contain object-top dark:brightness-110 dark:contrast-125"
        />
      </div>
    </div>
  );
}
