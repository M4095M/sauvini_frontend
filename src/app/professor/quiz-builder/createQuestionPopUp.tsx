"use client";

import { useState } from "react";
import SimpleInput from "@/components/input/simpleInput";
import CheckBoxQuestion from "@/components/quizes/checkBoxQuestion";
import ChoiceBox from "./choice";
import DropDown from "@/components/input/dropDown";
import FileAttachement from "@/components/lesson/fileAttachment";
import AttachementField from "@/components/input/attachementField";
import Button from "@/components/ui/button";
import InputButton from "@/components/input/InputButton";
import { Plus } from "lucide-react";
import QuizApi, { type CreateQuestionRequest } from "@/api/quiz";

type Props = {
  t: any;
  isRTL: boolean;
  quizId?: string;
  questionsCount?: number;
  onClose: () => void;
  onQuestionCreated?: () => void;
};

interface Choice {
  id: string;
  text: string;
}

export default function CreateQuestionPopUp({
  t,
  isRTL,
  quizId,
  questionsCount = 0,
  onClose,
  onQuestionCreated,
}: Props) {
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState<string>("");
  const [choices, setChoices] = useState<Choice[]>([
    { id: "1", text: "Choice" },
    { id: "2", text: "Choice" },
    { id: "3", text: "Choice" },
  ]);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [points, setPoints] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // handle adding new option:
  const handleAddOption = () => {
    const newChoice: Choice = {
      id: String(Date.now()),
      text: "",
    };
    setChoices([...choices, newChoice]);
  };

  const handleRemoveOption = (choiceId: string) => {
    setChoices(choices.filter((choice) => choice.id !== choiceId));
  };

  const updateChoice = (choiceId: string, text: string) => {
    setChoices(
      choices.map((choice) =>
        choice.id === choiceId ? { ...choice, text } : choice
      )
    );
  };

  const handleSubmit = async () => {
    if (!quizId) {
      setErrorMessage("Quiz ID is required");
      return;
    }

    if (!questionText.trim()) {
      setErrorMessage("Question text is required");
      return;
    }

    if (choices.length === 0) {
      setErrorMessage("At least one choice is required");
      return;
    }

    if (correctAnswers.length === 0) {
      setErrorMessage("Please select at least one correct answer");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Determine question type
      const isMultipleChoice = questionType === "1";

      const request: CreateQuestionRequest = {
        quiz: quizId,
        question_text: questionText,
        question_type: isMultipleChoice ? "multiple_choice" : "true_false",
        options: choices.map((c) => c.text),
        correct_answer: isMultipleChoice
          ? correctAnswers.join(", ")
          : correctAnswers[0] || "",
        points: points,
        explanation: questionTitle || undefined,
        order: questionsCount + 1,
      };

      const response = await QuizApi.createQuestion(request);

      if (response.success) {
        // Refresh questions list
        onQuestionCreated?.();
        onClose();
      } else {
        setErrorMessage(response.message || "Failed to create question");
      }
    } catch (error) {
      console.error("Error creating question:", error);
      setErrorMessage("An error occurred while creating the question");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-10 py-11 w-full flex flex-col gap-12 bg-neutral-100 rounded-[60px] ">
      {/* header */}
      <div className="flex flex-col gap-4">
        <div className="font-semibold text-neutral-600 text-4xl">
          {t("professor.quizes.Question")} {questionsCount + 1}
        </div>
        <div className="text-neutral-400 font-medium text-xl">
          {t("professor.quizes.CreateQuestionDesc")}
        </div>
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">
          {errorMessage}
        </div>
      )}

      {/* questionsd */}
      <div className="flex flex-col gap-10 w-full">
        <SimpleInput
          label={t("professor.quizes.QuestionTitle")}
          type={"text"}
          max_width=""
          value={questionTitle}
          onChange={(e) => setQuestionTitle(e.target.value)}
        />
        <SimpleInput
          label={t("professor.quizes.QuestionText")}
          type={"text"}
          max_width=""
          max_hight="h-[100px]"
          long
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
        />
        <div className="flex flex-col">
          <DropDown
            label={t("professor.quizes.QuestionType")}
            placeholder="Question Type"
            options={[
              {
                id: "1",
                text:
                  t("professor.quizes.MultipleCorrectAnswers") ||
                  "Possibly has multiple correct answers",
              },
              {
                id: "2",
                text:
                  t("professor.quizes.SingleCorrectAnswer") ||
                  "Has one correct answer",
              },
            ]}
            max_width=""
            value={questionType}
            onChange={(id) => setQuestionType(id)}
          />
        </div>
        <div className="flex flex-col gap-4">
          {/* add new option */}
          <InputButton
            label={t("professor.quizes.Choices")}
            type={"icon"}
            icon={<Plus />}
            max_width=""
            onClick={handleAddOption}
          />
          {/* options */}
          <div className="flex flex-col gap-2">
            {choices.map((choice) => (
              <ChoiceBox
                key={choice.id}
                handleRemove={() => handleRemoveOption(choice.id)}
                choice={choice.text}
                onChange={(text) => updateChoice(choice.id, text)}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-work-sans text-neutral-600 font-normal px-4">
            {t("professor.quizes.CorrectAnswers")}
          </div>
          <div className="flex flex-col gap-2">
            {choices.map((choice, index) => {
              const isSelected = correctAnswers.includes(choice.text);
              return (
                <div
                  key={choice.id}
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => {
                    if (isSelected) {
                      setCorrectAnswers(
                        correctAnswers.filter((ans) => ans !== choice.text)
                      );
                    } else {
                      setCorrectAnswers([...correctAnswers, choice.text]);
                    }
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="w-4 h-4"
                  />
                  <span className="text-neutral-600">{choice.text}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-work-sans text-neutral-600 font-normal px-4">
            Points
          </div>
          <input
            type="number"
            value={points}
            onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
            className="appearance-none outline-none p-0 m-0 shadow-none bg-white border border-neutral-200 px-5 py-3 rounded-3xl w-full"
            min="1"
          />
        </div>
        <div className="flex flex-col gap-5">
          <AttachementField
            label={t("professor.quizes.QuizAttach")}
            max_size={0}
            name={""}
            acceptedTypes={"image/*,.pdf,.doc,.docx"}
            mandatory={false}
          />
          <div className="flex flex-col gap-3">
            <FileAttachement isRTL={isRTL} downloadable />
            <FileAttachement isRTL={isRTL} downloadable />
            <FileAttachement isRTL={isRTL} downloadable />
          </div>
        </div>
      </div>
      {/* actions */}
      <div className="flex flex-row gap-5">
        <Button
          state={"tonal"}
          size={"M"}
          icon_position={"none"}
          text={t("professor.quizes.Cancel")}
          onClick={onClose}
          disabled={isSubmitting}
        />
        <Button
          state={"filled"}
          size={"M"}
          icon_position={"none"}
          text={
            isSubmitting
              ? "Creating..."
              : t("professor.quizes.CreateQuestion") ||
                t("professor.quizes.CreateQuiz")
          }
          onClick={handleSubmit}
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
}
