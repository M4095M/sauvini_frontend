import { QuizPopupProps } from "@/types/quizPopup";
import Button from "../ui/button";

export default function QuizPopup({ onClose, onAccept }: QuizPopupProps) {
  return (
    <div className="max-w-[670px] min-w-96 w-full bg-neutral-100 rounded-3xl py-11 px-11 
    flex flex-col gap-14">
      {/* info */}
      <div className="flex flex-col gap-4">
        {/* header */}
        <div className="">
          <p className="text-base font-medium text-neutral-400">Ready to take the quiz for this lesson?</p>
          <p className="text-2xl font-semibold text-primary-600">Derivatives Quiz</p>
        </div>
        {/* details */}
        <div className="flex">
          <span className="text-sm text-neutral-300 font-normal">10 questions</span>
          <span className="text-sm text-neutral-300 font-normal">Estimated time: 5 minutes</span>
        </div>
      </div>
      {/* buttons */}
      <div className="flex gap-3.5">
        <Button state={"tonal"} size={"M"} icon_position={"none"} text="Continue course" onClick={onClose} />
        <Button state={"filled"} size={"M"} icon_position={"none"} text="Take Quiz" onClick={onAccept} />
      </div>
    </div>
  )
}