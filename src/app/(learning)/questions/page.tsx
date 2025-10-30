"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import QuestionsGrid from "@/components/questions/QuestionsGrid";
import Loader from "@/components/ui/Loader";
import {
  questionsApi,
  type QuestionWithDetails,
  type QuestionFilters,
} from "@/api/questions";
import { modulesApi, type FrontendModule } from "@/api";
import { chaptersApi } from "@/api";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return isMobile;
}

export default function QuestionsPage() {
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const [isLoaded, setIsLoaded] = useState(false);
  const [questions, setQuestions] = useState<QuestionWithDetails[]>([]);
  const [modules, setModules] = useState<FrontendModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all modules first
        const modulesResponse = await modulesApi.getAllModules();
        if (modulesResponse.success && modulesResponse.data) {
          const frontendModules = modulesResponse.data.map(
            modulesApi.transformModule
          );
          setModules(frontendModules);

          // Fetch questions for each module's chapters
          const allQuestions: QuestionWithDetails[] = [];
          for (const module of frontendModules) {
            try {
              // Fetch chapters for this module
              const chaptersResponse = await chaptersApi.getChaptersByModule(
                module.id
              );
              if (chaptersResponse.success && chaptersResponse.data) {
                const frontendChapters = chaptersResponse.data.map(
                  chaptersApi.transformChapter
                );

                // Update module with chapters
                module.chapters = frontendChapters;

                // Fetch questions for each chapter
                for (const chapter of frontendChapters) {
                  try {
                    const questionsResponse = await questionsApi.getQuestions({
                      chapter_id: chapter.id,
                      page: 1,
                      per_page: 50,
                    });
                    if (questionsResponse.success && questionsResponse.data) {
                      const transformedQuestions =
                        questionsResponse.data.questions.map(
                          questionsApi.transformQuestionWithDetails
                        );
                      allQuestions.push(...transformedQuestions);
                    }
                  } catch (err) {
                    console.warn(
                      `Failed to fetch questions for chapter ${chapter.id}:`,
                      err
                    );
                  }
                }
              }
            } catch (err) {
              console.warn(
                `Failed to fetch chapters for module ${module.id}:`,
                err
              );
            }
          }
          setQuestions(allQuestions);

          // If no questions were found, show a message instead of an error
          if (allQuestions.length === 0) {
            setError(
              "No questions available at the moment. Please check back later."
            );
          }
        } else {
          setError("Failed to load modules");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load questions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded) {
      fetchData();
    }
  }, [isLoaded]);

  if (!isLoaded || loading) {
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
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <QuestionsGrid
      questions={questions}
      isMobile={isMobile}
      userLevel={1} // TODO: Get from user context
    />
  );
}
