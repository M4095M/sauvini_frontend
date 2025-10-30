"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import CreateQuestionPopUp from "./createQuestionPopUp";
import QuizBuilderHeader from "./header";
import QuizBuilderQuestions from "./questions-section";
import { useLanguage } from "@/context/LanguageContext";
import QuizApi, { type QuizQuestion } from "@/api/quiz";

export default function QuizBuilder() {
  const { t, isRTL } = useLanguage();
  const searchParams = useSearchParams();
  const [showPopup, setShowPopup] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [currentQuizId, setCurrentQuizId] = useState<string | undefined>(
    undefined
  );

  // Get lessonId and quizId from URL params
  const lessonId = searchParams?.get("lessonId") || "";
  const quizId = searchParams?.get("quizId") || undefined;

  // Load quiz questions from backend
  useEffect(() => {
    const loadQuestions = async () => {
      if (!lessonId) {
        setIsLoadingQuestions(false);
        return;
      }

      try {
        setIsLoadingQuestions(true);
        const quizResponse = await QuizApi.getQuizByLesson(lessonId);
        if (
          quizResponse.success &&
          quizResponse.data &&
          quizResponse.data.quiz
        ) {
          setQuestions(quizResponse.data.questions || []);
          // Store quiz ID for creating questions
          setCurrentQuizId(quizResponse.data.quiz.id);
        }
      } catch (error) {
        console.error("Error loading quiz questions:", error);
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    loadQuestions();
  }, [lessonId, quizId]);

  // Refresh questions after creation
  const refreshQuestions = async () => {
    if (!lessonId) return;
    try {
      const quizResponse = await QuizApi.getQuizByLesson(lessonId);
      if (quizResponse.success && quizResponse.data && quizResponse.data.quiz) {
        setQuestions(quizResponse.data.questions || []);
        setCurrentQuizId(quizResponse.data.quiz.id);
      }
    } catch (error) {
      console.error("Error refreshing questions:", error);
    }
  };

  return (
    <div className={`flex flex-col justify-center items-center  gap-6 w-full`}>
      <QuizBuilderHeader
        t={t}
        isRLT={isRTL}
        lessonId={lessonId}
        quizId={quizId}
      />
      <QuizBuilderQuestions
        t={t}
        isRLT={isRTL}
        questions={questions}
        isLoading={isLoadingQuestions}
        createQuestion={() => {
          window.scrollTo(0, 0);
          document.body.classList.add("no-scroll");
          setShowPopup(true);
        }}
      />
      {showPopup && (
        <div
          className={`w-full flex justify-center  h-screen overflow-y-auto absolute top-0 left-0 bg-black/40 z-10000 `}
        >
          <div className="m-20 max-w-4xl w-full">
            <CreateQuestionPopUp
              t={t}
              isRTL={isRTL}
              quizId={currentQuizId}
              questionsCount={questions.length}
              onClose={() => {
                document.body.classList.remove("no-scroll");
                setShowPopup(false);
              }}
              onQuestionCreated={refreshQuestions}
            />
          </div>
        </div>
      )}
    </div>
  );
}
