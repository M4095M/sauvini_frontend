"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { useSafeTranslation } from "@/hooks/useSafeTranslation";
import Button from "@/components/ui/button";

interface Props {
  onClose: () => void;
  onConfirm: () => void;
}

export default function CancelLiveModal({ onClose, onConfirm }: Props) {
  const { isRTL } = useLanguage();
  const { safeTranslate } = useSafeTranslation();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative z-10 bg-white dark:bg-[#1A1A1A] rounded-[52px] p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2
          className={`text-2xl font-bold text-gray-900 dark:text-white mb-4 ${
            isRTL ? "font-arabic text-right" : "font-sans text-left"
          }`}
        >
          {safeTranslate("professor.lives.cancelModal.title", "Cancel Live")}
        </h2>

        {/* Message */}
        <p
          className={`text-gray-600 dark:text-gray-400 mb-6 ${
            isRTL ? "font-arabic text-right" : "font-sans text-left"
          }`}
        >
          {safeTranslate(
            "professor.lives.cancelModal.message",
            "Are you sure you want to cancel this live? Admin and the students will be notified"
          )}
        </p>

        {/* Actions */}
        <div className={`flex gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Button
            state="tonal"
            size="M"
            icon_position="none"
            text={safeTranslate(
              "professor.lives.cancelModal.keepLive",
              "Keep Live"
            )}
            onClick={onClose}
            optionalStyles="flex-1"
          />
          <Button
            state="filled"
            size="M"
            icon_position="none"
            text={safeTranslate(
              "professor.lives.cancelModal.cancelLive",
              "Cancel Live"
            )}
            onClick={onConfirm}
            optionalStyles="flex-1 bg-red-600 hover:bg-red-700"
          />
        </div>
      </div>
    </div>
  );
}
