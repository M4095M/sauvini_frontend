"use client";

import FileAttachement from "@/components/lesson/fileAttachment";
import LessonHeader from "@/components/lesson/lessonHeader";
import QuestionsSection from "@/components/lesson/questions";
import QuizPopup from "@/components/lesson/quizPopup";
import { useTypography } from "@/hooks/useTypography";
import { useState } from "react";

export default function LessonPage() {
  const { getFontClass } = useTypography();
  const [showQuizPopup, setShowQuizPopup] = useState(false);

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
          <QuizPopup onAccept={() => setShowQuizPopup(false)} onClose={() => setShowQuizPopup(false)} />
        </div>
      )}

      {/* header */}
      <LessonHeader
        chapter_name={"Chapter Name"}
        lesson_name={"Lesson 3: Derivatives"}
        callback={showQuizPopupCallback}
      />

      {/* video and questions */}
      <div className="flex gap-2 h-[638px] w-full">
        {/* video */}
        <div className="bg-neutral-100 w-full h-full rounded-[52px] p-4">
          <div className="bg-neutral-200 w-full h-full rounded-[52px]"></div>
        </div>

        {/* questions */}
        <QuestionsSection />
      </div>

      {/* file attachement */}
      <div className=" px-6 py-5 flex flex-col gap-2 rounded-4xl bg-neutral-100">
        <FileAttachement />
        <FileAttachement />
      </div>
    </div>
  );
}
