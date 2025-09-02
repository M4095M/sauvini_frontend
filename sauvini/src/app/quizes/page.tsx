"use client";

import CheckBoxQuestion from "@/components/quizes/checkBoxQuestion";
import Question from "@/components/quizes/question";
import Button from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

export default function QuizezPage() {
  const { isRTL, t } = useLanguage();
  return (
    <div
      className="bg-neutral-100 py-8 rounded-[60px] overflow-hidden w-full
    flex flex-col justify-center items-center"
    >
      <div className="flex flex-col w-fit">
        <Question
          number="1"
          question={
            "Which of the following programming languages are statically typed?"
          }
          options={[
            "JavaScript",
            "TypeScript",
            "Go",
            "Python",
            "Kotlin",
            "Ruby",
          ]}
          checkbox={true}
          isRTL={isRTL}
        />
        <Question
          number="1"
          question={
            "Which of the following programming languages are statically typed?"
          }
          options={[
            "JavaScript",
            "TypeScript",
            "Go",
            "Python",
            "Kotlin",
            "Ruby",
          ]}
          checkbox={false}
          isRTL={isRTL}
        />
        <Question
          number="1"
          question={
            "Which of the following programming languages are statically typed?"
          }
          options={[
            "JavaScript",
            "TypeScript",
            "Go",
            "Python",
            "Kotlin",
            "Ruby",
          ]}
          image="url here"
          checkbox={false}
          isRTL={isRTL}
        />
        {/* action buttons */}
        <div className="w-fill self-end flex w-3xs items-end justify-end">
          <Button
            state={"filled"}
            size={"M"}
            icon_position={"none"}
            text={t("professor.quizes.Submit")}
          />
        </div>
      </div>
    </div>
  );
}
