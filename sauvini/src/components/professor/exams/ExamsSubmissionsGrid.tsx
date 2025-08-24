"use client";

import { useMemo, useState } from "react";
import { Menu, Filter, Bell } from "lucide-react";
import ExamsCard from "./ExamSubmissionCard";
import DropDown from "@/components/input/dropDown";
import { useLanguage } from "@/hooks/useLanguage";
import type { ExamSubmission } from "@/types/exam";

interface ExamsGridProps {
  submissions?: ExamSubmission[];
  isMobile?: boolean;
}

export default function ExamsGrid({ submissions = [], isMobile = false }: ExamsGridProps) {
  const { t, isRTL } = useLanguage();
  const [chapterFilter, setChapterFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);

  const fontClass = isRTL ? "font-arabic text-right" : "font-sans text-left";

  const chapterOptions = useMemo(() => {
    const set = new Set<string>();
    submissions.forEach((s) => s.chapterName && set.add(s.chapterName));
    const arr = Array.from(set);
    return arr.length ? ["All", ...arr] : ["All", "Complex Numbers"];
  }, [submissions]);

  const statusOptions = useMemo(() => ["All", "Waiting", "Corrected"], []);

  const filtered = useMemo(() => {
    return submissions.filter((s) => {
      if (chapterFilter !== "All" && s.chapterName !== chapterFilter) return false;
      if (statusFilter !== "All") {
        const map: Record<string, string> = { Waiting: "waiting", Corrected: "corrected" };
        if (map[statusFilter] && s.status !== map[statusFilter]) return false;
      }
      return true;
    });
  }, [submissions, chapterFilter, statusFilter]);

  return (
    <section
      className="w-full rounded-[52px] bg-neutral-100 dark:bg-neutral-800 p-4 md:p-6"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Title */}
      <div className={`w-full mb-4 ${isRTL ? "text-right" : "text-left"}`}>
        <h2 className={`text-2xl md:text-3xl font-bold text-gray-900 dark:text-white ${fontClass}`}>
          {t("professor.exams.title") ?? "Exam Submissions"}
        </h2>
      </div>

      {/* Filters: responsive */}
      <div
        className={`w-full mb-4 flex flex-col gap-3 md:flex-row md:items-center md:gap-3 ${isRTL ? "md:flex-row-reverse" : ""}`}
      >
        <div className="w-full md:w-auto">
          <DropDown
            label="" // hide label text
            placeholder={t("professor.exams.filter.selectChapter") ?? "Select chapter"}
            options={chapterOptions.map((c) => ({ id: c, text: c }))}
            t={t}
            isRTL={isRTL}
            max_width="max-w-full"
          />
          {/* functional native select kept for state handling (visually hidden, accessible) */}
          <select
            aria-label={t("professor.exams.filter.chapter") ?? "Chapter"}
            value={chapterFilter}
            onChange={(e) => setChapterFilter(e.target.value)}
            className="sr-only"
          >
            {chapterOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-auto">
          <DropDown
            label="" // hide label text
            placeholder={t("professor.exams.filter.selectStatus") ?? "Select status"}
            options={statusOptions.map((s) => ({ id: s, text: t(`professor.exams.status.${s.toLowerCase()}`) ?? s }))}
            t={t}
            isRTL={isRTL}
            max_width="max-w-full"
          />
          {/* functional native select kept for state handling (visually hidden, accessible) */}
          <select
            aria-label={t("professor.exams.filter.status") ?? "Status"}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="sr-only"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {t(`professor.exams.status.${s.toLowerCase()}`) ?? s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Submissions */}
      <div className="flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className={`py-12 text-center text-gray-500 dark:text-gray-400 ${fontClass}`}>
            {t("professor.exams.noSubmissions") ?? "No submissions"}
          </div>
        ) : (
          filtered.map((submission) => (
            <ExamsCard key={submission.id} submission={submission} isRTL={isRTL} isMobile={isMobile} />
          ))
        )}
      </div>
    </section>
  );
}
