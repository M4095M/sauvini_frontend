"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import type { Live } from "@/api/lives";
import { Video, ChevronDown } from "lucide-react";
import Button from "@/components/ui/button";

export default function StudentLivesGrid({
  title,
  lives,
  loading = false,
}: {
  title: string;
  lives: Live[];
  loading?: boolean;
}) {
  const { isRTL, t } = useLanguage();

  // Filters (UI-first; values remain in English for logic)
  const [moduleFilter, setModuleFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const moduleOptions = useMemo(() => {
    const set = new Set<string>();
    lives?.forEach((l) => {
      if (l.module_name) set.add(l.module_name);
    });
    return ["All", ...Array.from(set)];
  }, [lives]);

  const statusOptions = ["All", "Live", "Ended", "Approved", "Pending"];

  const filtered = (lives || []).filter((l) => {
    const moduleOk =
      moduleFilter === "All" ? true : l.module_name === moduleFilter;
    const statusOk = statusFilter === "All" ? true : l.status === statusFilter;
    return moduleOk && statusOk;
  });

  return (
    <div
      className="bg-[#F8F8F8] dark:bg-[#1A1A1A] rounded-[52px] p-6"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Title */}
      <h2
        className={`text-2xl font-bold text-gray-900 dark:text-white mb-4 ${
          isRTL ? "font-arabic" : "font-sans"
        }`}
      >
        {title}
      </h2>

      {/* Filters */}
      <div
        className={`flex flex-wrap items-center gap-4 mb-6 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <div className="relative">
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className={`p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg min-w-[220px] ${
              isRTL ? "text-right font-arabic" : "text-left font-sans"
            }`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {moduleOptions.map((m) => (
              <option key={m} value={m}>
                {(t("lives.filter.module") || "Module") + " : " + m}
              </option>
            ))}
          </select>
          <ChevronDown
            className={`pointer-events-none w-5 h-5 text-gray-400 absolute top-1/2 -translate-y-1/2 ${
              isRTL ? "left-2" : "right-2"
            }`}
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg min-w-[220px] ${
              isRTL ? "text-right font-arabic" : "text-left font-sans"
            }`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {(t("lives.filter.status") || "Status") + " : " + s}
              </option>
            ))}
          </select>
          <ChevronDown
            className={`pointer-events-none w-5 h-5 text-gray-400 absolute top-1/2 -translate-y-1/2 ${
              isRTL ? "left-2" : "right-2"
            }`}
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-16 text-center text-gray-500 dark:text-gray-400">
          {t("common.loading") || "Loading..."}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-gray-500 dark:text-gray-400">
          {t("lives.noLives") || "No lives found"}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((live) => (
            <div
              key={live.id}
              className="rounded-[26px] bg-white dark:bg-gray-800 p-4 flex flex-col gap-3 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 flex items-center justify-center">
                  <Video className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-semibold text-gray-900 dark:text-white truncate ${
                      isRTL ? "font-arabic" : "font-sans"
                    }`}
                  >
                    {live.title}
                  </h3>
                  <p
                    className={`text-sm text-gray-500 dark:text-gray-400 ${
                      isRTL ? "font-arabic" : "font-sans"
                    }`}
                  >
                    {live.module_name ||
                      t("lives.card.path") ||
                      "Module / Chapter"}
                  </p>
                </div>
              </div>

              <p
                className={`text-sm text-gray-600 dark:text-gray-300 line-clamp-3 ${
                  isRTL ? "font-arabic" : "font-sans"
                }`}
              >
                {live.description ||
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero."}
              </p>

              <div className="pt-2">
                <Button
                  state="filled"
                  size="S"
                  icon_position="none"
                  text={t("lives.viewRecording") || "View Recording"}
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.location.href = `/professor/lives/${live.id}/recording`;
                    }
                  }}
                  optionalStyles="w-full"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
