"use client"

import QuizesHeader from "@/components/quizes/quizesHeader";
import { useLanguage } from "@/context/LanguageContext";

export default function QuizeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {isRTL} = useLanguage();
  return (
    <div
      className="general-background-gradient w-full min-h-screen
  px-20 py-10 flex flex-col gap-12"
    >
      <QuizesHeader title={"Lesson Title"} questions_num={"16"} isRTL={isRTL} />
      {children}
    </div>
  );
}
