"use client";

import { useEffect, useState } from "react";
import ExercisesGrid from "@/components/professor/exercises/ExerciseSubmissionsGrid";
import Loader from "@/components/ui/Loader";
import { MOCK_EXERCISE_SUBMISSIONS } from "@/data/mockExams"; 

export default function CorrectExercisesPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    setLoaded(true);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (!loaded) return <div className="w-full"><Loader label="Loading exercise submissions..." /></div>;

  return <ExercisesGrid submissions={MOCK_EXERCISE_SUBMISSIONS as any} isMobile={isMobile} />;
}