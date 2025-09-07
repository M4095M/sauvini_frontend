"use client";

import DropDown from "@/components/input/dropDown";
import ModuleCard from "./ModuleCard";
import { useLanguage } from "@/context/LanguageContext";

export default function PulicModules() {
  const { isRTL, t, language } = useLanguage();

  return (
    <div className="px-3 py-6 rounded-[52px] bg-neutral-100 flex flex-col">
      {/* header */}
      <div className="font-medium text-neutral-600 text-2xl px-4">{t("public.modules")}</div>
      {/* main content */}
      <div className="flex flex-col gap-6">
        {/* filter */}
        <div className="w-fit">
          <DropDown placeholder={t("public.AcademicStream")} />
        </div>
        {/* grid */}
        <div className="flex flex-wrap gap-4">
          <ModuleCard t={t} isRTL={isRTL} />
          <ModuleCard t={t} isRTL={isRTL} />
          <ModuleCard t={t} isRTL={isRTL} />
          <ModuleCard t={t} isRTL={isRTL} />
          <ModuleCard t={t} isRTL={isRTL} />
          <ModuleCard t={t} isRTL={isRTL} />
        </div>
      </div>
    </div>
  );
}
