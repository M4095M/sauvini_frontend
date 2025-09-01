"use client";

import { useState } from "react";
import CreateQuestionPopUp from "./createQuestionPopUp";
import QuizBuilderHeader from "./header";
import QuizBuilderQuestions from "./questions-section";
import { useLanguage } from "@/context/LanguageContext";

export default function QuizBuilder() {
  const { t, isRTL } = useLanguage();
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className={`flex flex-col justify-center items-center  gap-6 w-full`}>
      <QuizBuilderHeader t={t} isRLT={isRTL} />
      <QuizBuilderQuestions
        t={t}
        isRLT={isRTL}
        createQuestion={() => {
          window.scrollTo(0, 0);
          document.body.classList.add("no-scroll");
          setShowPopup(true);
        }}
      />
      {showPopup && (
        <div
          className={`w-full flex justify-center  h-screen overflow-y-auto absolute top-0 left-0 bg-black/40 z-10000 `}
        >
          <div className="m-20 max-w-4xl w-full">
            <CreateQuestionPopUp
              t={t}
              isRTL={isRTL}
              onClose={() => {
                document.body.classList.remove("no-scroll");
                setShowPopup(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
