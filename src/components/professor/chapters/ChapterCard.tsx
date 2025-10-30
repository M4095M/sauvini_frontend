"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Clock,
  Eye,
  Edit3,
  Check,
  X,
} from "lucide-react";
import type { Chapter } from "@/types/modules";
import { useLanguage } from "@/hooks/useLanguage";
import { RTL_LANGUAGES } from "@/lib/language";
import Tag from "@/components/professor/tag";
import { ChaptersApi } from "@/api/chapters";

interface ProfessorChapterCardProps {
  chapter: Chapter;
  moduleColor: string;
  isRTL?: boolean;
  isMobile?: boolean;
  className?: string;
  onChapterUpdate?: (updatedChapter: Chapter) => void;
}

// Module color mapping
const COLOR_MAP: Record<string, string> = {
  yellow: "#FFD427",
  blue: "#27364D",
  purple: "#9663FE",
  green: "#22C55E",
  red: "#EF4444",
} as const;

// mock chapter state logic
const getChapterState = (chapter: Chapter) => {
  const statusObj = (chapter as any).status;
  if (statusObj && typeof statusObj === "object") {
    if (statusObj.hasPublishedVersion) {
      return { status: "published", priority: "published" };
    }
    if (statusObj.hasValidatedVersion) {
      return { status: "validated", priority: "validated" };
    }
    if (statusObj.hasWaitingVersion) {
      return { status: "waiting", priority: "waiting" };
    }
  }

  // Fallback deterministic logic (MOCK THO)
  const totalLessons =
    chapter.totalLessons ||
    (Array.isArray(chapter.lessons) ? chapter.lessons.length : 0);

  if (totalLessons === 0) {
    return { status: "waiting", priority: "waiting" };
  }
  return { status: "published", priority: "published" };
};

const getStatusConfig = (priority: string, t: (key: string) => string) => {
  switch (priority) {
    case "published":
      return {
        label: t("professor.chapters.status.published"),
        color: "#22C55E",
        bgColor: "#DCFCE7",
        icon: Eye,
      };
    case "validated":
      return {
        label: t("professor.chapters.status.validated"),
        color: "#3B82F6",
        bgColor: "#DBEAFE",
        icon: CheckCircle,
      };
    case "waiting":
    default:
      return {
        label: t("professor.chapters.status.waiting"),
        color: "#F59E0B",
        bgColor: "#FEF3C7",
        icon: Clock,
      };
  }
};

export default function ProfessorChapterCard({
  chapter,
  moduleColor,
  isRTL: propIsRTL,
  isMobile = false,
  className = "",
  onChapterUpdate,
}: ProfessorChapterCardProps) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const isRTL =
    propIsRTL !== undefined ? propIsRTL : RTL_LANGUAGES.includes(language);

  // Price editing state
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [editPrice, setEditPrice] = useState(chapter.price?.toString() || "0");
  const [isUpdatingPrice, setIsUpdatingPrice] = useState(false);

  // Price editing functions
  const handleStartEditPrice = () => {
    setIsEditingPrice(true);
    setEditPrice(chapter.price?.toString() || "0");
  };

  const handleCancelEditPrice = () => {
    setIsEditingPrice(false);
    setEditPrice(chapter.price?.toString() || "0");
  };

  const handleSavePrice = async () => {
    const newPrice = parseFloat(editPrice);
    if (isNaN(newPrice) || newPrice < 0) {
      return;
    }

    setIsUpdatingPrice(true);
    try {
      // Update the chapter price using the API
      const chapterId =
        typeof chapter.id === "string" ? chapter.id : chapter.id?.id?.String;
      if (!chapterId) {
        throw new Error("Invalid chapter ID");
      }

      await ChaptersApi.updateChapter(chapterId, {
        price: newPrice,
      });

      // Update the local chapter object
      const updatedChapter = {
        ...chapter,
        price: newPrice,
      };

      // Notify parent component of the update
      if (onChapterUpdate) {
        onChapterUpdate(updatedChapter);
      }

      setIsEditingPrice(false);
    } catch (error) {
      console.error("Failed to update chapter price:", error);
      // Reset to original price on error
      setEditPrice(chapter.price?.toString() || "0");
    } finally {
      setIsUpdatingPrice(false);
    }
  };

  // Computed values
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;
  const totalLessons = chapter.totalLessons || 0;
  const chapterColor = COLOR_MAP[moduleColor] || "#6B7280";
  const chapterState = getChapterState(chapter);
  const statusConfig = getStatusConfig(chapterState.priority, t);
  const StatusIcon = statusConfig.icon;

  // Check if chapter is complete (has lessons and exam)
  const isComplete =
    totalLessons > 0 && chapter.lessons && chapter.lessons.length > 0;

  // Event handlers
  const handleChapterClick = () => {
    const moduleId = chapter.moduleId || "";
    const url = `/professor/manage-chapter?chapterId=${encodeURIComponent(
      chapter.id
    )}&moduleId=${encodeURIComponent(moduleId)}`;
    console.log("Navigating to:", url);
    router.push(url);
  };

  // Utility functions
  const truncateDescription = (text: string, maxLength = 100): string => {
    return text.length > maxLength
      ? `${text.slice(0, maxLength - 3)}...`
      : text;
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleChapterClick();
        }
      }}
      className={`
        relative flex flex-col w-full rounded-[28px] 
        transition-all duration-200 hover:shadow-md cursor-pointer
        border border-[#BDBDBD] bg-white
        dark:border-[#7C7C7C] dark:bg-[#1A1A1A]
        overflow-hidden
        ${className}
      `}
      style={{ minHeight: 260, padding: "16px 24px 20px 24px" }}
      onClick={handleChapterClick}
    >
      <div className="flex flex-col justify-between gap-3 w-full h-full min-h-0">
        {/* Top Section: Icon + Content */}
        <div
          className={`flex w-full items-start gap-3`}
          style={{ minWidth: 0, minHeight: 0 }}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {/* Chapter Icon */}
          <div className="relative flex-shrink-0 w-[60px] h-[60px]">
            <Image
              src={
                chapter.image ||
                "/placeholder.svg?height=70&width=72&query=chapter"
              }
              alt={`${chapter.title} illustration`}
              width={60}
              height={60}
              className="object-cover"
            />
          </div>

          {/* Content Section */}
          <div
            className="flex flex-col gap-2"
            style={{
              flex: "1 1 0%",
              minWidth: 0,
              overflow: "hidden",
            }}
          >
            {/* Title Row with Arrow */}
            <div
              className={`flex items-center justify-between gap-2`}
              style={{ minWidth: 0, width: "100%" }}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <h3
                className={`
                  text-base font-semibold text-gray-900 dark:text-white 
                  truncate leading-tight
                  ${isRTL ? "text-right font-arabic" : "text-left font-sans"}
                `}
                style={{
                  flex: "1 1 0%",
                  minWidth: 0,
                }}
                title={chapter.title}
              >
                {chapter.title}
              </h3>

              {/* Arrow Icon */}
              <div className="flex-shrink-0">
                <ChevronIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
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
              {chapter.description}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div
          className="flex flex-col items-start gap-2.5 self-stretch mt-auto"
          dir={isRTL ? "rtl" : "ltr"}
        >
          {/* Academic Stream Tags */}
          <div
            className={`flex flex-wrap items-center gap-1.5 ${
              isRTL ? "justify-end" : "justify-start"
            }`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {chapter.academicStreams.slice(0, 3).map((stream) => (
              <span
                key={stream}
                className="inline-flex rounded-full"
                style={{ backgroundColor: chapterColor }}
              >
                <Tag
                  icon={null}
                  text={t(
                    `professor.academicStreams.${stream
                      .toLowerCase()
                      .replace(/[^a-z0-9]/g, "")}`
                  )}
                  className={`text-[11px] font-medium text-white px-2 py-0.5 ${
                    isRTL ? "font-arabic" : "font-sans"
                  }`}
                />
              </span>
            ))}
            {chapter.academicStreams.length > 3 && (
              <span
                className={`text-xs font-medium text-gray-500 dark:text-gray-400 ${
                  isRTL ? "font-arabic" : "font-sans"
                }`}
              >
                +{chapter.academicStreams.length - 3}
              </span>
            )}
          </div>

          {/* Status Indicator */}
          <div
            className={`flex items-center gap-2 ${
              isRTL ? "justify-end" : "justify-start"
            }`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ backgroundColor: statusConfig.bgColor }}
            >
              <StatusIcon
                className="w-3 h-3"
                style={{ color: statusConfig.color }}
              />
              <span
                className={`text-xs font-medium ${
                  isRTL ? "font-arabic" : "font-sans"
                }`}
                style={{ color: statusConfig.color }}
              >
                {statusConfig.label}
              </span>
            </div>
          </div>

          {/* Lessons Count */}
          <div
            className={`flex items-center ${
              isRTL ? "justify-end" : "justify-start"
            }`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <p
              className={`text-xs text-gray-500 dark:text-gray-400 font-medium ${
                isRTL ? "font-arabic" : "font-sans"
              }`}
            >
              {t("professor.chapters.lessonsCount")}: {totalLessons}
            </p>
          </div>

          {/* Price */}
          <div
            className={`flex items-center gap-2 ${
              isRTL ? "justify-end" : "justify-start"
            }`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {isEditingPrice ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  disabled={isUpdatingPrice}
                  className={`w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                    isRTL ? "text-right" : "text-left"
                  } ${isUpdatingPrice ? "opacity-50 cursor-not-allowed" : ""}`}
                  autoFocus
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  DA
                </span>
                <button
                  onClick={handleSavePrice}
                  disabled={isUpdatingPrice}
                  className="p-1 text-green-600 hover:text-green-700 disabled:opacity-50"
                  title="Save price"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={handleCancelEditPrice}
                  disabled={isUpdatingPrice}
                  className="p-1 text-red-600 hover:text-red-700 disabled:opacity-50"
                  title="Cancel editing"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group">
                <p
                  className={`text-sm text-gray-700 dark:text-gray-300 font-semibold ${
                    isRTL ? "font-arabic" : "font-sans"
                  }`}
                >
                  {chapter.price || 0} DA
                </p>
                <button
                  onClick={handleStartEditPrice}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Edit price"
                >
                  <Edit3 size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Last Version */}
          <div
            className={`flex items-center ${
              isRTL ? "justify-end" : "justify-start"
            }`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <p
              className={`text-xs text-gray-500 dark:text-gray-400 font-medium ${
                isRTL ? "font-arabic" : "font-sans"
              }`}
            >
              {t("professor.chapters.lastVersion")}: Under review
            </p>
          </div>

          {/* Completion Status */}
          {!isComplete && (
            <div
              className={`flex items-center gap-1.5 ${
                isRTL ? "justify-end flex-row-reverse" : "justify-start"
              }`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              <span
                className={`text-xs text-gray-500 dark:text-gray-400 ${
                  isRTL ? "font-arabic" : "font-sans"
                }`}
              >
                {t("professor.chapters.incomplete")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
