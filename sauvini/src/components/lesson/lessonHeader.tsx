"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Logo from "../logo/logo";
import Button from "../ui/button";
import { LessonHeaderProps } from "@/types/lessonHeader";

export default function LessonHeader({
  chapter_name,
  lesson_name,
  callback = () => {},
  lessonData,
  chapterData,
  moduleData,
}: LessonHeaderProps) {
  return (
    <div
      className="w-full px-3 rounded-full border-[3px] border-primary-300 bg-neutral-100 
    flex justify-between items-center"
    >
      {/* left */}
      <div className="flex items-center gap-4">
        {/* logo */}
        <Logo color={"text-primary-300"} width={90} height={90} />
        {/* title and button */}
        <div className="flex gap-4 w-fit h-fit ">
          {/* button */}
          <div className="flex justify-center items-center">
            <Button
              state={"tonal"}
              size={"XS"}
              icon_position={"icon-only"}
              icon={<ChevronLeft />}
              optionalStyles="text-neutral-400 bg-neutral-200"
            />
          </div>
          {/* title */}
          <div className="flex flex-col w-full ">
            <span className="font-medium text-xl text-neutral-400 whitespace-nowrap ">
              {chapter_name}
            </span>
            <span className="font-semibold text-4xl text-primary-600 whitespace-nowrap">
              {lesson_name}
            </span>
          </div>
        </div>
      </div>
      {/* right */}
      <div className="w-72">
        <Button
          state={"filled"}
          size={"M"}
          text={"Take Quiz"}
          icon={<ChevronRight />}
          icon_position={"right"}
          onClick={callback}
        />
      </div>
    </div>
  );
}
