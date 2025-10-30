"use client";

import { ChevronLeft, ChevronRight, Haze } from "lucide-react";
import Logo from "../logo/logo";
import Button from "../ui/button";
import { LessonHeaderProps } from "@/types/lessonHeader";
import HeaderTitle from "./headerTitle";

export default function LessonHeader({
  chapter_name,
  lesson_name,
  callback = () => {},
  lessonData,
  chapterData,
  moduleData,
  isRTL
}: LessonHeaderProps) {
  return (
    <div
      className="w-full px-3 rounded-full border-0 md:border-[3px] border-primary-300 bg-neutral-100 
    flex justify-between items-center lg:gap-0 gap-3"
    dir={isRTL ? "rtl" : "ltr"}
    >
      {/* left */}
      <div className="flex items-center gap-4">
        {/* logo */}
        <Logo color={"text-primary-300"} width={90} height={90} />
        {/* title and button */}
        <div className="hidden md:flex">
          <HeaderTitle
            chapter_name={chapter_name}
            lesson_name={lesson_name}
            isRTL={isRTL}
          />
        </div>
      </div>
      {/* right */}
      <div className="hidden md:flex lg:w-72 w-64">
        <Button
          state={"filled"}
          size={"M"}
          text={"Take Quiz"}
          icon_position={"none"}
          onClick={callback}
        />
      </div>
    </div>
  );
}
