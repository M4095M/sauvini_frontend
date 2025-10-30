"use client";

import { useEffect, useState } from "react";
import { exerciseApi, type Exercise } from "@/api/exercise";
import { modulesApi, type FrontendModule } from "@/api";
import ExercisesGrid from "@/components/exercises/ExercisesGrid";
import Loader from "@/components/ui/Loader";

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

export default function ExercisesPage() {
  const isMobile = useIsMobile();
  const [isLoaded, setIsLoaded] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
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

          // Fetch exercises for each module's chapters
          const allExercises: Exercise[] = [];
          for (const module of frontendModules) {
            for (const chapter of module.chapters) {
              try {
                const exercisesResponse =
                  await exerciseApi.getExercisesByChapter(chapter.id);
                if (exercisesResponse.success && exercisesResponse.data) {
                  allExercises.push(...exercisesResponse.data);
                }
              } catch (err) {
                console.warn(
                  `Failed to fetch exercises for chapter ${chapter.id}:`,
                  err
                );
              }
            }
          }
          setExercises(allExercises);
        } else {
          setError("Failed to load modules");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load exercises. Please try again.");
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
        <Loader label="Loading exercises..." />
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
    <ExercisesGrid
      exercises={exercises}
      modules={modules}
      isMobile={isMobile}
      userLevel={1} // TODO: Get from user context
    />
  );
}
