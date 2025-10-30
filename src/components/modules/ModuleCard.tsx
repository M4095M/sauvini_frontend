"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, Lock } from "lucide-react";
import { Module } from "@/api/modules";
import Button from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { RTL_LANGUAGES } from "@/lib/language";

interface ModuleCardProps {
  module: Module;
  isRTL?: boolean;
  isMobile?: boolean;
  className?: string;
}

const COLOR_MAP: Record<string, string> = {
  yellow: "#FFD427",
  blue: "#27364D",
  purple: "#9663FE",
  green: "#22C55E",
  red: "#EF4444",
} as const;

const CARD_STYLES = {
  desktop: {
    minHeight: 220,
    padding: "20px 24px 20px 24px",
  },
  mobile: {
    minHeight: 220,
    padding: "20px 20px 20px 20px",
  },
} as const;

const ILLUSTRATION_SIZE = {
  width: 100,
  height: 100,
} as const;

export default function ModuleCard({
  module,
  isRTL: propIsRTL,
  isMobile = false,
  className = "",
}: ModuleCardProps) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const isRTL =
    propIsRTL !== undefined ? propIsRTL : RTL_LANGUAGES.includes(language);

  const progressColor = "#BDBDBD";
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;
  // const progressPercentage = Math.round(
  //   (module.completedLessons / module.totalLessons) * 100
  // );

  const progressPercentage = 50;

  const handleModuleClick = () => {
    if (module.isUnlocked) {
      router.push(`/modules/${module.id}`);
    }
  };

  const handleUnlockClick = () => {
    // TODO: Implement unlock logic
    console.log(`Unlock module: ${module.id}`);
  };

  const handleViewChaptersClick = () => {
    router.push(`/modules/${module.id}`);
  };

  const truncateDescription = (text: string, maxLength = 90): string => {
    return text.length > maxLength
      ? `${text.slice(0, maxLength - 3)}...`
      : text;
  };

  const cardStyles = isMobile ? CARD_STYLES.mobile : CARD_STYLES.desktop;

  return (
    <div
      className={`
        group relative flex flex-col w-full
        rounded-[28px] border border-gray-300 bg-white
        dark:border-[#7C7C7C] dark:bg-[#1A1A1A]
        transition-all duration-200
        overflow-hidden
        ${
          module.isUnlocked
            ? "cursor-pointer hover:shadow-lg hover:scale-[1.02] hover:border-blue-300 dark:hover:border-blue-600"
            : "cursor-default opacity-90"
        }
        ${className}
      `}
      style={{
        minHeight: cardStyles.minHeight,
        padding: cardStyles.padding,
      }}
      onClick={handleModuleClick}
    >
      {/* Card Content Container */}
      <div className="flex flex-col justify-between gap-4 w-full h-full min-h-0">
        {/* Top Section: Illustration + Content */}
        <div
          className={`flex w-full items-start gap-4`}
          style={{ minWidth: 0, minHeight: 0 }}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {/* Illustration */}
          <div className="relative flex-shrink-0 w-[100px] h-[100px]">
            <Image
              src={"/placeholder.svg"}
              alt={`${module.lessonsCount} illustration`}
              width={100}
              height={100}
              className="object-contain"
              sizes="100px"
            />
          </div>

          {/* Module Content */}
          <div
            className="flex flex-col gap-2"
            style={{
              flex: "1 1 0%",
              minWidth: 0,
              overflow: "hidden",
            }}
          >
            {/* Title Row */}
            <div
              className={`flex items-center justify-between gap-2`}
              style={{ minWidth: 0, width: "100%" }}
              dir={isRTL ? "rtl" : "ltr"}
            >
              {/* Module Title */}
              <h3
                className={`
                  text-base font-semibold text-gray-900 dark:text-white 
                  truncate
                  ${isRTL ? "text-right font-arabic" : "text-left font-sans"}
                `}
                style={{
                  flex: "1 1 0%",
                  minWidth: 0,
                }}
                title={module.name}
              >
                {module.name}
              </h3>

              {/* Action Icon */}
              <div className="flex-shrink-0">
                {module.isUnlocked ? (
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                    <ChevronIcon
                      className="w-4 h-4 text-blue-600 dark:text-blue-400 transition-colors"
                      aria-hidden="true"
                    />
                  </div>
                ) : (
                  <div
                    className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800"
                    aria-label="Module locked"
                  >
                    <Lock
                      className="w-4 h-4"
                      style={{ color: progressColor }}
                      aria-hidden="true"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <p
              className={`
                text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2
                ${isRTL ? "text-right font-arabic" : "text-left font-sans"}
              `}
              style={{ minWidth: 0 }}
            >
              {module.description}
            </p>

            {/* Click hint for unlocked modules */}
            {module.isUnlocked && (
              <p
                className={`
                  text-xs text-blue-600 dark:text-blue-400 font-medium mt-1
                  ${isRTL ? "text-right font-arabic" : "text-left font-sans"}
                `}
              >
                {t("modules.clickToViewChapters")}
              </p>
            )}
          </div>
        </div>

        {/* Progress Bar (Unlocked Modules) */}
        {module.isUnlocked && (
          <div className="w-full min-w-0">
            <div
              className={`flex items-center gap-3 w-full min-w-0`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              {/* Progress Bar */}
              <div
                className="flex-1 min-w-0 bg-gray-200 dark:bg-gray-700 rounded-full h-2 relative overflow-hidden"
                role="progressbar"
                aria-valuenow={progressPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${module.completedLessons} of ${module.totalLessons} lessons completed`}
              >
                <div
                  className="absolute top-0 h-full rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: `${progressPercentage}%`,
                    backgroundColor: progressColor,
                    [isRTL ? "right" : "left"]: 0,
                  }}
                />
              </div>

              {/* Lesson Count */}
              <span
                className={`text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap font-medium flex-shrink-0 ${
                  isRTL ? "font-arabic" : "font-sans"
                }`}
              >
                {module.completedLessons}/{module.totalLessons}{" "}
                {module.totalLessons !== 1
                  ? t("modules.lessons")
                  : t("modules.lesson")}
              </span>
            </div>
          </div>
        )}

        {/* Locked actions */}
        {!module.isUnlocked && (
          <div
            className={`flex flex-wrap w-full gap-2 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <Button
              state="filled"
              size="XS"
              icon_position={isRTL ? "right" : "left"}
              icon={<Lock className="w-4 h-4" aria-hidden="true" />}
              text={t("modules.unlock")}
              onClick={handleUnlockClick}
            />
            <Button
              state="text"
              size="XS"
              icon_position={isRTL ? "left" : "right"}
              icon={
                <ChevronIcon
                  className="w-4 h-4"
                  style={{ color: "var(--primary-300)" }}
                  aria-hidden="true"
                />
              }
              text={t("modules.viewChapters")}
              onClick={handleViewChaptersClick}
            />
          </div>
        )}
      </div>
    </div>
  );
}
