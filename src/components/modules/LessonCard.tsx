"use client";

import { useRouter } from "next/navigation";
import type { Lesson } from "@/types/modules";
import Button from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Lock } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { RTL_LANGUAGES } from "@/lib/language";

interface LessonCardProps {
  lesson: Lesson;
  lessonNumber: number;
  onStartLearning?: () => void;
}

export default function LessonCard({
  lesson,
  onStartLearning,
}: LessonCardProps) {
  const { language, t, isRTL } = useLanguage();
  const router = useRouter();

  const handleStartLearning = () => {
    if (lesson.isUnlocked) {
      if (onStartLearning) {
        onStartLearning();
      } else {
        router.push(`/lessons/${lesson.id}`);
      }
    }
  };

  return (
    <div
      className="flex w-full p-6 md:p-6  flex-col md:flex-row md:items-center gap-3 md:gap-0 rounded-[28px] 
                   border border-[#BDBDBD] bg-white
                   dark:border-[#7C7C7C] dark:bg-[#1A1A1A]
                   transition-all duration-200 hover:shadow-md"
    >
      {/* Desktop Layout */}
      <div
        className={`hidden md:flex flex-row justify-between items-center w-full `}
      >
        {/* Left Content */}
        <div className={`flex items-start gap-3 w-full`}>
          {/* Number Icon */}
          <div className={`flex w-[30px] h-[30px] justify-center items-center rounded-full ${lesson.isUnlocked ? "bg-[#CEDAE9] dark:bg-[#2A3A4A]" : "bg-neutral-200 "}  flex-shrink-0`}>
            <span
              className={`text-sm font-medium  ${lesson.isUnlocked ? "text-[#1E40AF] dark:text-[#90B0E0]" : "text-neutral-300"}`}
            >
              {lesson.order}
            </span>
          </div>

          {/* Title and Description */}
          <div
            className={`flex flex-col gap-1 w-full  `}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <h3
              className={`text-lg font-semibold  ${lesson.isUnlocked ? "text-gray-900 dark:text-white" : "text-neutral-300"}`}
            >
              {lesson.title}
            </h3>
            <p
              className={`text-sm  ${lesson.isUnlocked ? "text-gray-600 dark:text-gray-300" : "text-neutral-300"}`}
            >
              {lesson.description}
            </p>
            {!lesson.isUnlocked && (
              <p
                className={`text-xs text-gray-400 dark:text-gray-500  self-center mt-1 ${
                  isRTL ? "font-arabic" : "font-sans"
                }`}
              >
                {t("lesson.lessonLocked")}
              </p>
            )}
          </div>
        </div>

        {/* Right Action */}
        <div className="flex-shrink-0">
          {lesson.isUnlocked ? (
            <Button
              state="text"
              size="XS"
              text={t("lesson.startLearning")}
              icon_position={isRTL ? "left" : "right"}
              icon={
                isRTL ? (
                  <ChevronLeft className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )
              }
              onClick={handleStartLearning}
            />
          ) : (
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <Lock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex md:hidden flex-col items-center gap-3 w-full">
        {/* Icon, Title and Description */}
        <div
          className={`flex items-start gap-3 w-full ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          {/* Number Icon */}
          <div className="flex w-[30px] h-[30px] justify-center items-center rounded-full bg-[#CEDAE9] dark:bg-[#2A3A4A] flex-shrink-0">
            <span
              className={`text-sm font-medium text-[#1E40AF] dark:text-[#90B0E0] ${
                isRTL ? "font-arabic" : "font-sans"
              }`}
            >
              {lesson.order}
            </span>
          </div>

          {/* Title and Description */}
          <div
            className={`flex flex-col gap-1 flex-1 ${
              isRTL ? "items-end text-right" : "items-start text-left"
            }`}
          >
            <h3
              className={`text-lg font-semibold text-gray-900 dark:text-white ${
                isRTL ? "font-arabic" : "font-sans"
              }`}
            >
              {lesson.title}
            </h3>
            <p
              className={`text-sm text-gray-600 dark:text-gray-300 ${
                isRTL ? "font-arabic" : "font-sans"
              }`}
            >
              {lesson.description}
            </p>
            {!lesson.isUnlocked && (
              <p
                className={`text-xs text-gray-400 dark:text-gray-500 mt-1 ${
                  isRTL ? "font-arabic" : "font-sans"
                }`}
              >
                {t("lesson.lessonLocked")}
              </p>
            )}
          </div>
        </div>

        {/* Action Button */}
        {lesson.isUnlocked && (
          <Button
            state="text"
            size="XS"
            icon_position={isRTL ? "left" : "right"}
            text={t("lesson.startLearning")}
            icon={
              isRTL ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )
            }
            onClick={handleStartLearning}
          />
        )}
      </div>
    </div>
  );
}
