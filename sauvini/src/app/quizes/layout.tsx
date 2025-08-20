"use client"

import { useParams } from "next/navigation"
import { useLanguage } from "@/hooks/useLanguage"
import QuizesHeader from "@/components/quizes/quizesHeader";
import { MOCK_QUIZZES, findLessonContext } from "@/data/mockModules"

export default function QuizeLayout({
  children,
}: Readonly<{
  
  children: React.ReactNode;
}>) {
  const {isRTL} = useLanguage();
  const params = useParams() as { lessonId?: string }
  const lessonId = params?.lessonId
  const ctx = lessonId ? findLessonContext(lessonId) : { lesson: undefined }
  const questionsNum = lessonId ? (MOCK_QUIZZES[lessonId]?.questions?.length || 0) : 0

  return (
    <div className="general-background-gradient w-full min-h-screen px-20 py-10 flex flex-col gap-12">
      <QuizesHeader
        title={ctx.lesson?.title || "Lesson Title"}
        questions_num={String(questionsNum)}
        isRTL={isRTL}
      />
      {children}
    </div>
  );
}
