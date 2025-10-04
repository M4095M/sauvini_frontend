"use client";

import { useEffect, useState } from "react";
import ExamsGrid from "@/components/exams/ExamsGrid";
import { MOCK_EXAMS_DATA } from "@/data/mockModules";
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

export default function ExamsPage() {
  const isMobile = useIsMobile();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <div className="self-stretch w-full">
        <Loader label="Loading exams..." />
      </div>
    );
  }

  return (
    <ExamsGrid
      exams={MOCK_EXAMS_DATA.exams}
      modules={MOCK_EXAMS_DATA.modules}
      isMobile={isMobile}
      userLevel={MOCK_EXAMS_DATA.userProfile?.level || 1}
    />
  );
}
