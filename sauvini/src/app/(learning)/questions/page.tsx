"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import QuestionsGrid from "@/components/modules/QuestionsGrid";
import { MOCK_USER_PROFILE, MOCK_QUESTIONS } from "@/data/mockModules";

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
  const userProfile = MOCK_USER_PROFILE;

  return (
    <QuestionsGrid
      questions={MOCK_QUESTIONS}
      isMobile={isMobile}
      userLevel={userProfile?.level}
    />
  );
}
