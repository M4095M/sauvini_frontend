"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { MOCK_MODULES_DATA } from "@/data/mockModules";
import type { Lesson, Chapter, Module } from "@/types/modules";
import Loader from "@/components/ui/Loader";
import FileAttachement from "@/components/lesson/fileAttachment";
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
  const [isLoaded, setIsLoaded] = useState(false);
  const [showQuizPopup, setShowQuizPopup] = useState(false);
  const {isRTL} = useLanguage()

  const findLessonData = () => {
    for (const module of MOCK_MODULES_DATA.modules) {
      for (const chapter of module.chapters) {
        const lesson = chapter.lessons.find((l) => l.id === lessonId);
        if (lesson) {
          return { lesson, chapter, module };
        }
      }
    }
    return null;
  };

  const lessonData = findLessonData();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (isLoaded && !lessonData) {
    notFound();
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen gradient-background-gradient px-14 py-10 flex justify-center items-center">
        <div className="bg-neutral-200 w-full h-full px-6 py-8 flex flex-col gap-6 rounded-[42px]">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-300 dark:border-primary-400 border-t-transparent" />
          </div>
        </div>
      </div>
    );
  }

  if (!lessonData) {
    return null; // notFound() will handle this
  }

  const { lesson, chapter, module } = lessonData;

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
        callback={showQuizPopupCallback}
        lessonData={lesson}
        chapterData={chapter}
        moduleData={module}
        isRTL={isRTL}
      />

      {/* video and questions FOR DESKTOP VIEW */}
      <div className="hidden md:flex lg:flex-row flex-col lg:gap-2 gap-4 h-[638px] w-full">
        {/* video */}
        <div className="bg-neutral-100 w-full h-full rounded-[52px] p-4">
          <div className="bg-neutral-200 w-full h-full rounded-[52px]"></div>
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
            <div className="bg-neutral-200 w-full h-full rounded-[52px]"></div>
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
        <FileAttachement lessonId={lessonId} isRTL={isRTL} />
        <FileAttachement lessonId={lessonId} isRTL={isRTL} />
      </div>

      {/* questions section FOR MOBILE VIEW */}
      <div className="flex md:hidden">
        <QuestionsSection lessonId={lessonId} />
      </div>
    </div>
  );
}
