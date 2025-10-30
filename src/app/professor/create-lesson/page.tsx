"use client";

import { useState, useEffect, useMemo } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import Button from "@/components/ui/button";
import Loader from "@/components/ui/Loader";
import { DataTable } from "@/components/tables/data-table";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import CreateLessonPopup from "./createLessonPopup";
import UpdateLessonPopUp from "./updateLessonPopup";
import ViewLessonPopup from "./viewLessonPopup";
import LessonApi, { type LessonWithRelations } from "@/api/lesson";
import { ChaptersApi } from "@/api/chapters";
import type { Chapter } from "@/api/chapters";

export default function CreateLessonPage() {
  const { t, isRTL, language } = useLanguage();

  // State for lessons
  const [lessons, setLessons] = useState<LessonWithRelations[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Popup states
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [selectedLesson, setSelectedLesson] =
    useState<LessonWithRelations | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter by chapter
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(
    null
  );

  // Fetch chapters on mount
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await ChaptersApi.getAllChapters();
        if (response.success && response.data) {
          setChapters(response.data);
        }
      } catch (err) {
        console.error("Error fetching chapters:", err);
      }
    };

    fetchChapters();
  }, []);

  // Fetch lessons
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        setError(null);

        if (selectedChapterId) {
          const data = await LessonApi.getLessonsByChapter(selectedChapterId);
          setLessons(data);
        } else {
          // Fetch all lessons from all chapters
          const allLessons: LessonWithRelations[] = [];
          for (const chapter of chapters) {
            if (chapter.id) {
              const chapterLessons = await LessonApi.getLessonsByChapter(
                String(chapter.id)
              );
              allLessons.push(...chapterLessons);
            }
          }
          setLessons(allLessons);
        }
      } catch (err) {
        console.error("Error fetching lessons:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch lessons"
        );
      } finally {
        setLoading(false);
      }
    };

    if (chapters.length > 0 || selectedChapterId) {
      fetchLessons();
    } else if (chapters.length === 0 && !selectedChapterId) {
      setLoading(false);
    }
  }, [chapters, selectedChapterId]);

  // Handle create lesson
  const handleCreateLesson = () => {
    window.scrollTo(0, 0);
    document.body.classList.add("no-scroll");
    setShowCreatePopup(true);
  };

  // Handle view lesson
  const handleViewLesson = (lesson: LessonWithRelations) => {
    setSelectedLesson(lesson);
    window.scrollTo(0, 0);
    document.body.classList.add("no-scroll");
    setShowViewPopup(true);
  };

  // Handle update lesson
  const handleUpdateLesson = (lesson: LessonWithRelations) => {
    setSelectedLesson(lesson);
    window.scrollTo(0, 0);
    document.body.classList.add("no-scroll");
    setShowUpdatePopup(true);
  };

  // Handle delete lesson
  const handleDeleteLesson = async (lesson: LessonWithRelations) => {
    if (!lesson.id) return;

    const confirmed = confirm(
      t("professor.lessons.confirmDelete") ||
        "Are you sure you want to delete this lesson?"
    );

    if (!confirmed) return;

    try {
      await LessonApi.deleteLesson(String(lesson.id));
      // Remove from local state
      setLessons((prev) => prev.filter((l) => l.id !== lesson.id));
      alert(
        t("professor.lessons.deleteSuccess") || "Lesson deleted successfully"
      );
    } catch (err) {
      console.error("Error deleting lesson:", err);
      alert(
        t("professor.lessons.deleteError") ||
          "Failed to delete lesson. Please try again."
      );
    }
  };

  // Close popups
  const closePopups = () => {
    document.body.classList.remove("no-scroll");
    setShowCreatePopup(false);
    setShowUpdatePopup(false);
    setShowViewPopup(false);
    setSelectedLesson(null);
  };

  // Refresh lessons after create/update
  const refreshLessons = () => {
    if (selectedChapterId) {
      LessonApi.getLessonsByChapter(selectedChapterId).then(setLessons);
    } else {
      // Refetch all lessons
      const fetchAll = async () => {
        const allLessons: LessonWithRelations[] = [];
        for (const chapter of chapters) {
          if (chapter.id) {
            const chapterLessons = await LessonApi.getLessonsByChapter(
              String(chapter.id)
            );
            allLessons.push(...chapterLessons);
          }
        }
        setLessons(allLessons);
      };
      fetchAll();
    }
  };

  // Pagination
  const total = lessons.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const paginatedLessons = lessons.slice(start, start + pageSize);

  const prevIcon = isRTL ? <ChevronRight /> : <ChevronLeft />;
  const nextIcon = isRTL ? <ChevronLeft /> : <ChevronRight />;

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="w-full flex flex-col gap-6">
      {/* Main panel */}
      <div className="w-full bg-neutral-100 dark:bg-[#1A1A1A] rounded-[52px] py-6 px-4 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-semibold text-neutral-800 dark:text-white">
            {t("professor.lessons.title") ?? "Lessons Management"}
          </h2>
          <Button
            text={t("professor.lessons.createNew") ?? "Create New Lesson"}
            state="filled"
            size="M"
            icon_position="left"
            icon={<Plus />}
            onClick={handleCreateLesson}
          />
        </div>

        {/* Error display */}
        {error && (
          <div className="px-2">
            <div className="bg-error-100 text-error-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          </div>
        )}

        {/* Filter by chapter */}
        <div className="px-2">
          <select
            value={selectedChapterId || "all"}
            onChange={(e) =>
              setSelectedChapterId(
                e.target.value === "all" ? null : e.target.value
              )
            }
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-sm"
          >
            <option value="all">
              {t("common.allChapters") ?? "All Chapters"}
            </option>
            {chapters.map((chapter) => (
              <option key={chapter.id} value={String(chapter.id)}>
                {chapter.title}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full border-t border-transparent px-2" />

        {/* Lessons list */}
        <div className="px-2">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader />
            </div>
          ) : lessons.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              {t("professor.lessons.noLessons") ??
                "No lessons found. Create your first lesson!"}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {paginatedLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-neutral-800 dark:text-white">
                      {lesson.title}
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {lesson.chapter_title} • {lesson.duration} min
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      text={t("common.view") ?? "View"}
                      state="outlined"
                      size="S"
                      icon_position="none"
                      onClick={() => handleViewLesson(lesson)}
                    />
                    <Button
                      text={t("common.edit") ?? "Edit"}
                      state="outlined"
                      size="S"
                      icon_position="none"
                      onClick={() => handleUpdateLesson(lesson)}
                    />
                    <Button
                      text={t("common.delete") ?? "Delete"}
                      state="outlined"
                      size="S"
                      icon_position="none"
                      onClick={() => handleDeleteLesson(lesson)}
                      optionalStyles="!border-error-500 !text-error-500 hover:!bg-error-50"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {!loading && lessons.length > 0 && (
        <div className="w-full flex justify-center items-center">
          <div className="rounded-full w-fit bg-white btn-elevation-1 px-4 py-2 flex flex-row gap-7 items-center dark:bg-[#0B0B0B]">
            <div>
              <Button
                state="text"
                size="XS"
                icon_position="icon-only"
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
                if (i > page + 4 || i < page - 5)
                  return <div className="hidden" key={i} />;
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
                  >
                    {i + 1}
                  </div>
                );
              })}
            </div>

            <div>
              <Button
                state="text"
                size="XS"
                icon_position="icon-only"
                icon={nextIcon}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                optionalStyles="p-1"
              />
            </div>
          </div>
        </div>
      )}

      {/* Create lesson popup */}
      {showCreatePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="m-20 max-w-4xl w-full overflow-y-auto max-h-[90vh]">
            <CreateLessonPopup
              onClose={() => {
                closePopups();
                refreshLessons();
              }}
              t={t}
              language={language}
              chapterId={selectedChapterId || undefined}
              moduleId={undefined} // This page doesn't have moduleId context
            />
          </div>
        </div>
      )}

      {/* Update lesson popup */}
      {showUpdatePopup && selectedLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="m-20 max-w-4xl w-full overflow-y-auto max-h-[90vh]">
            <UpdateLessonPopUp
              lesson={selectedLesson}
              onClose={() => {
                closePopups();
                refreshLessons();
              }}
              t={t}
            />
          </div>
        </div>
      )}

      {/* View lesson popup */}
      {showViewPopup && selectedLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="m-20 max-w-4xl w-full overflow-y-auto max-h-[90vh]">
            <ViewLessonPopup
              lesson={selectedLesson}
              onClose={closePopups}
              t={t}
            />
          </div>
        </div>
      )}
    </div>
  );
}
