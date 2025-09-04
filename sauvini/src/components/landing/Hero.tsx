"use client"

import Image from "next/image"
import Button from "@/components/ui/button"
import { useLanguage } from "@/hooks/useLanguage"

export default function Hero() {
  const { t, isRTL } = useLanguage()

  const handleExploreModules = () => {
    window.location.href = "/modules"
  }

  const handleStartLearning = () => {
    window.location.href = "/register"
  }

  return (
    <section
      className="flex w-full justify-center items-center flex-shrink-0 bg-[var(--Surface-Level-2,#F8F8F8)] dark:bg-[#1A1A1A]"
      style={{
        height: "800px",
        padding: "136.191px 120px 136.625px 120px",
        borderRadius: "110px",
      }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Internal Content Frame */}
      <div
        className="flex items-center justify-between flex-shrink-0"
        style={{
          width: "1200px",
          height: "527.184px",
        }}
      >
        {/* Text Content Frame */}
        {!isRTL && (
          <div
            className="flex flex-col items-start"
            style={{
              width: "592px",
              gap: "66px",
            }}
          >
            {/* Title and Description */}
            <div
              className="flex flex-col items-start self-stretch"
              style={{
                gap: "36px",
              }}
            >
              {/* Title */}
              <h1
                className="self-stretch text-[var(--Content-Primary,#1A1A1A)] dark:text-white font-bold leading-normal"
                style={{
                  fontSize: "96px",
                  letterSpacing: "-1.92px",
                }}
              >
                {t("landing.hero.title") || "Your Future Starts Here"}
              </h1>

              {/* Description */}
              <p
                className="self-stretch text-[var(--Content-Secondary,#7C7C7C)] dark:text-[#A0A0A0] font-medium"
                style={{
                  fontSize: "24px",
                  lineHeight: "36px",
                  letterSpacing: "-0.48px",
                }}
              >
                {t("landing.hero.description") || "Learn, practice, and succeed with trusted teachers. Unlock chapters, track progress, and reach your goals."}
              </p>
            </div>

            {/* Buttons Frame */}
            <div
              className="flex items-center"
              style={{
                gap: "16px",
              }}
            >
              <Button
                state="outlined"
                size="M"
                icon_position="none"
                text={t("landing.hero.exploreModules") || "Explore Modules"}
                onClick={handleExploreModules}
                optionalStyles="whitespace-nowrap min-w-fit"
              />

              <Button
                state="filled"
                size="M"
                icon_position="none"
                text={t("landing.hero.startLearning") || "Start Learning"}
                onClick={handleStartLearning}
                optionalStyles="whitespace-nowrap min-w-fit"
              />
            </div>
          </div>
        )}

        {/* Picture Frame */}
        <div
          className="flex-shrink-0"
          style={{
            width: "592px",
            height: "527.184px",
          }}
        >
          <Image
            src="/rafiki.svg"
            alt={t("landing.hero.imageAlt") || "Students learning and achieving their goals"}
            width={592}
            height={527}
            className="w-full h-full object-contain"
            priority
          />
        </div>

        {/* Text Content Frame */}
        {isRTL && (
          <div
            className="flex flex-col items-start"
            style={{
              width: "592px",
              gap: "66px",
            }}
          >
            {/* Title and Description */}
            <div
              className="flex flex-col items-start self-stretch"
              style={{
                gap: "36px",
              }}
            >
              {/* Title */}
              <h1
                className="self-stretch text-[var(--Content-Primary,#1A1A1A)] dark:text-white font-bold leading-normal text-right"
                style={{
                  fontSize: "96px",
                  letterSpacing: "-1.92px",
                }}
              >
                {t("landing.hero.title") || "Your Future Starts Here"}
              </h1>

              {/* Description */}
              <p
                className="self-stretch text-[var(--Content-Secondary,#7C7C7C)] dark:text-[#A0A0A0] font-medium text-right"
                style={{
                  fontSize: "24px",
                  lineHeight: "36px",
                  letterSpacing: "-0.48px",
                }}
              >
                {t("landing.hero.description") || "Learn, practice, and succeed with trusted teachers. Unlock chapters, track progress, and reach your goals."}
              </p>
            </div>

            {/* Buttons Frame */}
            <div
              className="flex items-center"
              style={{
                gap: "16px",
              }}
            >
              <Button
                state="filled"
                size="M"
                icon_position="none"
                text={t("landing.hero.startLearning") || "Start Learning"}
                onClick={handleStartLearning}
                optionalStyles="whitespace-nowrap min-w-fit"
              />

              <Button
                state="outlined"
                size="M"
                icon_position="none"
                text={t("landing.hero.exploreModules") || "Explore Modules"}
                onClick={handleExploreModules}
                optionalStyles="whitespace-nowrap min-w-fit"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}