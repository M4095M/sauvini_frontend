import { ChevronLeft } from "lucide-react";
import Button from "../ui/button";

type HeaderTitleProps = {
  chapter_name: string;
  lesson_name: string;
  goBackCallback?: () => void;
};

export default function HeaderTitle({
  chapter_name,
  lesson_name,
  goBackCallback,
}: HeaderTitleProps) {
  return (
    <div className="flex gap-4 w-fit h-fit ">
      {/* button */}
      <div className="flex justify-center items-center">
        <Button
          state={"tonal"}
          size={"XS"}
          icon_position={"icon-only"}
          icon={<ChevronLeft />}
          optionalStyles="text-neutral-400 bg-neutral-200"
          onClick={goBackCallback}
        />
      </div>
      {/* title */}
      <div className="flex flex-col w-full ">
        <span className="font-medium lg:text-xl text-lg text-neutral-400 whitespace-nowrap ">
          {chapter_name}
        </span>
        <span className="font-semibold xl:text-4xl lg:text-3xl text-xl text-primary-600 whitespace-nowrap">
          {lesson_name}
        </span>
      </div>
    </div>
  );
}
