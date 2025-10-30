"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import Question from "@/components/quizes/question";
import QuizApi, { type QuizWithQuestions, type QuizQuestion } from "@/api/quiz";
import { useLanguage } from "@/hooks/useLanguage";
import Loader from "@/components/ui/Loader";

export default function LessonQuizPage() {
  const router = useRouter();
  const { isRTL } = useLanguage();
  const params = useParams() as { lessonId: string };
  const lessonId = params.lessonId;

  const [quiz, setQuiz] = useState<QuizWithQuestions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await QuizApi.getQuizByLesson(lessonId);
        if (response.success && response.data) {
          setQuiz(response.data);
        } else {
          setError("Quiz not found for this lesson");
        }
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError("Failed to load quiz. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) {
      fetchQuiz();
    }
  }, [lessonId]);

  // Warn user that answers won't be saved if they leave
  useEffect(() => {
    const beforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, []);

  const onSubmit = async () => {
    if (!quiz) return;

    try {
      setSubmitting(true);

      const response = await QuizApi.submitQuiz(quiz.quiz.id, {
        answers,
        time_spent: undefined, // TODO: Calculate actual time spent
      });

      if (response.success && response.data) {
        // Store result in localStorage for the result page
        const submissionKey = `quizSubmission:${lessonId}`;
        const submission = {
          lessonId,
          quizId: quiz.quiz.id,
          score: response.data.score,
          passed: response.data.passed,
          correct_answers: response.data.correct_answers,
          explanations: response.data.explanations,
          submittedAt: new Date().toISOString(),
        };

        try {
          localStorage.setItem(submissionKey, JSON.stringify(submission));
        } catch (err) {
          console.warn("Failed to save submission to localStorage:", err);
        }

        router.push(`/quizes/${lessonId}/result`);
      } else {
        setError("Failed to submit quiz. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting quiz:", err);
      setError("Failed to submit quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  if (loading) {
    return (
      <div className="bg-neutral-100 py-8 rounded-[60px] overflow-hidden w-full flex flex-col justify-center items-center">
        <Loader label="Loading quiz..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-neutral-100 py-8 rounded-[60px] overflow-hidden w-full flex flex-col justify-center items-center">
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
    );
  }

  if (!quiz) {
    return (
      <div className="bg-neutral-100 py-8 rounded-[60px] overflow-hidden w-full flex flex-col justify-center items-center">
        <p className="text-lg text-gray-500">
          No quiz available for this lesson
        </p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-100 py-8 rounded-[60px] overflow-hidden w-full flex flex-col justify-center items-center">
      <div className="flex flex-col w-fit">
        {quiz.questions.map((q, idx) => (
          <Question
            key={q.id}
            number={String(idx + 1)}
            question={q.question_text}
            options={q.options || []}
            checkbox={q.question_type === "MultipleChoice"}
            image={undefined} // TODO: Add image support if needed
            isRTL={isRTL}
            onAnswerChange={(answer) => handleAnswerChange(q.id, answer)}
          />
        ))}

        <div className="w-fill self-end flex w-3xs items-end justify-end">
          <Button
            state={submitting ? "disabled" : "filled"}
            size={"M"}
            icon_position={"none"}
            text={submitting ? "Submitting..." : "Submit"}
            onClick={onSubmit}
            disabled={submitting}
          />
        </div>
      </div>
    </div>
  );
}
