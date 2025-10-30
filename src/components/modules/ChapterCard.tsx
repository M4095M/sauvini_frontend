"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import type { Chapter } from "@/types/modules";
import { ChevronRight, ChevronLeft, Lock } from "lucide-react";
import Button from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { RTL_LANGUAGES } from "@/lib/language";
import PurchaseChapter from "@/components/general/purchaseChapter";

interface ChapterCardProps {
  chapter: Chapter;
  onClick?: () => void;
}

export default function ChapterCard({ chapter, onClick }: ChapterCardProps) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const moduleId = params.moduleId as string;
  const isRTL = RTL_LANGUAGES.includes(language);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const progressPercentage =
    chapter.totalLessons > 0
      ? (chapter.completedLessons / chapter.totalLessons) * 100
      : 0;

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  const handleChapterClick = () => {
    if (chapter.isUnlocked) {
      if (onClick) {
        onClick();
      } else {
        // Extract the correct chapter ID for navigation
        const chapterId =
          typeof chapter.id === "string" ? chapter.id : chapter.id?.id?.String;
        if (chapterId) {
          // Navigate to the chapter lessons page
          router.push(`/modules/${moduleId}/chapters/${chapterId}`);
        }
      }
    }
  };

  const handleUnlockClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Open purchase modal
    setShowPurchaseModal(true);
  };

  const handleClosePurchaseModal = () => {
    setShowPurchaseModal(false);
  };

  const handleViewChaptersClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Extract the correct chapter ID for navigation
    const chapterId =
      typeof chapter.id === "string" ? chapter.id : chapter.id?.id?.String;
    if (chapterId) {
      // Navigate to the chapter lessons page
      router.push(`/modules/${moduleId}/chapters/${chapterId}`);
    }
  };

  return (
    <div
      className={`flex w-[373px] h-[176px] flex-col items-start gap-[10px] rounded-[28px] transition-all duration-200 hover:shadow-md
                 border border-[#BDBDBD] bg-white
                 dark:border-[#7C7C7C] dark:bg-[#1A1A1A]
                 ${chapter.isUnlocked ? "cursor-pointer" : "cursor-default"}`}
      style={{ padding: "16px 24px 8px 24px" }}
      onClick={handleChapterClick}
    >
      <div className="flex flex-col items-start gap-2 self-stretch">
        <div
          className={`flex justify-between items-start self-stretch`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {/* Icon and content */}
          <div
            className={`flex items-start gap-3 flex-1`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <div
              className="flex justify-center items-center w-[72px] h-[70px] flex-shrink-0"
              style={{ padding: "0 12.711px 0 11px" }}
            >
              <img
                src={chapter.image || "/placeholder.svg"}
                alt={chapter.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Title and description */}
            <div
              className={`flex flex-col gap-1 flex-1 `}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <h3
                className={`font-semibold text-lg leading-tight 
                             text-gray-900 dark:text-white 
                             ${
                               isRTL
                                 ? "text-right font-arabic"
                                 : "text-left font-sans"
                             }`}
              >
                {chapter.title}
              </h3>
              <p
                className={`text-sm leading-relaxed line-clamp-2 
                           text-gray-600 dark:text-gray-300
                           ${
                             isRTL
                               ? "text-right font-arabic"
                               : "text-left font-sans"
                           }`}
              >
                {chapter.description}
              </p>
            </div>
          </div>

          {/* Arrow or Lock */}
          {chapter.isUnlocked ? (
            <ChevronIcon className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-1" />
          ) : (
            <div
              className="flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 flex-shrink-0 mt-1"
              style={{ width: 30, height: 30 }}
              aria-label="Chapter locked"
            >
              <Lock className="w-4 h-4 text-yellow-500" aria-hidden="true" />
            </div>
          )}
        </div>

        {chapter.isUnlocked ? (
          // Progress section for unlocked chapters
          <div
            className={`flex w-[284px] flex-col gap-2 ${
              isRTL ? "items-start" : "items-end"
            }`}
          >
            <div
              className={`flex items-center gap-2 w-full`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 relative overflow-hidden">
                <div
                  className="absolute top-0 h-full rounded-full transition-all duration-300 bg-yellow-400"
                  style={{
                    width: `${progressPercentage}%`,
                    [isRTL ? "right" : "left"]: 0,
                  }}
                />
              </div>
              <span
                className={`text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ${
                  isRTL ? "font-arabic" : "font-sans"
                }`}
              >
                {chapter.completedLessons}/{chapter.totalLessons}{" "}
                {t(
                  chapter.totalLessons !== 1
                    ? "modules.lessons"
                    : "modules.lesson"
                )}
              </span>
            </div>
          </div>
        ) : (
          // Unlock buttons for locked chapters
          <div
            className={`flex w-full gap-2 mt-4 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <Button
              state="filled"
              size="XS"
              icon_position={isRTL ? "left" : "right"}
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
                  className="w-4 h-4 text-blue-500"
                  aria-hidden="true"
                />
              }
              text={t("modules.viewChapters")}
              onClick={handleViewChaptersClick}
            />
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleClosePurchaseModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleClosePurchaseModal}
              className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 text-3xl font-light bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:shadow-lg transition-all"
            >
              ×
            </button>

            {/* Modal content */}
            <div className="p-2">
              <div className="text-center mb-6 pt-4">
                <h2 className="text-3xl font-bold text-gray-900">
                  {t("chapters.purchaseChapter")} - {chapter.title}
                </h2>
              </div>
              <PurchaseChapter
                chapterId={
                  typeof chapter.id === "string"
                    ? chapter.id
                    : chapter.id?.id?.String
                }
                moduleId={moduleId}
                price={chapter.price || 0}
                onSuccess={handleClosePurchaseModal}
                onCancel={handleClosePurchaseModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
