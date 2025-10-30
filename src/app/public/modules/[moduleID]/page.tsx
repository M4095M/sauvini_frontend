"use client";

import DropDown from "@/components/input/dropDown";
import { useLanguage } from "@/context/LanguageContext";
import ModuleCard from "../ModuleCard";
import ChapterCard from "./chapterCard";

export default function ChaptersPage() {
  const { isRTL, t, language } = useLanguage();

  return (
    <div className="px-3 py-6 rounded-[52px] bg-neutral-100 flex flex-col">
      {/* header */}
      <div className="font-medium text-neutral-600 text-2xl px-4">
        {t("public.chapters")}
      </div>
      {/* main content */}
      <div className="flex flex-col gap-6">
        {/* filter */}
        <div className="w-fit">
          <DropDown placeholder={t("public.AcademicStream")} />
        </div>
        {/* grid */}
        <div className="flex flex-wrap gap-4">
          <ChapterCard t={t} isRTL={isRTL} />
          <ChapterCard t={t} isRTL={isRTL} />
          <ChapterCard t={t} isRTL={isRTL} />
          <ChapterCard t={t} isRTL={isRTL} />
          <ChapterCard t={t} isRTL={isRTL} />
          <ChapterCard t={t} isRTL={isRTL} />
        </div>
      </div>
    </div>
  );
}
