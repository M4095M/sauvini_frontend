"use client";

import { useMemo, useState } from "react";
import { Menu, Bell } from "lucide-react";
import Image from "next/image";
import DropDown from "@/components/input/dropDown";
import QuestionCard from "./QuestionCard";
import { useLanguage } from "@/hooks/useLanguage";
import { useSidebar } from "@/context/SideBarContext";
import type { QuestionSubmission } from "@/data/mockQuestions";
import { MOCK_QUESTION_SUBMISSIONS } from "@/data/mockQuestions";

interface Props {
  submissions?: QuestionSubmission[];
  isMobile?: boolean;
  userProfile?: { level?: number } | null;
}

export default function QuestionsGrid({ submissions = MOCK_QUESTION_SUBMISSIONS, isMobile = false, userProfile }: Props) {
  const { t, isRTL } = useLanguage();
  const { toggle } = useSidebar();
  const [chapterFilter, setChapterFilter] = useState<string>("All");
  const [lessonFilter, setLessonFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const chapterOptions = useMemo(() => {
    const set = new Set<string>();
    submissions.forEach((s) => s.chapterName && set.add(s.chapterName));
    const arr = Array.from(set);
    return arr.length ? ["All", ...arr] : ["All"];
  }, [submissions]);

  const lessonOptions = useMemo(() => {
    const set = new Set<string>();
    submissions.forEach((s) => s.lessonName && set.add(s.lessonName));
    const arr = Array.from(set);
    return arr.length ? ["All", ...arr] : ["All"];
  }, [submissions]);

  const statusOptions = useMemo(() => ["All", "Waiting", "Answered"], []);

  const filtered = useMemo(() => {
    return submissions.filter((s) => {
      if (chapterFilter !== "All" && s.chapterName !== chapterFilter) return false;
      if (lessonFilter !== "All" && (s.lessonName ?? "") !== lessonFilter) return false;
      if (statusFilter !== "All") {
        const map: Record<string, string> = { Waiting: "waiting", Answered: "answered" };
        if (map[statusFilter] && s.status !== map[statusFilter]) return false;
      }
      return true;
    });
  }, [submissions, chapterFilter, lessonFilter, statusFilter]);

  return (
    <section 
      className="w-full self-stretch flex flex-col items-start rounded-[52px] bg-[#F8F8F8] dark:bg-[#1A1A1A] p-6 md:p-6"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {isMobile && (
        <div className={`flex justify-between items-end w-full mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Image src="/S_logo.svg" alt="Sauvini" width={40} height={40} className="dark:brightness-150" />
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            {userProfile && (
              <div className="flex items-center gap-2 bg-[#E6EBF4] dark:bg-[#324C72] px-3 py-2 rounded-full">
                <span className={`text-sm font-medium text-[#324C72] dark:text-[#CEDAE9] ${isRTL ? "font-arabic" : "font-sans"}`}>
                  {t("modules.level") ?? "Level"} {userProfile.level || 1}
                </span>
              </div>
            )}

            <button aria-label="Notifications" className="flex items-center justify-center w-10 h-10 bg-[#DCE6F5] dark:bg-[#2B3E5A] rounded-full">
              <Bell className="w-5 h-5 text-[#324C72] dark:text-[#90B0E0]" />
            </button>

            <button onClick={toggle} aria-label="Open menu" className="flex items-center justify-center w-10 h-10 bg-[#DCE6F5] dark:bg-[#2B3E5A] rounded-full">
              <Menu className="w-5 h-5 text-[#324C72] dark:text-[#90B0E0]" />
            </button>
          </div>
        </div>
      )}

      <div className={`w-full mb-4 ${isRTL ? "text-right" : "text-left"}`}>
        <h2 className={`text-2xl md:text-3xl font-bold text-gray-900 dark:text-white ${isRTL ? "font-arabic" : "font-sans"}`}>
          {t("professor.questions.title") ?? "Questions"}
        </h2>
      </div>

      <div className="w-full mb-4 ">
        <div className={`w-full flex flex-col gap-3 md:flex-row md:items-center md:gap-3`}>
          <div className="relative w-full md:w-auto">
            <DropDown 
              label="" 
              placeholder={t("professor.questions.filter.selectLesson") ?? "Select lesson"} 
              options={lessonOptions.map((c) => ({ id: c, text: c }))} 
              t={t} 
              isRTL={isRTL} 
              max_width="max-w-full" 
            />
            <select 
              aria-label={t("professor.questions.filter.lesson") ?? "Lesson"} 
              value={lessonFilter} 
              onChange={(e) => setLessonFilter(e.target.value)} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            >
              {lessonOptions.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="relative w-full md:w-auto">
            <DropDown 
              label="" 
              placeholder={t("professor.questions.filter.selectChapter") ?? "Select chapter"} 
              options={chapterOptions.map((c) => ({ id: c, text: c }))} 
              t={t} 
              isRTL={isRTL} 
              max_width="max-w-full" 
            />
            <select 
              aria-label={t("professor.questions.filter.chapter") ?? "Chapter"} 
              value={chapterFilter} 
              onChange={(e) => setChapterFilter(e.target.value)} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            >
              {chapterOptions.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="relative w-full md:w-auto">
            <DropDown 
              label="" 
              placeholder={t("professor.questions.filter.selectStatus") ?? "Select status"} 
              options={statusOptions.map((s) => ({ id: s, text: t(`professor.questions.status.${s.toLowerCase()}`) ?? s }))} 
              t={t} 
              isRTL={isRTL} 
              max_width="max-w-full" 
            />
            <select 
              aria-label={t("professor.questions.filter.status") ?? "Status"} 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            >
              {statusOptions.map((s) => <option key={s} value={s}>{t(`professor.questions.status.${s.toLowerCase()}`) ?? s}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full ">
        {filtered.length === 0 ? (
          <div className={`py-12 text-center text-gray-500 dark:text-gray-400 ${isRTL ? "font-arabic" : "font-sans"}`}>
            {t("professor.questions.noQuestions") ?? "No questions"}
          </div>
        ) : (
          filtered.map((s) => (
            <div key={s.id} className="w-full ">
              <QuestionCard submission={s} isRTL={isRTL} isMobile={isMobile} onAnswer={() => {}} onDownload={() => {}} />
            </div>
          ))
        )}
      </div>
    </section>
  );
}