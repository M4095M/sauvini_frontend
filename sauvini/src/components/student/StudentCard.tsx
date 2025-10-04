"use client";

import Image from "next/image";
import { BookOpen, FileText, Clock } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import type { UserProfile } from "@/types/modules";

import { Student } from "@/api";
import { useEffect } from "react";


interface Props {
  user: Student;
  className?: string;
}

function LevelBadge({ level, isRTL }: { level: number; isRTL?: boolean }) {
  return (
    <div
      aria-hidden
      className={`absolute -top-2 sm:-top-3 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white rounded-full border border-neutral-200 shadow-sm ${isRTL ? "-left-3 sm:-left-4" : "-right-3 sm:-right-4"}`}
    >
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 2l6 3v5c0 5-3 9-6 11-3-2-6-6-6-11V5l6-3z" fill="var(--primary-300)" />
      </svg>
      <span className="absolute text-[10px] sm:text-[11px] font-semibold text-white" style={{ transform: "translateY(-1px)" }}>
        {level}
      </span>
    </div>
  );
}

function Stat({ icon, value, label, isRTL }: { icon: React.ReactNode; value: number | string; label: string; isRTL?: boolean }) {
  return (
    <div className={`flex items-center gap-2 sm:gap-4 ${isRTL ? "flex-row-reverse" : "flex-row"} min-w-[120px] sm:min-w-[160px]`}>
      <div
        className="flex items-center justify-center p-3 sm:p-4"
        style={{
          borderRadius: 12,
          background: "var(--Component-Hover-Secondary-Blue, rgba(163, 186, 214, 0.08))",
          boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.09)",
        }}
        aria-hidden
      >
        {icon}
      </div>

      <div className={`flex flex-col ${isRTL ? "items-end" : "items-start"}`}>
        <div className="font-semibold text-base sm:text-lg" style={{ color: "var(--primary-300)" }}>{value}</div>
        <div className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400">{label}</div>
      </div>
    </div>
  );
}


export default function StudentCard({ user, className = "" }: Props) {
  const url_prefix = process.env.NEXT_PUBLIC_IMAGES_PREFIX

  useEffect(() => {
    console.log("user in student card: ", url_prefix)
  })

  const { isRTL } = useLanguage();

  console.log(`${url_prefix}${user.profile_picture_path}`)

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={`w-full min-h-[280px] sm:min-h-[320px] lg:h-[342px] flex flex-col sm:flex-row items-center rounded-[32px] sm:rounded-[48px] lg:rounded-[56px] border-[3px] sm:border-[4px] lg:border-[5px] border-[var(--BASE-Primary-100,#A3BAD6)] bg-[var(--Surface-Level-2,#F8F8F8)] dark:bg-[#1A1A1A] overflow-hidden relative p-4 sm:p-0 ${className}`}
      role="region"
      aria-label={`${user.first_name} profile card`}
    >
      {/* Profile Picture - Top on mobile, side on desktop */}
      {!isRTL && (
        <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-[232px] lg:h-[232px] sm:ml-4 lg:ml-8 rounded-[32px] sm:rounded-[40px] lg:rounded-[48px] overflow-hidden flex-shrink-0 bg-neutral-200 dark:bg-neutral-800">
          {
            user.profile_picture_path && 
             (<Image src={`${url_prefix}${user.profile_picture_path}`} alt={user.first_name} width={232} height={232} className="w-full h-full object-cover" />)
          }
        </div>
      )}

      <div className={`flex-1 w-full sm:h-[232px] flex flex-col justify-start py-4 sm:py-6 px-2 sm:px-4 lg:px-8 relative ${isRTL ? "items-end sm:items-end" : "items-start"}`}>
        <div className="w-full text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white leading-tight">{user.first_name} {user.last_name ?? ""}</h2>
          <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">{user.academic_stream ?? "Academic Stream"}</div>
        </div>

        {/* <div className="mt-4 sm:mt-6 w-full">
          <div className="relative">
            <div className="h-2 sm:h-3 rounded-full bg-neutral-200 dark:bg-gray-800 overflow-hidden">
              <div className="h-2 sm:h-3" style={{ width: `${(user as any).xp || 0}%`, background: "var(--primary-300)" }} aria-hidden />
            </div>

            <LevelBadge level={(user as any).level ?? 1} isRTL={isRTL} />
          </div>

          <div className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400">{((user as any).xp ?? 0)}/100 XP</div>
        </div> */}

        <div className="mt-4 sm:mt-6 flex items-center gap-3 sm:gap-6 lg:gap-8 w-full flex-wrap justify-center sm:justify-start">
          <Stat icon={<BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-600 dark:text-neutral-200" />} value={(user as any).chaptersCompleted ?? 0} label="Chapter Completed" isRTL={isRTL} />
          <Stat icon={<FileText className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-600 dark:text-neutral-200" />} value={(user as any).lessonsCompleted ?? 0} label="Lesson Completed" isRTL={isRTL} />
          <Stat icon={<Clock className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-600 dark:text-neutral-200" />} value={(user as any).lessonsLeft ?? 0} label="Lesson Left" isRTL={isRTL} />
        </div>
      </div>

      {/* RTL Profile Picture */}
      {isRTL && (
        <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-[232px] lg:h-[232px] sm:mr-4 lg:mr-8 rounded-[32px] sm:rounded-[40px] lg:rounded-[48px] overflow-hidden flex-shrink-0 bg-neutral-200 dark:bg-neutral-800">
          {
            user.profile_picture_path && 
             (<Image src={`${url_prefix}${user.profile_picture_path}`} alt={user.first_name} width={232} height={232} className="w-full h-full object-cover" />)
          }        </div>
      )}
    </div>
  );
}