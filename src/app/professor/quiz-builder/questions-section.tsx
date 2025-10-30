import Button from "@/components/ui/button";
import { Plus } from "lucide-react";
import OneQuestionBox from "./OneQuestionBox";
import type { QuizQuestion } from "@/api/quiz";
import Loader from "@/components/ui/Loader";

type QuizBuilderQuestions = {
  t: any;
  isRLT?: boolean;
  questions?: QuizQuestion[];
  isLoading?: boolean;
  createQuestion?: () => void;
};

export default function QuizBuilderQuestions({
  t,
  isRLT,
  questions = [],
  isLoading = false,
  createQuestion
}: QuizBuilderQuestions) {
  return (
    <div
      className="w-full bg-neutral-100 px-3 py-6 rounded-[52px]
    flex flex-col gap-3"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between gap-3 px-4">
        <div className="text-neutral-600 text-2xl font-medium grow">
          {t("professor.quizes.Questions")} {questions.length > 0 && `(${questions.length})`}
        </div>
        <div className="">
          <Button
            state={"outlined"}
            size={"M"}
            icon_position={"left"}
            icon={<Plus />}
            text={t("professor.quizes.AddQuestion")}
            onClick={createQuestion}
          />
        </div>
      </div>
      {/* QUESTIONS */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader label="Loading questions..." />
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-12 text-neutral-400">
          No questions yet. Click "Add Question" to create one.
        </div>
      ) : (
        <div className="flex flex-col gap-7">
          {questions.map((question, index) => (
            <OneQuestionBox 
              key={question.id} 
              t={t} 
              isRTL={isRLT} 
              question={question}
              questionNumber={index + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}