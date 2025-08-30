"use client";

import Image from "next/image";
import { BookOpen, FileText, Clock } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import type { UserProfile } from "@/types/modules";

interface Props {
  user: UserProfile;
  className?: string;
}

function LevelBadge({ level, isRTL }: { level: number; isRTL?: boolean }) {
  return (
    <div
      aria-hidden
      className={`absolute -top-3 w-10 h-10 flex items-center justify-center bg-white rounded-full border border-neutral-200 shadow-sm ${isRTL ? "-left-4" : "-right-4"}`}
    >
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 2l6 3v5c0 5-3 9-6 11-3-2-6-6-6-11V5l6-3z" fill="var(--primary-300)" />
      </svg>
      <span className="absolute text-[11px] font-semibold text-white" style={{ transform: "translateY(-1px)" }}>
        {level}
      </span>
    </div>
  );
}

function Stat({ icon, value, label, isRTL }: { icon: React.ReactNode; value: number | string; label: string; isRTL?: boolean }) {
  return (
    <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : "flex-row"} min-w-[160px]`}>
      <div
        className="flex items-center justify-center"
        style={{
          padding: 16,
          borderRadius: 12,
          background: "var(--Component-Hover-Secondary-Blue, rgba(163, 186, 214, 0.08))",
          boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.09)",
        }}
        aria-hidden
      >
        {icon}
      </div>

      <div className={`flex flex-col ${isRTL ? "items-end" : "items-start"}`}>
        <div className="font-semibold text-lg" style={{ color: "var(--primary-300)" }}>{value}</div>
        <div className="text-xs text-neutral-500 dark:text-neutral-400">{label}</div>
      </div>
    </div>
  );
}

export default function StudentCard({ user, className = "" }: Props) {
  const { isRTL } = useLanguage();

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={`w-full h-[342px] flex items-center rounded-[56px] border-[5px] border-[var(--BASE-Primary-100,#A3BAD6)] bg-[var(--Surface-Level-2,#F8F8F8)] dark:bg-[#1A1A1A] overflow-hidden relative ${className}`}
      role="region"
      aria-label={`${user.name} profile card`}
    >
      {!isRTL && (
        <div className="ml-8 inline-flex items-center justify-center w-[232px] h-[232px] rounded-[48px] overflow-hidden flex-shrink-0 bg-neutral-200 dark:bg-neutral-800">
          <Image src={user.avatar ?? "/profile.png"} alt={user.name} width={232} height={232} className="w-full h-full object-cover" />
        </div>
      )}

      <div className={`mx-8 flex-1 h-[232px] flex flex-col justify-start py-6 relative ${isRTL ? "items-end" : "items-start"}`}>
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white leading-tight">{user.name} {user.lastname ?? ""}</h2>
          <div className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">{user.academicStream ?? "Academic Stream"}</div>
        </div>

        <div className="mt-6 w-full">
          <div className="relative">
            <div className="h-3 rounded-full bg-neutral-200 dark:bg-gray-800 overflow-hidden">
              <div className="h-3" style={{ width: `${user.xp}%`, background: "var(--primary-300)" }} aria-hidden />
            </div>

            <LevelBadge level={user.level ?? 1} isRTL={isRTL} />
          </div>

          <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">{(user.xp ?? 0)}/100 XP</div>
        </div>

        <div className="mt-6 flex items-center gap-8 w-full flex-wrap">
          <Stat icon={<BookOpen className="w-5 h-5 text-neutral-600 dark:text-neutral-200" />} value={user.chaptersCompleted ?? 0} label="Chapter Completed" isRTL={isRTL} />
          <Stat icon={<FileText className="w-5 h-5 text-neutral-600 dark:text-neutral-200" />} value={user.lessonsCompleted ?? 0} label="Lesson Completed" isRTL={isRTL} />
          <Stat icon={<Clock className="w-5 h-5 text-neutral-600 dark:text-neutral-200" />} value={user.lessonsLeft ?? 0} label="Lesson Left" isRTL={isRTL} />
        </div>
      </div>

      {isRTL && (
        <div className="mr-8 inline-flex items-center justify-center w-[232px] h-[232px] rounded-[48px] overflow-hidden flex-shrink-0 bg-neutral-200 dark:bg-neutral-800">
          <Image src={user.avatar ?? "/profile.png"} alt={user.name} width={232} height={232} className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
}