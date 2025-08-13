<<<<<<< HEAD
"use client"

import Button from "@/components/ui/button";
import DoneIcon from "./DoneIcon";
import { useLanguage } from "@/context/LanguageContext";

export default function ApplicationSubmitted() {
  const { t, isRTL } = useLanguage();
  return (
    <div className="w-fit h-full p-10 flex flex-col justify-center items-center gap-7 mt-15 ">
      <DoneIcon color="text-success-400" width="186" height="186" />
      <span className="font-work-sans font-semibold md:text-4xl text-3xl text-success-400">
        {t("register.submission.title")}
      </span>
      <span className="font-work-sans font-medium md:text-lg text-base max-w-3xl text-neutral-400 text-center">
        {t("register.submission.description")}
=======
import Button from "@/components/ui/button";
import DoneIcon from "./DoneIcon";

export default function ApplicationSubmitted() {
  return (
    <div className="w-fit h-full p-10 flex flex-col justify-center items-center gap-7 mt-15 ">
      <DoneIcon color="text-primary-300" width="186" height="186" />
      <span className="font-work-sans font-semibold md:text-4xl text-3xl text-primary-300">
        Application Submitted
      </span>
      <span className="font-work-sans font-medium md:text-xl text-lg max-w-3xl text-neutral-400 text-center">
        Thank you for registering! Your information has been sent for review.
        You will receive a confirmation email once your account is verified.
        This may take up to a few days.
>>>>>>> origin/courses
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
