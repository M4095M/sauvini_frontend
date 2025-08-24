import CreateQuestionPopUp from "./createQuestionPopUp";
import QuizBuilderHeader from "./header";
import QuizBuilderQuestions from "./questions-section";

export default function QuizBuilder() {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* <QuizBuilderHeader />
      <QuizBuilderQuestions /> */}
      <CreateQuestionPopUp />
    </div>
  );
}
