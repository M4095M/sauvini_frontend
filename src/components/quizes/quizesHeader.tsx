import Logo from "../logo/logo";
import MinScore from "./minScore";

type QuizesHeaderProps = {
  title: string;
  questions_num: string;
  isRTL: boolean;
};

export default function QuizesHeader({ title, questions_num, isRTL }: QuizesHeaderProps) {
  return (
    <div
      className="w-full px-20 py-7 flex flex-row justify-between items-center bg-neutral-100 rounded-full"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* left part */}
      <div className="flex items-center gap-4">
        <Logo color={"text-primary-600"} width={79} height={90} />
        <div className="flex flex-col">
          <span className="text-primary-600 font-semibold text-4xl">
            {title}
          </span>
          <span className="text-neutral-400 text-base font-normal">
            {questions_num} questions
          </span>
        </div>
      </div>
      {/* right part */}
      <MinScore />
    </div>
  );
}
