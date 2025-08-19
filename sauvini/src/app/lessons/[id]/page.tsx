"use client";

import { useEffect, useState } from "react"
import { useParams, notFound } from "next/navigation"
import { MOCK_MODULES_DATA } from "@/data/mockModules"
import type { Lesson, Chapter, Module } from "@/types/modules"
import Loader from "@/components/ui/Loader"
import FileAttachement from "@/components/lesson/fileAttachment";
import LessonHeader from "@/components/lesson/lessonHeader";
import QuestionsSection from "@/components/lesson/questions";
import QuizPopup from "@/components/lesson/quizPopup";
import { useTypography } from "@/hooks/useTypography";

export default function LessonPage() {
  const params = useParams()
  const lessonId = params.id as string
  const { getFontClass } = useTypography();
  const [isLoaded, setIsLoaded] = useState(false)
  const [showQuizPopup, setShowQuizPopup] = useState(false);


  const findLessonData = () => {
    for (const module of MOCK_MODULES_DATA.modules) {
      for (const chapter of module.chapters) {
        const lesson = chapter.lessons.find(l => l.id === lessonId)
        if (lesson) {
          return { lesson, chapter, module }
        }
      }
    }
    return null
  }

  const lessonData = findLessonData()

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  if (isLoaded && !lessonData) {
    notFound()
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
    )
  }

  if (!lessonData) {
    return null // notFound() will handle this
  }

  const { lesson, chapter, module } = lessonData

  const showQuizPopupCallback = () => {
    setShowQuizPopup(true)
  }

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
      />

      {/* video and questions */}
      <div className="flex gap-2 h-[638px] w-full">
        {/* video */}
        <div className="bg-neutral-100 w-full h-full rounded-[52px] p-4">
          <div className="bg-neutral-200 w-full h-full rounded-[52px]"></div>
        </div>

        {/* questions */}
        <QuestionsSection lessonId={lessonId} />
      </div>

      {/* file attachement */}
      <div className="px-6 py-5 flex flex-col gap-2 rounded-4xl bg-neutral-100">
        <FileAttachement lessonId={lessonId} />
        <FileAttachement lessonId={lessonId} />
      </div>
    </div>
  );
}
