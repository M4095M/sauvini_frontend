"use client";

import { useState } from "react";
import CreateQuestionPopUp from "./createQuestionPopUp";
import QuizBuilderHeader from "./header";
import QuizBuilderQuestions from "./questions-section";

export default function QuizBuilder() {
  const [showPopup, setShowPopup] = useState(true);

  return (
    <div className={`flex flex-col justify-center items-center  gap-6 w-full`}>
      <QuizBuilderHeader />
      <QuizBuilderQuestions />
      {/* <div
        className={`top-0 left-0 md:px-[20%] px-[5%] py-[5%] flex justify-center items-center bg-black/70 absolute w-full z-1000
        ${showPopup ? "" : "hidden"}`}
      >
        <CreateQuestionPopUp />
      </div> */}
    </div>
  );
}
