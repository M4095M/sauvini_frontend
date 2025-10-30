"use client";

import { useEffect, useState } from "react";
import { useParams, notFound, useRouter } from "next/navigation";
import { MOCK_MODULES_DATA } from "@/data/mockModules";
import LessonApi, { type LessonWithRelations } from "@/api/lesson";
import { ChaptersApi, type FrontendChapter } from "@/api/chapters";
import { ModulesApi, type FrontendModule } from "@/api/modules";
import type { Lesson, Chapter, Module } from "@/types/modules";
import Loader from "@/components/ui/Loader";
import FileAttachement from "@/components/lesson/fileAttachment";
import { SecureFileAccess, SecureVideoPlayer } from "@/components/files";
import LessonHeader from "@/components/lesson/lessonHeader";
import QuestionsSection from "@/components/lesson/questions";
import QuizPopup from "@/components/lesson/quizPopup";
import { useTypography } from "@/hooks/useTypography";
import Button from "@/components/ui/button";
import HeaderTitle from "@/components/lesson/headerTitle";
import { ChevronLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function LessonPage() {
  const params = useParams();
  const lessonId = params.id as string;
  const { getFontClass } = useTypography();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showQuizPopup, setShowQuizPopup] = useState(false);
  const [lessonData, setLessonData] = useState<{
    lesson: Lesson;
    chapter: Chapter;
    mod: Module;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isRTL } = useLanguage();

  // Helper function to extract file ID from URL
  const extractFileId = (url: string | null | undefined): string | null => {
    if (!url) return null;

    // If it's already just a UUID, return it
    if (
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        url
      )
    ) {
      return url;
    }

    // Extract UUID from URL pattern like /files/{uuid}/access
    const match = url.match(
      /\/files\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i
    );
    return match ? match[1] : null;
  };

  // Transform backend lesson to frontend format
  const transformLesson = (backendLesson: LessonWithRelations): Lesson => {
    // Use new video_file_id and pdf_file_id fields, fallback to extracted IDs from URLs
    const videoId =
      backendLesson.video_file_id || extractFileId(backendLesson.video_url);
    const pdfId =
      backendLesson.pdf_file_id || extractFileId(backendLesson.pdf_url);

    return {
      id: backendLesson.id || "",
      title: backendLesson.title,
      description: backendLesson.description,
      image: backendLesson.image || "/placeholder.svg",
      duration: backendLesson.duration,
      isCompleted: backendLesson.progress?.is_completed || false,
      isUnlocked: backendLesson.progress?.is_unlocked ?? true,
      order: backendLesson.order,
      academic_streams: backendLesson.stream_ids?.map((id) => id as any) || [],
      video_url: videoId || undefined,
      pdf_url: pdfId || undefined,
    };
  };

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch lesson data
        const lessonResponse = await LessonApi.getLesson(lessonId);
        if (!lessonResponse.success || !lessonResponse.data) {
          throw new Error("Lesson not found");
        }

        const backendLesson = lessonResponse.data;
        const lesson = transformLesson(backendLesson);

        // Fetch chapter data - ensure proper SurrealDB RecordId format
        const chapterId = backendLesson.chapter_id || "";

        if (!chapterId) {
          // If no chapter_id, create a fallback chapter and module
          console.warn(
            "Lesson does not have a chapter_id, creating fallback data"
          );
          const fallbackChapter: Chapter = {
            id: "unknown",
            title: "Unknown Chapter",
            description: "Chapter information not available",
            image: "/placeholder.svg",
            moduleId: "unknown",
            lessons: [],
            prerequisites: [],
            price: 0,
            isPurchased: false,
            isCompleted: false,
            isUnlocked: true,
            order: 0,
            academicStreams: [],
            totalLessons: 0,
            completedLessons: 0,
          };

          const fallbackModule: Module = {
            id: "unknown",
            name: "Unknown Module",
            description: "Module information not available",
            illustration: "/placeholder.svg",
            color: "blue",
            totalLessons: 0,
            completedLessons: 0,
            isUnlocked: true,
            hasPurchasedChapters: false,
            academicStreams: [],
            chapters: [],
          };

          setLessonData({
            lesson,
            chapter: fallbackChapter,
            mod: fallbackModule,
          });
          return;
        }

        const fullChapterId = chapterId.includes(":")
          ? chapterId
          : `Chapter:${chapterId}`;

        const chapterResponse = await ChaptersApi.getChapterById(fullChapterId);
        if (!chapterResponse.success || !chapterResponse.data) {
          throw new Error("Chapter not found");
        }

        const chapter = ChaptersApi.transformChapter(chapterResponse.data);

        // Fetch module data
        const moduleResponse = await ModulesApi.getModuleById(chapter.moduleId);
        if (!moduleResponse.success || !moduleResponse.data) {
          throw new Error("Module not found");
        }

        const module = ModulesApi.transformModule(moduleResponse.data);

        setLessonData({ lesson, chapter: chapter as any, mod: module as any });
      } catch (err) {
        console.error("Error fetching lesson data:", err);
        setError("Failed to load lesson. Please try again.");
      } finally {
        setLoading(false);
        setIsLoaded(true);
      }
    };

    if (lessonId) {
      fetchLessonData();
    }
  }, [lessonId]);

  const startQuiz = () => {
    // if you open a popup before navigating, keep that flow;
    // otherwise navigate directly:
    router.push(`/quizes/${lessonId}`);
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen gradient-background-gradient px-14 py-10 flex justify-center items-center">
        <div className="bg-neutral-200 w-full h-full px-6 py-8 flex flex-col gap-6 rounded-[42px]">
          <Loader label="Loading lesson..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen gradient-background-gradient px-14 py-10 flex justify-center items-center">
        <div className="bg-neutral-200 w-full h-full px-6 py-8 flex flex-col gap-6 rounded-[42px]">
          <div className="text-center">
            <p className="text-lg text-red-600 mb-4">{error}</p>
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

  if (!lessonData) {
    notFound();
  }

  const { lesson, chapter, mod } = lessonData;

  const showQuizPopupCallback = () => {
    setShowQuizPopup(true);
  };

  return (
    <div
      className={`bg-neutral-200 w-full h-full px-6 py-8 flex flex-col gap-6 rounded-[42px] ${getFontClass()}`}
    >
      {/* Alert Dialog for Quiz Popup */}
      {showQuizPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <QuizPopup
            onAccept={() => setShowQuizPopup(false)}
            onClose={() => setShowQuizPopup(false)}
          />
        </div>
      )}

      {/* header */}
      <LessonHeader
        chapter_name={chapter.title}
        lesson_name={lesson.title}
        callback={startQuiz}
        lessonData={lesson}
        chapterData={chapter}
        moduleData={mod}
        isRTL={isRTL}
      />

      {/* video and questions FOR DESKTOP VIEW */}
      <div className="hidden md:flex lg:flex-row flex-col lg:gap-2 gap-4 h-[638px] w-full">
        {/* video */}
        <div className="bg-neutral-100 w-full h-full rounded-[52px] p-4">
          {lesson.video_url ? (
            <SecureVideoPlayer
              fileId={lesson.video_url}
              className="w-full h-full rounded-[52px]"
              onAccessGranted={(url) => {
                // Video access granted
              }}
              onAccessDenied={(error) => {
                console.error("Desktop video access denied:", error);
              }}
            />
          ) : (
            <div className="bg-neutral-200 w-full h-full rounded-[52px] flex items-center justify-center">
              <p className="text-gray-500">No video available</p>
            </div>
          )}
        </div>

        {/* questions */}
        <QuestionsSection lessonId={lessonId} />
      </div>

      {/* file attachement FOR DESKTOP VIEW */}

      {/* lesson and chapter: VISIBLE FOR MOBILE ONLY */}
      <div className="flex flex-col gap-3 md:hidden">
        <HeaderTitle
          chapter_name={chapter.title}
          lesson_name={lesson.title}
          isRTL={isRTL}
        />
        <div className="flex flex-col gap-3">
          {/* video */}
          <div className="bg-neutral-100 w-full h-72 rounded-[52px] p-4">
            {lesson.video_url ? (
              <SecureVideoPlayer
                fileId={lesson.video_url}
                className="w-full h-full rounded-[52px]"
                onAccessGranted={(url) => {
                  // Video access granted
                }}
                onAccessDenied={(error) => {
                  console.error("Mobile video access denied:", error);
                }}
              />
            ) : (
              <div className="bg-neutral-200 w-full h-full rounded-[52px] flex items-center justify-center">
                <p className="text-gray-500">No video available</p>
              </div>
            )}
          </div>

          {/* quize button */}
          <Button
            state={"filled"}
            size={"M"}
            text={"Take Quiz"}
            icon_position={"none"}
            onClick={showQuizPopupCallback}
          />
        </div>
      </div>

      <div className="px-6 py-5 flex flex-col gap-2 rounded-4xl bg-neutral-100">
        {/* Lesson Video - if available */}
        {lessonData?.lesson?.video_url && (
          <div className="mb-4">
            <h3 className="font-medium text-lg text-gray-900 mb-2">
              Lesson Video
            </h3>
            <SecureFileAccess
              fileId={lessonData.lesson.video_url} // This would be the file ID from the secure file system
              fileType="video"
              accessType="stream"
              onAccessGranted={(url) => {
                // Video is ready to play
              }}
              onAccessDenied={(error) => {
                console.error("Video access denied:", error);
              }}
              className="w-full"
            />
          </div>
        )}

        {/* Lesson PDF - if available */}
        {lessonData?.lesson?.pdf_url && (
          <div className="mb-4">
            <h3 className="font-medium text-lg text-gray-900 mb-2">
              Lesson Materials
            </h3>
            <SecureFileAccess
              fileId={lessonData.lesson.pdf_url} // This would be the file ID from the secure file system
              fileType="pdf"
              accessType="download"
              onAccessGranted={(url) => {
                // PDF is ready to download/view
              }}
              onAccessDenied={(error) => {
                console.error("PDF access denied:", error);
              }}
              className="w-full"
            />
          </div>
        )}

        {/* Fallback to old file attachment component for now */}
        <FileAttachement lessonId={lessonId} isRTL={isRTL} />
      </div>

      {/* questions section FOR MOBILE VIEW */}
      <div className="flex md:hidden">
        <QuestionsSection lessonId={lessonId} />
      </div>
    </div>
  );
}
