import InputButton from "@/components/input/InputButton";
import Button from "@/components/ui/button";
import { useRef } from "react";

type QuizHeaderProps = {
  t: any;
  isRLT?: boolean;
};

export default function QuizBuilderHeader({ t, isRLT }: QuizHeaderProps) {
  // ! tempo: should be replaced with ref from Form hook
  const inputRef = useRef<HTMLInputElement>(null)


  return (
    <div className="w-full bg-neutral-100 px-3 py-11 rounded-[52px] flex flex-col gap-8">
      {/* header */}
      <div className="flex flex-row justify-between items-center gap-3">
        <div className="flex flex-col grow gap-1 px-6">
          <div className="font-semibold text-5xl text-neutral-600">
            Lesson Title Quiz
          </div>
          <div className="font-medium text-2xl text-neutral-400">
            Module : Chapter
          </div>
        </div>
        <div className="">
          <Button
            state={"filled"}
            size={"M"}
            icon_position={"right"}
            text={t("professor.quizes.SaveQuiz")}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
              >
                <path
                  d="M9.7001 12L11.5668 13.8666L15.3001 10.1333M20.9001 12C20.9001 16.6392 17.1393 20.4 12.5001 20.4C7.86091 20.4 4.1001 16.6392 4.1001 12C4.1001 7.36078 7.86091 3.59998 12.5001 3.59998C17.1393 3.59998 20.9001 7.36078 20.9001 12Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
        </div>
        <div className=""></div>
      </div>
      {/* quiz total xp points */}
      <div className="px-8">
        <InputButton
          label={t("professor.quizes.QuizTotalPoints")}
          type={"plus-minus"}
          max_width=""
          ref={inputRef}
        />
      </div>
      {/* min score */}
      <div className="px-8">
        <InputButton
          label={t("professor.quizes.QuizMinScore")}
          type={"plus-minus"}
          max_width=""
        />
      </div>
    </div>
  );
}
