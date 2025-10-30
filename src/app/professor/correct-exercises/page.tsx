"use client";

import { useEffect, useState } from "react";
import ExercisesGrid from "@/components/professor/exercises/ExerciseSubmissionsGrid";
import Loader from "@/components/ui/Loader";
import {
  exerciseApi,
  type ExerciseSubmissionWithDetails,
} from "@/api/exercise";

export default function CorrectExercisesPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [submissions, setSubmissions] = useState<
    ExerciseSubmissionWithDetails[]
  >([]);
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
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        setError(null);

        // TODO: Get all exercises and their submissions
        // For now, we'll show an empty state since we need to implement
        // a way to get all submissions across all exercises
        setSubmissions([]);
      } catch (err) {
        console.error("Error fetching exercise submissions:", err);
        setError("Failed to load exercise submissions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (loaded) {
      fetchSubmissions();
    }
  }, [loaded]);

  if (!loaded || loading) {
    return (
      <div className="w-full">
        <Loader label="Loading exercise submissions..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex items-center justify-center p-8">
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

  return <ExercisesGrid submissions={submissions} isMobile={isMobile} />;
}
