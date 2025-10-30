"use client";

import React, { useState } from "react";
import Button from "../ui/button";
import QuestionCard from "./QACard";
import ListOfQuestionContainer from "./ListOfQuestionContainer";
import QuestionForm from "./questionForm";

type Section = {
  id: number;
  element: React.ReactElement;
};

type QuestionSection = Section[];

const questionSections: QuestionSection = [
  {
    id: 1,
    element: <ListOfQuestionContainer />,
  },
  {
    id: 2,
    element: <QuestionForm />,
  },
  {
    id: 3,
    element: <div className="">Selected question</div>,
  },
];

interface QuestionsSectionProps {
  lessonId?: string;
}

export default function QuestionsSection({ lessonId }: QuestionsSectionProps) {
  const [selectedSection, setSeletedSection] = useState(1);

  return (
    <div
      className="h-full lg:max-w-80 w-full rounded-[36px] bg-neutral-100 p-3
    flex flex-col gap-5"
    >
      {/* navigation buttons */}
      <div className="flex justify-center items-center gap-3">
        <div
          className={`px-4 py-2.5 text-sm font-medium select-none cursor-pointer ${
            selectedSection === 1 ? "border-b-2 border-neutral-300" : ""
          }`}
          onClick={() => {
            setSeletedSection(1);
          }}
        >
          {"Questions"}
        </div>
        <div
          className={`px-4 py-2.5 text-sm font-medium select-none cursor-pointer ${
            selectedSection === 2 ? "border-b-2 border-neutral-300" : ""
          }`}
          onClick={() => {
            setSeletedSection(2);
          }}
        >
          {"Ask a Question"}
        </div>
      </div>

      {/* questions */}
      <div className="w-full h-full flex justify-center lg:items-start items-center  lg:overflow-y-auto overflow-x-auto lg:overflow-x-hidden">
        {questionSections.map((section) => {
          if (section.id === selectedSection) {
            return (
              <div key={section.id} className="">
                {section.element}
              </div>
            );
          } 
        })}
      </div>
    </div>
  );
}
