"use client";

import { useEffect, useState } from "react";
import QuestionsGrid from "@/components/professor/questions/QuestionsGrid";
import Loader from "@/components/ui/Loader";
import { useLanguage } from "@/hooks/useLanguage";

export default function AnswerQuestionsPage() {
  const { isRTL } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    setLoaded(true);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (!loaded) {
    return (
      <div className="self-stretch w-full">
        <Loader label="Loading questions..." />
      </div>
    );
  }

  return <QuestionsGrid isMobile={isMobile} />;
}