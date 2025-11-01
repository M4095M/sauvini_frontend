"use client";

import Image from "next/image";
import Button from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

export default function Hero() {
  const { t, isRTL } = useLanguage();

  const handleExploreModules = () => {
    window.location.href = "/modules";
  };

  const handleStartLearning = () => {
    window.location.href = "/register";
  };

  return (
    <section
      className="flex w-full justify-center items-center flex-shrink-0 bg-[var(--Surface-Level-2,#F8F8F8)] dark:bg-[#1A1A1A] min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px] xl:min-h-[800px] py-8 sm:py-12 md:py-16 lg:py-24 xl:py-[136px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[120px] rounded-3xl sm:rounded-[56px] md:rounded-[80px] lg:rounded-[100px] xl:rounded-[110px]"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Internal Content Frame */}
      <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-[1200px] gap-8 md:gap-12 lg:gap-16">
        {/* Text Content Frame */}
        {!isRTL && (
          <div className="flex flex-col items-start w-full lg:w-[592px] gap-6 sm:gap-8 md:gap-10 lg:gap-[66px] order-2 lg:order-1">
            {/* Title and Description */}
            <div className="flex flex-col items-start self-stretch gap-4 sm:gap-6 md:gap-8 lg:gap-[36px]">
              {/* Title */}
              <h1 className="self-stretch text-[var(--Content-Primary,#1A1A1A)] dark:text-white font-bold leading-tight sm:leading-normal text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[96px] tracking-tight sm:tracking-[-0.96px] md:tracking-[-1.44px] lg:tracking-[-1.92px]">
                {t("landing.hero.title") || "Your Future Starts Here"}
              </h1>

              {/* Description */}
              <p className="self-stretch text-[var(--Content-Secondary,#7C7C7C)] dark:text-[#A0A0A0] font-medium text-sm sm:text-base md:text-lg lg:text-xl xl:text-[24px] leading-6 sm:leading-7 md:leading-8 lg:leading-9 xl:leading-[36px] tracking-tight sm:tracking-[-0.24px] md:tracking-[-0.36px] lg:tracking-[-0.48px]">
                {t("landing.hero.description") ||
                  "Learn, practice, and succeed with trusted teachers. Unlock chapters, track progress, and reach your goals."}
              </p>
            </div>

            {/* Buttons Frame */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center self-stretch sm:self-start gap-3 sm:gap-4">
              <Button
                state="outlined"
                size="M"
                icon_position="none"
                text={t("landing.hero.exploreModules") || "Explore Modules"}
                onClick={handleExploreModules}
                optionalStyles="whitespace-nowrap w-full sm:w-auto min-w-fit"
              />

              <Button
                state="filled"
                size="M"
                icon_position="none"
                text={t("landing.hero.startLearning") || "Start Learning"}
                onClick={handleStartLearning}
                optionalStyles="whitespace-nowrap w-full sm:w-auto min-w-fit"
              />
            </div>
          </div>
        )}

        {/* Picture Frame */}
        <div className="flex-shrink-0 w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[592px] h-auto aspect-[592/527] order-1 lg:order-2">
          <Image
            src="/rafiki.svg"
            alt={
              t("landing.hero.imageAlt") ||
              "Students learning and achieving their goals"
            }
            width={592}
            height={527}
            className="w-full h-full object-contain"
            priority
          />
        </div>

        {/* Text Content Frame */}
        {isRTL && (
          <div className="flex flex-col items-start w-full lg:w-[592px] gap-6 sm:gap-8 md:gap-10 lg:gap-[66px] order-2 lg:order-3">
            {/* Title and Description */}
            <div className="flex flex-col items-start self-stretch gap-4 sm:gap-6 md:gap-8 lg:gap-[36px]">
              {/* Title */}
              <h1 className="self-stretch text-[var(--Content-Primary,#1A1A1A)] dark:text-white font-bold leading-tight sm:leading-normal text-right text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[96px] tracking-tight sm:tracking-[-0.96px] md:tracking-[-1.44px] lg:tracking-[-1.92px]">
                {t("landing.hero.title") || "Your Future Starts Here"}
              </h1>

              {/* Description */}
              <p className="self-stretch text-[var(--Content-Secondary,#7C7C7C)] dark:text-[#A0A0A0] font-medium text-right text-sm sm:text-base md:text-lg lg:text-xl xl:text-[24px] leading-6 sm:leading-7 md:leading-8 lg:leading-9 xl:leading-[36px] tracking-tight sm:tracking-[-0.24px] md:tracking-[-0.36px] lg:tracking-[-0.48px]">
                {t("landing.hero.description") ||
                  "Learn, practice, and succeed with trusted teachers. Unlock chapters, track progress, and reach your goals."}
              </p>
            </div>

            {/* Buttons Frame */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center self-stretch sm:self-start gap-3 sm:gap-4">
              <Button
                state="filled"
                size="M"
                icon_position="none"
                text={t("landing.hero.startLearning") || "Start Learning"}
                onClick={handleStartLearning}
                optionalStyles="whitespace-nowrap w-full sm:w-auto min-w-fit"
              />

              <Button
                state="outlined"
                size="M"
                icon_position="none"
                text={t("landing.hero.exploreModules") || "Explore Modules"}
                onClick={handleExploreModules}
                optionalStyles="whitespace-nowrap w-full sm:w-auto min-w-fit"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
