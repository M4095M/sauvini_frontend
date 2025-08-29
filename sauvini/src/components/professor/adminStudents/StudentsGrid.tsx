"use client";

import { useMemo, useState, useEffect } from "react";
import Button from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/tables/data-table";
import { student_columns } from "@/components/tables/students/students_columns";
import { Student } from "@/data/students";

interface StudentsGridProps {
  students?: Student[];
  initialPageSize?: number;
  className?: string;
}

export default function StudentsGrid({
  students = [],
  initialPageSize = 10,
  className = "",
}: StudentsGridProps) {
  const { t, isRTL } = useLanguage();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState<number>(initialPageSize ?? 10);
  const [page, setPage] = useState<number>(1);
  const [openMenuFor, setOpenMenuFor] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) =>
      (
        (s.name ?? "") +
        " " +
        (s.email ?? "") +
        " " +
        (s.phone ?? "")
      )
        .toLowerCase()
        .includes(q)
    );
  }, [students, query]);

  const total = filtered.length;
  const safePageSize = Math.max(1, pageSize || 1);
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));
  useEffect(() => {
    if (page > totalPages) setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  const start = (page - 1) * safePageSize;
  const visible = filtered.slice(start, start + safePageSize);

  const toggleMenu = (id: string) => setOpenMenuFor((p) => (p === id ? null : id));
  const menuPositionStyle = isRTL ? { left: 0 } : { right: 0 };

  const columns = student_columns(toggleMenu, openMenuFor, menuPositionStyle, setOpenMenuFor, router, t);

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={`w-full ${className}`}>
      {/* Panel (fills page container width) */}
      <div className="w-full bg-neutral-100 dark:bg-[#1A1A1A] rounded-[52px] p-6 flex flex-col gap-4">
        {/* Title */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-neutral-800 dark:text-white">
            {t("admin.manageStudents.title") ?? "Students"}
          </h2>
        </div>

        {/* Search + per-page (under title) */}
        <div className="mt-2 flex items-center gap-4 w-full">
          <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-2 flex-1">
            <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input
              aria-label={t("common.search") ?? "Search"}
              className="ml-3 w-full bg-transparent text-sm text-neutral-700 dark:text-neutral-200 outline-none"
              placeholder={t("admin.manageStudents.searchPlaceholder") ?? "Search students..."}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <select
            aria-label={t("common.show") ?? "Show"}
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-2 text-sm"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {(() => {
                  const tpl = t("common.showCount");
                  return tpl ? tpl.replace(/\{count\}/g, String(n)) : `Show: ${n}`;
                })()}
              </option>
            ))}
          </select>
        </div>

        {/* Header separators (optional) */}
        <div className="w-full border-t border-transparent" />

        {/* Rows list */}
        <div className="flex flex-col gap-3">
          <DataTable columns={columns} data={visible} />
        </div>
      </div>
    </div>
  );
}