"use client";
import Button from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeSwitcher, ThemeToggle } from "@/components/ui/theme-switcher";
import { useLanguage } from "@/context/LanguageContext";
import { Check } from "lucide-react";

export default function Home() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen">
      <header className="w-full flex flex-row justify-around border-b border-neutral-200">
        <div className="font-work-sans text-subheader-1 p-4">Theme Demo</div>
        <div className="flex gap-4 justify-center items-center">
          <LanguageSwitcher />
          <div className="flex gap-4 justify-center items-center">
            <ThemeSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <header className="font-work-sans text-header-1 p-4 text-center">
        Sauvini Theme Demo
      </header>
      <div className="flex flex-col gap-4 justify-center items-center mt-10">
        <div className="font-work-sans text-header-1">
          {t("about_us.title")}
        </div>
        <div className="font-work-sans text-body-1">
          {t("about_us.description")}
        </div>
      </div>
      <div className="font-work-sans mt-10">
        <div className="flex flex-col gap-4 justify-center items-center">
          <Button
            state="filled"
            size="M"
            icon_position="left"
            text="Log in"
            disabled={false}
            icon={<Check />}
          />
        </div>
      </div>
    </div>
  );
}
