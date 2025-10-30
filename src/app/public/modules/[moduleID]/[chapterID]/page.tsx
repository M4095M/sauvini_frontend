"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import DropDown from "@/components/input/dropDown";
import LessonCard from "@/components/modules/LessonCard";
import { useLanguage } from "@/context/LanguageContext";
import { ChaptersApi, type FrontendChapter } from "@/api/chapters";
import { ModulesApi, type FrontendModule } from "@/api/modules";
import { Lesson } from "@/types/modules";
import Loader from "@/components/ui/Loader";
import { getLessonsByChapter, type LessonWithRelations } from "@/api/lesson";

export default function LessonsPage() {
  const { isRTL, t, language } = useLanguage();
  const params = useParams();
  const moduleId = params.moduleID as string;
  const chapterId = params.chapterID as string;

  const [module, setModule] = useState<FrontendModule | null>(null);
  const [chapter, setChapter] = useState<FrontendChapter | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch module data
        const moduleResponse = await ModulesApi.getModuleById(moduleId);
        if (!moduleResponse.success || !moduleResponse.data) {
          throw new Error("Module not found");
        }
        const moduleData = ModulesApi.transformModule(moduleResponse.data);
        setModule(moduleData);

        // Fetch chapter data - prepend Chapter: prefix for SurrealDB RecordId format
        const fullChapterId = chapterId.includes(":")
          ? chapterId
          : `Chapter:${chapterId}`;
        const chapterResponse = await ChaptersApi.getChapterById(fullChapterId);
        if (!chapterResponse.success || !chapterResponse.data) {
          throw new Error("Chapter not found");
        }
        const chapterData = ChaptersApi.transformChapter(chapterResponse.data);
        setChapter(chapterData);

        // Fetch lessons for this chapter using the real API
        try {
          const lessonsData = await getLessonsByChapter(chapterId);
          // Transform backend lessons to frontend format
          const transformedLessons: Lesson[] = lessonsData.map(
            (lesson: LessonWithRelations, index: number) => ({
              id: lesson.id || `lesson-${index}`,
              title: lesson.title,
              description: lesson.description,
              duration: lesson.duration,
              order: lesson.order,
              videoUrl: lesson.video_url,
              pdfUrl: lesson.pdf_url,
              image: lesson.image,
              isCompleted: false, // TODO: Get from progress API
              canAccess: true, // TODO: Implement access control
            })
          );
          setLessons(transformedLessons);
        } catch (lessonError) {
          console.error("Error fetching lessons:", lessonError);
          // Don't fail the whole page if lessons fail, just show empty
          setLessons([]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load chapter. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (moduleId && chapterId) {
      fetchData();
    }
  }, [moduleId, chapterId]);

  if (loading) {
    return (
      <div className="px-3 py-6 rounded-[52px] bg-neutral-100 flex flex-col">
        <div className="font-medium text-neutral-600 text-2xl px-4">
          {chapter?.title || "Chapter"}
        </div>
        <div className="flex justify-center items-center py-8">
          <Loader label="Loading chapter..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-3 py-6 rounded-[52px] bg-neutral-100 flex flex-col">
        <div className="font-medium text-neutral-600 text-2xl px-4">
          {chapter?.title || "Chapter"}
        </div>
        <div className="flex justify-center items-center py-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 py-6 rounded-[52px] bg-neutral-100 flex flex-col">
      {/* header */}
      <div className="font-medium text-neutral-600 text-2xl px-4">
        {chapter?.title || "Chapter"}
      </div>
      {/* main content */}
      <div className="flex flex-col gap-6">
        {/* filter */}
        <div className="w-fit">
          <DropDown placeholder={t("public.AcademicStream")} />
        </div>
        {/* grid */}
        <div className="flex flex-col gap-7">
          {lessons.length > 0 ? (
            lessons.map((lesson, index) => {
              return (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  lessonNumber={index + 1}
                />
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              No lessons available yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
