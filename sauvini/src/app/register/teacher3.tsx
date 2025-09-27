"use client";

import PasswordInputField from "@/components/input/passwordInput";
import SimpleInput from "@/components/input/simpleInput";
import Button from "@/components/ui/button";
import { RegisterCommonProps } from "@/types/registerCommonProps";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function TeacherPart3({
  t,
  isRTL,
  language,
  NextStep,
  PreviousStep,
  errors,
  register,
}: RegisterCommonProps) {
  console.log("rendering teacher part 3");
  return (
    <div className="w-fit h-full p-10 flex flex-col justify-center items-center gap-10 mt-15">
      {/* Header */}
      <div className="flex flex-col justify-center items-center gap-2">
        <span className="font-semibold lg:text-4xl text-neutral-600 text-center text-2xl">
          {t("register.professor.page_3.title")}
        </span>
        <span className="font-medium lg:text-xl text-neutral-400 text-center text-base">
          {t("register.professor.page_3.description")}
        </span>
      </div>
      {/* input fields */}
      <div className="flex flex-col gap-6" dir={isRTL ? "rtl" : "ltr"}>
        <SimpleInput
          label={t("register.common.email")}
          value={""}
          type={"text"}
          errors={errors?.teacher_email}
          {...register("teacher_email")}
        />
        <div className=" flex flex-row flex-wrap gap-4">
          <PasswordInputField
            label={t("register.common.password")}
            isRTL={isRTL}
            errors={errors?.teacher_password}
            {...register("teacher_password")}
          />
          <PasswordInputField
            label={t("register.common.confirm_password")}
            isRTL={isRTL}
            errors={errors?.teacher_confirmPassword}
            {...register("teacher_confirmPassword")}
          />
        </div>
      </div>
      {/* buttons */}
      <div className="flex flex-row gap-4 " dir={isRTL ? "rtl" : "ltr"}>
        <Button
          state={"outlined"}
          size={"M"}
          icon_position={isRTL ? "left" : "left"}
          text={t("register.common.previous")}
          icon={!isRTL ? <ArrowLeft /> : <ArrowRight />}
          onClick={PreviousStep}
        />
        <Button
          state={"filled"}
          size={"M"}
          icon_position={isRTL ? "right" : "right"}
          text={t("register.common.next")}
          icon={isRTL ? <ArrowLeft /> : <ArrowRight />}
          onClick={NextStep}
        />
      </div>
    </div>
  );
}
