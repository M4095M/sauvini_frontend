"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useLanguage } from "@/hooks/useLanguage"
import Button from "@/components/ui/button"

interface ForWhomProps {
  students: {
    title: string
    desc: string
  }
  professors: {
    title: string
    desc: string
  }
}

export default function ForWhom({ students, professors }: ForWhomProps) {
  const { t, isRTL } = useLanguage()
  const [activeTab, setActiveTab] = useState<'students' | 'professors'>('students')

  const currentContent = activeTab === 'students' ? students : professors

  return (
    <section
      className="w-full overflow-hidden"
      style={{
        height: "866px",
        flexShrink: 0,
      }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full h-full relative">
        {/* Tab Buttons */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 flex">
          {/* Students Tab */}
          <motion.button
            onClick={() => setActiveTab('students')}
            className="flex justify-center items-center transition-all duration-300"
            style={{
              width: "187px",
              height: "56px",
              borderRadius: "28px 28px 0 0",
              background: activeTab === 'students' 
                ? "var(--primary-300, #324C72)" 
                : "var(--neutral-100, #EAEAEA)",
              filter: activeTab === 'students' 
                ? "drop-shadow(4px -4px 5px rgba(0, 0, 0, 0.25))" 
                : "none",
              color: activeTab === 'students' 
                ? "var(--neutral-100, #F8F8F8)" 
                : "var(--neutral-500, #7C7C7C)",
              fontSize: "16px",
              fontWeight: 500,
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
            onClick={() => setActiveTab('professors')}
            className="flex justify-center items-center transition-all duration-300"
            style={{
              width: "187px",
              height: "56px",
              borderRadius: "28px 28px 0 0",
              background: activeTab === 'professors' 
                ? "var(--primary-300, #324C72)" 
                : "var(--neutral-100, #EAEAEA)",
              filter: activeTab === 'professors' 
                ? "drop-shadow(4px -4px 5px rgba(0, 0, 0, 0.25))" 
                : "none",
              color: activeTab === 'professors' 
                ? "var(--neutral-100, #F8F8F8)" 
                : "var(--neutral-500, #7C7C7C)",
              fontSize: "16px",
              fontWeight: 500,
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
          className="flex justify-center items-center w-full"
          style={{
            padding: "68px 120px 132.434px 120px",
            borderRadius: "80px",
            background: activeTab === 'students' 
              ? "var(--primary-300, #324C72)" 
              : "var(--neutral-100, #EAEAEA)",
            height: "100%",
          }}
        >
          <div className="flex w-full max-w-7xl items-center justify-between gap-16">
            {/* Content Section */}
            <div
              className="flex flex-col items-start"
              style={{
                width: "491px",
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
                <h2
                  className="self-stretch font-bold transition-colors duration-200"
                  style={{
                    color: activeTab === 'students' 
                      ? "var(--neutral-100, #F8F8F8)" 
                      : "var(--neutral-600, #1A1A1A)",
                    fontSize: "96px",
                    fontWeight: 700,
                    lineHeight: "normal",
                    letterSpacing: "-1.92px",
                  }}
                >
                  {currentContent.title}
                </h2>

                {/* Description */}
                <p
                  className="self-stretch font-medium transition-colors duration-200"
                  style={{
                    color: activeTab === 'students' 
                      ? "var(--neutral-300, #BDBDBD)" 
                      : "var(--neutral-400, #7C7C7C)",
                    fontSize: "24px",
                    fontWeight: 500,
                    lineHeight: "36px",
                    letterSpacing: "-0.48px",
                  }}
                >
                  {currentContent.desc}
                </p>
              </div>

              {/* Action Buttons */}
              <div
                className="flex items-center self-start"
                style={{
                  gap: "16px",
                }}
              >
                {activeTab === 'students' ? (
                  <>
                    <button
                      className="flex justify-center items-center transition-all duration-200 hover:scale-105"
                      style={{
                        padding: "16px 24px",
                        borderRadius: "28px",
                        background: "var(--Button-Bg-Tonal-Blue, #F8F8F8)",
                        color: "var(--primary-300, #324C72)",
                        fontSize: "16px",
                        fontWeight: 600,
                        border: "none",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        minWidth: "fit-content",
                      }}
                    >
                      {t("landing.hero.exploreModules") || "Explore Modules"}
                    </button>
                    <button
                      className="flex justify-center items-center transition-all duration-200 hover:scale-105"
                      style={{
                        padding: "16px 24px",
                        borderRadius: "28px",
                        background: "var(--neutral-100, #F8F8F8)",
                        color: "var(--primary-300, #324C72)",
                        fontSize: "16px",
                        fontWeight: 600,
                        border: "none",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        minWidth: "fit-content",
                      }}
                    >
                      {t("landing.hero.startLearning") || "Start Learning"}
                    </button>
                  </>
                ) : (
                  <button
                    className="flex justify-center items-center transition-all duration-200 hover:scale-105"
                    style={{
                      padding: "16px 24px",
                      borderRadius: "28px",
                      background: "var(--primary-300, #324C72)",
                      color: "var(--neutral-100, #F8F8F8)",
                      fontSize: "16px",
                      fontWeight: 600,
                      border: "none",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      minWidth: "fit-content",
                    }}
                  >
                    {t("landing.for.applyNow") || "Apply as Professor"}
                  </button>
                )}
              </div>
            </div>

            {/* Image Section */}
            <div className="flex-1 flex justify-center items-center">
              <motion.div
                key={`${activeTab}-image`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative"
              >
                <Image
                  src={activeTab === 'students' ? "/happy-students.svg" : "/teacher-student.svg"}
                  alt={activeTab === 'students' ? "Happy students learning" : "Professor teaching"}
                  width={600}
                  height={400}
                  className="object-contain max-w-full h-auto"
                  priority
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}