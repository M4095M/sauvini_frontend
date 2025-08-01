"use client"
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";

export default function Home() {
  const { t } = useLanguage();
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="flex flex-col gap-4 justify-center items-center">
        <div className="font-work-sans text-header-1">
          {t("about_us.title")}
        </div>
        <div className="font-work-sans text-body-1">
          {t("about_us.description")}
        </div>
      </div>
    </div>
  );
}
