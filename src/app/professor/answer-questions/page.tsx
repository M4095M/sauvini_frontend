"use client";

import { useEffect, useState } from "react";
import QuestionsGrid from "@/components/professor/questions/QuestionsGrid";
import Loader from "@/components/ui/Loader";
import { useLanguage } from "@/hooks/useLanguage";
import {
  questionsApi,
  type QuestionWithDetails,
  type QuestionFilters,
} from "@/api/questions";

export default function AnswerQuestionsPage() {
  const { isRTL } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [questions, setQuestions] = useState<QuestionWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    setLoaded(true);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);

        const filters: QuestionFilters = {
          status: undefined, // Get all questions
          page: 1,
          per_page: 50,
        };

        const response = await questionsApi.getQuestions(filters);
        if (response.success && response.data) {
          const transformedQuestions = response.data.questions.map(
            questionsApi.transformQuestionWithDetails
          );
          setQuestions(transformedQuestions);
        } else {
          setError("Failed to load questions");
        }
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to load questions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (loaded) {
      fetchQuestions();
    }
  }, [loaded]);

  if (!loaded || loading) {
    return (
      <div className="self-stretch w-full">
        <Loader label="Loading questions..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="self-stretch w-full flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <QuestionsGrid questions={questions} isMobile={isMobile} />;
}
