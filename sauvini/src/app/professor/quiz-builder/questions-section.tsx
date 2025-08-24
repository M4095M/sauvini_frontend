import Button from "@/components/ui/button";
import { Plus } from "lucide-react";
import OneQuestionBox from "./OneQuestionBox";

export default function QuizBuilderQuestions() {
  return (
    <div
      className="w-full bg-neutral-100 px-3 py-6 rounded-[52px]
    flex flex-col gap-3"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between gap-3 px-4">
        <div className="text-neutral-600 text-2xl font-medium grow">
          Questions
        </div>
        <div className="">
          <Button
            state={"outlined"}
            size={"M"}
            icon_position={"left"}
            icon={<Plus />}
            text="Add Question"
          />
        </div>
      </div>
      {/* QUESTIONS */}
      <div className="flex flex-col gap-7">
        <OneQuestionBox />
        <OneQuestionBox />
        <OneQuestionBox />
      </div>
    </div>
  );
}
