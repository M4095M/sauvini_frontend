"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "@/hooks/useLanguage";
import { RTL_LANGUAGES } from "@/lib/language";

export default function AboutSauvini() {
  const { t, language } = useLanguage();
  const isRTL = RTL_LANGUAGES.includes(language);

  return (
    <section className="py-8 md:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Card Container */}
        <div className="bg-[var(--Surface-Level-2,#F8F8F8)] dark:bg-[#1A1A1A] rounded-3xl md:rounded-[56px] lg:rounded-[80px] p-6 sm:p-8 md:p-12 lg:p-16">
          {/* About Sauvini Section */}
          <div className="text-center mb-12 md:mb-16 lg:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
              {t("landing.about.title") || "About Sauvini"}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 md:mb-8">
              {t("landing.about.subtitle") || "Our Story"}
            </p>
            <div className="max-w-4xl mx-auto">
              <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4 md:mb-6">
                {t("landing.about.story") ||
                  "This platform was founded by a Natural Sciences teacher who has spent many years guiding BAC students toward success. Teaching, for him, was never just a profession—it was a mission. His greatest passion was seeing his students understand, grow, and achieve their goals in the final exam. Over time, however, he went through a period of illness and exhaustion. It was during this difficult time that a profound question came to mind:"}
              </p>
              <p className="text-base sm:text-lg md:text-xl font-bold italic text-gray-800 dark:text-gray-200">
                {t("landing.about.question") ||
                  "What will happen to my students if I can't be there to teach them?"}
              </p>
            </div>
          </div>

          {/* The Turning Point Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center mb-12 md:mb-16 lg:mb-20">
            <div className={`${isRTL ? "lg:order-2" : "lg:order-1"}`}>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
                {t("landing.about.turningPoint.title") || "The turning point"}
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {t("landing.about.turningPoint.description") ||
                  "That question marked a turning point in his journey as an educator. He realized that students needed a reliable source of knowledge that went beyond his presence in the classroom. From this came the idea of a digital space—a place where lessons live on, accessible anytime, ensuring that learning continues without interruption and giving students the freedom to study with confidence."}
              </p>
            </div>
            <div
              className={`${
                isRTL ? "lg:order-1" : "lg:order-2"
              } flex justify-center order-first lg:order-none`}
            >
              <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:w-80 lg:max-w-none aspect-square">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-full flex items-center justify-center">
                  <div className="flex-shrink-0 w-full max-w-[200px] sm:max-w-[240px] md:max-w-[280px] lg:max-w-[340px] xl:max-w-[400px] lg:w-[592px] h-auto aspect-[592/527]">
                    <Image
                      src="/rafiki.svg"
                      alt={
                        t("landing.hero.imageAlt") ||
                        "Students learning and achieving their goals"
                      }
                      width={592}
                      height={527}
                      className="w-full h-full object-contain pt-2 md:pt-4 lg:pt-6"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
