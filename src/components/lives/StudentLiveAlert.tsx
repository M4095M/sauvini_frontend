"use client";

import { Play } from "lucide-react";
import Button from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import type { Live } from "@/api/lives";

export default function LiveSessionAlert({ live }: { live?: Live }) {
  const { isRTL, t } = useLanguage();

  if (!live) return null;

  return (
    <div
      className="w-full rounded-[52px] border-[5px] border-[#A3BAD6] bg-[#EEF3FB] dark:bg-[#1E2B42] px-6 py-5"
      dir={isRTL ? "rtl" : "ltr"}
      role="region"
      aria-label="Live session alert"
    >
      <div
        className={`flex items-center justify-between gap-4 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
              {t("lives.urgent") || "Urgent"}
            </span>
            <p
              className={`text-sm text-gray-700 dark:text-gray-200 ${
                isRTL ? "font-arabic" : "font-sans"
              }`}
            >
              {t("lives.sessionStarted") || 'Live session : "Title" started'}
            </p>
          </div>
          <p
            className={`mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2 ${
              isRTL ? "font-arabic" : "font-sans"
            }`}
          >
            {live.description ||
              "Lorem ipsum amet, consectetur adipiscing elit. Integer nec odio. Praesent libero."}
          </p>
        </div>

        <Button
          state="filled"
          size="M"
          icon_position="left"
          icon={<Play className="w-4 h-4" />}
          text={t("lives.join") || "Join"}
          onClick={() => {
            // For students, joining will likely open a viewer route when available
            // For now, we can deep-link to recording page if stream page isn't available
            if (typeof window !== "undefined") {
              window.location.href = `/professor/lives/${live.id}/stream`;
            }
          }}
        />
      </div>
    </div>
  );
}
