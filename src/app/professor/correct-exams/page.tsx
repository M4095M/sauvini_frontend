"use client";

import { useState, useEffect } from "react";
import ExamsGrid from "@/components/professor/exams/ExamsSubmissionsGrid";
import Loader from "@/components/ui/Loader";
import { examsApi, type ExamSubmissionWithDetails } from "@/api/exams";

export default function CorrectExamsPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [submissions, setSubmissions] = useState<ExamSubmissionWithDetails[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    setIsLoaded(true);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        setError(null);

        // For now, we'll fetch all exams and then get their submissions
        // In a real implementation, you might want a dedicated endpoint for all submissions
        const examsResponse = await examsApi.getExams({
          page: 1,
          per_page: 100,
        });
        if (examsResponse.success && examsResponse.data) {
          const allSubmissions: ExamSubmissionWithDetails[] = [];

          for (const exam of examsResponse.data.exams) {
            try {
              const submissionsResponse = await examsApi.getExamSubmissions(
                exam.exam.id
              );
              if (submissionsResponse.success && submissionsResponse.data) {
                const transformedSubmissions = submissionsResponse.data.map(
                  examsApi.transformExamSubmissionWithDetails
                );
                allSubmissions.push(...transformedSubmissions);
              }
            } catch (err) {
              console.warn(
                `Failed to fetch submissions for exam ${exam.exam.id}:`,
                err
              );
            }
          }

          setSubmissions(allSubmissions);
        } else {
          setError("Failed to load exams");
        }
      } catch (err) {
        console.error("Error fetching submissions:", err);
        setError("Failed to load exam submissions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded) {
      fetchSubmissions();
    }
  }, [isLoaded]);

  if (!isLoaded || loading) {
    return (
      <div className="self-stretch w-full">
        <Loader label="Loading exam submissions..." />
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

  return <ExamsGrid submissions={submissions} isMobile={isMobile} />;
}
