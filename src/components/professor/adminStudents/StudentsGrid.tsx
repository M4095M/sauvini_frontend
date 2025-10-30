"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DataTable } from "@/components/tables/data-table";
import { student_columns } from "@/components/tables/students/students_columns";
import Button from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import Loader from "@/components/ui/Loader";
import { StudentManagementApi } from "@/api/studentManagement";
import type { FrontendStudent } from "@/types/students";
import { mapApiStudentToFrontend } from "@/types/students";

interface StudentsGridProps {
  initialPageSize?: number;
  className?: string;
}

export default function StudentsGrid({
  initialPageSize = 10,
  className = "",
}: StudentsGridProps) {
  const { t, isRTL } = useLanguage();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState<number>(initialPageSize ?? 10);
  const [page, setPage] = useState<number>(1);
  const [openMenuFor, setOpenMenuFor] = useState<string | null>(null);

  // API state
  const [students, setStudents] = useState<FrontendStudent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Fetch students from API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await StudentManagementApi.getAllStudents({
          page,
          per_page: pageSize,
          search: query || undefined,
        });

        if (response.success && response.data) {
          const frontendStudents = response.data.students.map(
            mapApiStudentToFrontend
          );
          setStudents(frontendStudents);
          setTotal(response.data.total);
          setTotalPages(response.data.total_pages);
        } else {
          setError(response.message || "Failed to fetch students");
        }
      } catch (err) {
        console.error("Error fetching students:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [page, pageSize, query]);

  const filtered = useMemo(() => students, [students]);
  const visible = filtered;

  const toggleMenu = (id: string) =>
    setOpenMenuFor((p) => (p === id ? null : id));
  const menuPositionStyle = isRTL ? { left: 0 } : { right: 0 };

  const columns = student_columns(
    toggleMenu,
    openMenuFor,
    menuPositionStyle,
    setOpenMenuFor,
    router,
    t
  );

  const prevIcon = isRTL ? <ChevronRight /> : <ChevronLeft />;
  const nextIcon = isRTL ? <ChevronLeft /> : <ChevronRight />;

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={`w-full ${className} flex flex-col min-h-[520px]`}
    >
      {/* Panel */}
      <div className="w-full bg-neutral-100 dark:bg-[#1A1A1A] rounded-[52px] p-6 flex flex-col gap-4 flex-grow">
        {/* Title */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-neutral-800 dark:text-white">
            {t("admin.manageStudents.title") ?? "Students"}
          </h2>
        </div>

        {/* Error display */}
        {error && (
          <div className="bg-error-100 text-error-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Search + per-page */}
        <div className="mt-2 flex items-center gap-4 w-full">
          <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-2 flex-1">
            <svg
              className="w-4 h-4 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M21 21l-4.35-4.35"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="11"
                cy="11"
                r="6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              aria-label={t("common.search") ?? "Search"}
              className="ml-3 w-full bg-transparent text-sm text-neutral-700 dark:text-neutral-200 outline-none"
              placeholder={
                t("admin.manageStudents.searchPlaceholder") ??
                "Search students..."
              }
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
                  return tpl
                    ? tpl.replace(/\{count\}/g, String(n))
                    : `Show: ${n}`;
                })()}
              </option>
            ))}
          </select>
        </div>

        {/* Header separators */}
        <div className="w-full border-t border-transparent" />

        {/* Rows list */}
        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader />
            </div>
          ) : (
            <DataTable columns={columns} data={visible} />
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="w-full flex justify-center items-center mt-4">
        <div className="rounded-full w-fit bg-white btn-elevation-1 px-4 py-2 flex flex-row gap-7 items-center dark:bg-[#0B0B0B]">
          <div>
            <Button
              state={"text"}
              size={"XS"}
              icon_position={"icon-only"}
              icon={prevIcon}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              optionalStyles="p-1"
            />
          </div>

          <div
            className={`flex items-center gap-5 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            {[...Array(totalPages)].map((_, i) => {
              if (i > page + 4 || i < page - 5) {
                return <div className="hidden" key={i} />;
              }

              if (i === page + 4 || i === page - 5) {
                return (
                  <div
                    className="text-neutral-400 dark:text-neutral-500"
                    key={i}
                  >
                    ...
                  </div>
                );
              }

              return (
                <div
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-7 aspect-square rounded-full select-none cursor-pointer flex justify-center items-center ${
                    page === i + 1
                      ? "bg-primary-100 text-primary-600"
                      : "bg-white text-neutral-400 dark:bg-[#111112] dark:text-neutral-500"
                  }`}
                  aria-current={page === i + 1 ? "page" : undefined}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>

          <div>
            <Button
              state={"text"}
              size={"XS"}
              icon_position={"icon-only"}
              icon={nextIcon}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              optionalStyles="p-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
