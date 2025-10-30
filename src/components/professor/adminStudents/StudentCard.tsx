"use client";

import Image from "next/image";
import { BookOpen, FileText, Clock } from "lucide-react";
import { Student } from "@/data/students";
import { useLanguage } from "@/hooks/useLanguage";

interface StudentCardProps {
  student: Student;
  className?: string;
}

function LevelBadge({ level, isRTL }: { level: number; isRTL?: boolean }) {
  return (
    <div
      aria-hidden
      className={`absolute -top-3 w-10 h-10 flex items-center justify-center bg-white rounded-full border border-neutral-200 shadow-sm ${
        isRTL ? "-left-4" : "-right-4"
      }`}
    >
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 2l6 3v5c0 5-3 9-6 11-3-2-6-6-6-11V5l6-3z"
          fill="var(--primary-300)"
        />
      </svg>
      <span
        className="absolute text-[11px] font-semibold text-white"
        style={{ transform: "translateY(-1px)" }}
      >
        {level}
      </span>
    </div>
  );
}

function Stat({
  icon,
  value,
  label,
  isRTL,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  isRTL?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-5 ${
        isRTL ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Icon box */}
      <div
        className="flex items-center justify-center"
        style={{
          padding: 18,
          borderRadius: 14,
          background:
            "var(--Component-Hover-Secondary-Blue, rgba(163, 186, 214, 0.08))",
          boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.09)",
        }}
        aria-hidden
      >
        {icon}
      </div>

      {/* Number + label */}
      <div
        className={`flex flex-col ${
          isRTL ? "items-end" : "items-start"
        } flex-1`}
      >
        <div
          className="font-semibold text-xl"
          style={{ color: "var(--primary-300)" }}
        >
          {value}
        </div>
        <div className="text-sm text-neutral-500 dark:text-neutral-400">
          {label}
        </div>
      </div>
    </div>
  );
}

export default function StudentCard({
  student,
  className = "",
}: StudentCardProps) {
  const { isRTL } = useLanguage();
  const xp = Math.max(0, Math.min(100, student.xp ?? 0));

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={`w-full max-w-[1176px] mx-auto min-h-[342px] flex flex-col md:flex-row items-center rounded-[56px] border-4 md:border-[5px] border-[var(--BASE-Primary-100,#A3BAD6)] bg-[var(--Surface-Level-2,#F8F8F8)] dark:bg-[#1A1A1A] overflow-hidden relative p-6 md:p-0 gap-6 md:gap-0 ${className}`}
      role="region"
      aria-label={`${student.name} card`}
    >
      {/* Profile Picture - LTR */}
      {!isRTL && (
        <div className="inline-flex items-center justify-center w-[160px] h-[160px] md:w-[232px] md:h-[232px] md:ml-12 rounded-[32px] md:rounded-[48px] overflow-hidden flex-shrink-0 bg-neutral-200 dark:bg-neutral-800">
          <Image
            src={student.profile_picture ?? "/placeholder.svg"}
            alt={student.name}
            width={232}
            height={232}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Student Info */}
      <div
        className={`flex-1 min-w-0 flex flex-col justify-center py-6 md:py-8 md:mx-12 relative ${
          isRTL ? "items-end" : "items-start"
        }`}
      >
        <div className="w-full min-w-0">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white leading-tight truncate">
            {student.name}
          </h2>
          <div className="mt-3 text-base md:text-lg text-neutral-500 dark:text-neutral-400 truncate">
            {student.academic_stream ?? "Academic Stream"}
          </div>
        </div>

        {/* XP bar */}
        <div className="mt-6 md:mt-8 w-full min-w-0">
          <div className="relative">
            <div className="h-4 rounded-full bg-neutral-200 dark:bg-gray-800 overflow-hidden">
              <div
                className="h-4"
                style={{ width: `${xp}%`, background: "var(--primary-300)" }}
                aria-hidden
              />
            </div>

            {/* level badge */}
            <LevelBadge level={4} isRTL={isRTL} />
          </div>

          <div className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
            {xp}/100 XP
          </div>
        </div>

        {/* Stats - Responsive Wrapping */}
        <div className="mt-6 md:mt-8 flex flex-wrap items-center gap-6 md:gap-10">
          <Stat
            isRTL={isRTL}
            icon={
              <BookOpen className="w-5 h-5 text-neutral-600 dark:text-neutral-200" />
            }
            value={student.chaptersCompleted ?? 0}
            label="Chapter Completed"
          />
          <Stat
            isRTL={isRTL}
            icon={
              <FileText className="w-5 h-5 text-neutral-600 dark:text-neutral-200" />
            }
            value={student.lessonsCompleted ?? 0}
            label="Lesson Completed"
          />
          <Stat
            isRTL={isRTL}
            icon={
              <Clock className="w-5 h-5 text-neutral-600 dark:text-neutral-200" />
            }
            value={student.lessonsLeft ?? 0}
            label="Lesson Left"
          />
        </div>
      </div>

      {/* Profile Picture - RTL */}
      {isRTL && (
        <div className="inline-flex items-center justify-center w-[160px] h-[160px] md:w-[232px] md:h-[232px] md:mr-12 rounded-[32px] md:rounded-[48px] overflow-hidden flex-shrink-0 bg-neutral-200 dark:bg-neutral-800">
          <Image
            src={student.profile_picture ?? "/placeholder.svg"}
            alt={student.name}
            width={232}
            height={232}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
