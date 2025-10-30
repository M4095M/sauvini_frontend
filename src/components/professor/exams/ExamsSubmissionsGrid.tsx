"use client";

import { useMemo, useState } from "react";
import { Menu, Filter, Bell } from "lucide-react";
import Image from "next/image";
import ExamsCard from "./ExamSubmissionCard";
import DropDown from "@/components/input/dropDown";
import { useLanguage } from "@/hooks/useLanguage";
import { useSidebar } from "@/context/SideBarContext";
import type { ExamSubmission } from "@/types/exam";

interface ExamsGridProps {
  submissions?: ExamSubmission[];
  isMobile?: boolean;
  userProfile?: { level?: number } | null;
}

export default function ExamsGrid({ submissions = [], isMobile = false, userProfile }: ExamsGridProps) {
  const { t, isRTL } = useLanguage();
  const { toggle } = useSidebar();
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
      {/* Mobile Top Bar */}
      {isMobile && (
        <div className={`flex justify-between items-end w-full mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Image src="/S_logo.svg" alt="Sauvini S Logo" width={40} height={40} className="dark:brightness-150" />
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            {userProfile && (
              <div className="flex items-center gap-2 bg-[#E6EBF4] dark:bg-[#324C72] px-3 py-2 rounded-full">
                <span className={`text-sm font-medium text-[#324C72] dark:text-[#CEDAE9] ${isRTL ? "font-arabic" : "font-sans"}`}>
                  {t("modules.level")} {userProfile.level || 1}
                </span>
              </div>
            )}
            <button 
              className="flex items-center justify-center w-10 h-10 bg-[#DCE6F5] dark:bg-[#2B3E5A] rounded-full"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-[#324C72] dark:text-[#90B0E0]" />
            </button>
            <button 
              className="flex items-center justify-center w-10 h-10 bg-[#DCE6F5] dark:bg-[#2B3E5A] rounded-full"
              onClick={toggle}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-[#324C72] dark:text-[#90B0E0]" />
            </button>
          </div>
        </div>
      )}

      {/* Title */}
      <div className={`w-full mb-4 ${isRTL ? "text-right" : "text-left"}`}>
        <h2 className={`text-2xl md:text-3xl font-bold text-gray-900 dark:text-white ${fontClass}`}>
          {t("professor.exams.title") ?? "Exam Submissions"}
        </h2>
      </div>

      {/* Filters: responsive */}
      <div
        className={`w-full mb-4 flex flex-col gap-3 md:flex-row md:items-center md:gap-3`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="w-full md:w-auto">
          <DropDown
            label=""
            placeholder={t("professor.exams.filter.selectChapter") ?? "Select chapter"}
            options={chapterOptions.map((c) => ({ id: c, text: c }))}
            value={chapterFilter}
            onChange={(value) => setChapterFilter(value)}
            t={t}
            isRTL={isRTL}
            max_width="max-w-full"
          />
        </div>

        <div className="w-full md:w-auto">
          <DropDown
            label=""
            placeholder={t("professor.exams.filter.selectStatus") ?? "Select status"}
            options={statusOptions.map((s) => ({ id: s, text: t(`professor.exams.status.${s.toLowerCase()}`) ?? s }))}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            t={t}
            isRTL={isRTL}
            max_width="max-w-full"
          />
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
