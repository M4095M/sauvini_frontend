"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import Button from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ForWhomProps {
  students: {
    title: string;
    desc: string;
  };
  professors: {
    title: string;
    desc: string;
  };
}

export default function ForWhom({ students, professors }: ForWhomProps) {
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState<"students" | "professors">(
    "students"
  );

  const currentContent = activeTab === "students" ? students : professors;
  const router = useRouter();

  return (
    <section
      className="w-full overflow-hidden min-h-[600px] md:min-h-[750px] lg:h-[866px] py-8 md:py-12 lg:py-0"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full h-full relative">
        {/* Tab Buttons */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 flex">
          {/* Students Tab */}
          <motion.button
            onClick={() => setActiveTab("students")}
            className="flex justify-center items-center transition-all duration-300 w-32 sm:w-40 md:w-[150px] lg:w-[187px] h-12 md:h-14 lg:h-[56px] rounded-t-3xl md:rounded-t-[28px] text-sm sm:text-base md:text-[15px] lg:text-base font-medium"
            style={{
              background:
                activeTab === "students"
                  ? "var(--primary-300, #324C72)"
                  : "var(--neutral-100, #EAEAEA)",
              filter:
                activeTab === "students"
                  ? "drop-shadow(4px -4px 5px rgba(0, 0, 0, 0.25))"
                  : "none",
              color:
                activeTab === "students"
                  ? "var(--neutral-100, #F8F8F8)"
                  : "var(--neutral-500, #7C7C7C)",
              border: "none",
              cursor: "pointer",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {t("landing.for.forStudents") || "For Students"}
          </motion.button>

          {/* Professors Tab */}
          <motion.button
            onClick={() => setActiveTab("professors")}
            className="flex justify-center items-center transition-all duration-300 w-32 sm:w-40 md:w-[150px] lg:w-[187px] h-12 md:h-14 lg:h-[56px] rounded-t-3xl md:rounded-t-[28px] text-sm sm:text-base md:text-[15px] lg:text-base font-medium"
            style={{
              background:
                activeTab === "professors"
                  ? "var(--primary-300, #324C72)"
                  : "var(--neutral-100, #EAEAEA)",
              filter:
                activeTab === "professors"
                  ? "drop-shadow(4px -4px 5px rgba(0, 0, 0, 0.25))"
                  : "none",
              color:
                activeTab === "professors"
                  ? "var(--neutral-100, #F8F8F8)"
                  : "var(--neutral-500, #7C7C7C)",
              border: "none",
              cursor: "pointer",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {t("landing.for.forProfessors") || "For Professors"}
          </motion.button>
        </div>

        {/* Main Content Frame */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="flex justify-center items-center w-full min-h-full pt-16 md:pt-20 lg:pt-0 px-4 sm:px-6 md:px-12 lg:px-[120px] py-8 md:py-12 lg:py-[68px] pb-12 md:pb-16 lg:pb-[132px] rounded-3xl md:rounded-[56px] lg:rounded-[80px]"
          style={{
            background:
              activeTab === "students"
                ? "var(--primary-300, #324C72)"
                : "var(--neutral-100, #EAEAEA)",
          }}
        >
          <div className="flex flex-col lg:flex-row w-full max-w-7xl items-center justify-between gap-8 md:gap-12 lg:gap-16">
            {/* Content Section */}
            <div className="flex flex-col items-start w-full lg:w-[491px] gap-6 md:gap-10 lg:gap-[66px]">
              {/* Title and Description */}
              <div className="flex flex-col items-start self-stretch gap-4 md:gap-6 lg:gap-[36px]">
                {/* Title */}
                <h2
                  className="self-stretch font-bold transition-colors duration-200 text-3xl sm:text-4xl md:text-5xl lg:text-[96px] leading-tight md:leading-normal"
                  style={{
                    color:
                      activeTab === "students"
                        ? "var(--neutral-100, #F8F8F8)"
                        : "var(--neutral-600, #1A1A1A)",
                    fontWeight: 700,
                    letterSpacing: "-0.96px",
                  }}
                >
                  {currentContent.title}
                </h2>

                {/* Description */}
                <p
                  className="self-stretch font-medium transition-colors duration-200 text-base sm:text-lg md:text-xl lg:text-[24px] leading-6 md:leading-7 lg:leading-[36px]"
                  style={{
                    color:
                      activeTab === "students"
                        ? "var(--neutral-300, #BDBDBD)"
                        : "var(--neutral-400, #7C7C7C)",
                    fontWeight: 500,
                    letterSpacing: "-0.24px",
                  }}
                >
                  {currentContent.desc}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center self-start w-full sm:w-auto gap-3 sm:gap-4">
                {activeTab === "students" ? (
                  <>
                    <button
                      onClick={() => router.push("/modules")}
                      className="flex justify-center items-center transition-all duration-200 hover:scale-105 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl md:rounded-[28px] text-sm sm:text-base font-semibold whitespace-nowrap w-full sm:w-auto"
                      style={{
                        background: "var(--Button-Bg-Tonal-Blue, #F8F8F8)",
                        color: "var(--primary-300, #324C72)",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {t("landing.hero.exploreModules") || "Explore Modules"}
                    </button>
                    <button
                      onClick={() => router.push("/register")}
                      className="flex justify-center items-center transition-all duration-200 hover:scale-105 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl md:rounded-[28px] text-sm sm:text-base font-semibold whitespace-nowrap w-full sm:w-auto"
                      style={{
                        background: "var(--neutral-100, #F8F8F8)",
                        color: "var(--primary-300, #324C72)",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {t("landing.hero.startLearning") || "Start Learning"}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => router.push("/register")}
                    className="flex justify-center items-center transition-all duration-200 hover:scale-105 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl md:rounded-[28px] text-sm sm:text-base font-semibold whitespace-nowrap w-full sm:w-auto"
                    style={{
                      background: "var(--primary-300, #324C72)",
                      color: "var(--neutral-100, #F8F8F8)",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {t("landing.for.applyNow") || "Apply as Professor"}
                  </button>
                )}
              </div>
            </div>

            {/* Image Section */}
            <div className="flex-1 flex justify-center items-center w-full lg:w-auto order-first lg:order-none">
              <motion.div
                key={`${activeTab}-image`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-none"
              >
                <Image
                  src={
                    activeTab === "students"
                      ? "/happy-students.svg"
                      : "/teacher-student.svg"
                  }
                  alt={
                    activeTab === "students"
                      ? "Happy students learning"
                      : "Professor teaching"
                  }
                  width={600}
                  height={400}
                  className="object-contain w-full h-auto"
                  priority
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
