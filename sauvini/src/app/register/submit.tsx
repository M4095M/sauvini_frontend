"use client";

import Button from "@/components/ui/button";
import DoneIcon from "./DoneIcon";
import { useLanguage } from "@/context/LanguageContext";
import { RegisterCommonProps } from "@/types/registerCommonProps";

export default function ApplicationSubmitted({
  t,
  isRTL,
  language,
  NextStep,
  PreviousStep,
}: RegisterCommonProps) {
  return (
    <div className="w-fit h-full p-10 flex flex-col justify-center items-center gap-7 mt-15 ">
      <DoneIcon color="text-success-400" width="186" height="186" />
      <span className="font-semibold md:text-4xl text-3xl text-success-400">
        {t("register.submission.title")}
      </span>
      <span className="font-medium md:text-lg text-base max-w-3xl text-neutral-400 text-center">
        {t("register.submission.description")}
      </span>
      <div className="max-w-80 ">
        <Button
          state={"tonal"}
          size={"M"}
          icon_position={"none"}
          text="Return home"
        />
      </div>
    </div>
  );
}
