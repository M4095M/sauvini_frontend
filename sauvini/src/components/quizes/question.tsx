import CheckBoxQuestion from "./checkBoxQuestion";
import RadioQuestion from "./radioButtonQuestion";

type QuestionProps = {
  number: string;
  question: string;
  options: string[];
  image?: string | undefined;
  checkbox: boolean;
  isRTL: boolean;
};

export default function Question({
  number,
  question,
  options,
  checkbox,
  image = undefined,
  isRTL,
}: QuestionProps) {
  return (
    <div
      className="flex flex-col gap-10 px-5 py-20"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="text-2xl font-medium text-primary-400">
        Question {number}
      </div>
      <div className="text-xl text-primary-600 font-medium">{question}</div>
      {image && (
        <div className="w-full h-64 bg-neutral-200 border-4 border-primary-400 rounded-3xl"></div>
      )}
      <div className="flex flex-col gap-3">
        {options.map((option) => {
          if (checkbox) {
            return (
              <CheckBoxQuestion key={option} option={option} isRTL={isRTL} />
            );
          } else {
            return <RadioQuestion key={option} option={option} isRTL={isRTL} />;
          }
        })}
      </div>
    </div>
  );
}
