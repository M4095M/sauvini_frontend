"use client";

import { useEffect, useState } from "react";
import ExamsGrid from "@/components/exams/ExamsGrid";
import Loader from "@/components/ui/Loader";
import { examsApi, type ExamWithQuestions } from "@/api/exams";
import { modulesApi, type FrontendModule } from "@/api";
import { chaptersApi } from "@/api";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

export default function ExamsPage() {
  const isMobile = useIsMobile();
  const [isLoaded, setIsLoaded] = useState(false);
  const [exams, setExams] = useState<ExamWithQuestions[]>([]);
  const [modules, setModules] = useState<FrontendModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

          // Fetch exams for each module's chapters
          const allExams: ExamWithQuestions[] = [];
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

                // Fetch exams for each chapter
                for (const chapter of frontendChapters) {
                  try {
                    const examsResponse = await examsApi.getExamsByChapter(
                      chapter.id
                    );
                    if (examsResponse.success && examsResponse.data) {
                      const transformedExams = examsResponse.data.map(
                        examsApi.transformExamWithQuestions
                      );
                      allExams.push(...transformedExams);
                    }
                  } catch (err) {
                    console.warn(
                      `Failed to fetch exams for chapter ${chapter.id}:`,
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
          setExams(allExams);

          // If no exams were found, show a message instead of an error
          if (allExams.length === 0) {
            setError(
              "No exams available at the moment. Please check back later."
            );
          }
        } else {
          setError("Failed to load modules");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load exams. Please try again.");
      } finally {
        setLoading(false);
        setIsLoaded(true);
      }
    };

    fetchData();
  }, []);

  if (!isLoaded || loading) {
    return (
      <div className="self-stretch w-full">
        <Loader label="Loading exams..." />
      </div>
    );
  }

  if (error) {
    const isNoExamsError = error.includes("No exams available");
    return (
      <div className="self-stretch w-full flex items-center justify-center p-8">
        <div className="text-center">
          <p
            className={`mb-4 ${
              isNoExamsError ? "text-gray-600" : "text-red-600"
            }`}
          >
            {error}
          </p>
          {!isNoExamsError && (
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <ExamsGrid
      exams={exams}
      modules={modules}
      isMobile={isMobile}
      userLevel={1} // TODO: Get from user context
    />
  );
}
