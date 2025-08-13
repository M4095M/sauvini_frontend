"use client";
import AuthRoleCard from "@/components/auth/role_card";
import InputButton from "@/components/input/InputButton";
import TwoOptionRadio from "@/components/input/twoOptionRadio";
import Alert from "@/components/ui/alert";
import Button from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeSwitcher, ThemeToggle } from "@/components/ui/theme-switcher";
import { useLanguage } from "@/context/LanguageContext";
import ModuleCard from "@/components/modules/ModuleCard";
import ChapterCard from "@/components/modules/ChapterCard";
import ModuleHeader from "@/components/modules/ModuleHeader";
import Footer from '@/components/ui/footer'
import UserHeader from "@/components/modules/UserHeader";
import { Check } from "lucide-react";
import { MOCK_MODULES_DATA } from "../../data/mockModules";

export default function Home() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen">
      <header className="w-full flex flex-row flex-flex-wrap justify-around border-b border-neutral-200">
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
        <div className="flex flex-col flex-flex-wrap gap-10 justify-center items-center mb-10">
          <div className="flex flex-row  gap-10">
            <Button
              state="outlined"
              size="M"
              icon_position="left"
              text="Log in"
              disabled={false}
              icon={<Check />}
            />
          </div>
          <AuthRoleCard
            user={"Student"}
            benefits={[
              "Learn with videos & notes",
              "Track your progress",
              "Ask professors directly",
            ]}
            icon={<Check />}
          />
          <InputButton label={"Label"} type="plus-minus" />
          <TwoOptionRadio
            label={"Gender"}
            required={true}
            firstOption={"Male"}
            secondOption={"Female"}
          />
          <Alert
            title={"This is a message"}
            description={"This is a supporting message "}
            type={"warning"}
          />
          <ModuleCard
            key={1}
            module={MOCK_MODULES_DATA.modules[0]}
            isMobile={false}
          />
          <ModuleHeader module={MOCK_MODULES_DATA.modules[0]} />
          <ChapterCard chapter={MOCK_MODULES_DATA.modules[0].chapters[0]} />
          <UserHeader userProfile={MOCK_MODULES_DATA.userProfile} />
          <Footer />
        </div>
      </div>
    </div>
  );
}
