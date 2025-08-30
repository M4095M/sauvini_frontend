"use client";

import InputButton from "@/components/input/InputButton";
import TwoOptionRadio from "@/components/input/twoOptionRadio";
import Button from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { RegisterCommonProps } from "@/types/registerCommonProps";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function TeacherPart2({
  t,
  isRTL,
  language,
  NextStep,
  PreviousStep,
}: RegisterCommonProps) {
  return (
    <div className="w-fit h-full p-10 flex flex-col justify-center items-center gap-10 mt-15">
      {/* Header */}
      <div className="flex flex-col justify-center items-center gap-2">
        <span className="font-semibold lg:text-4xl text-neutral-600 text-center text-2xl">
          {t("register.professor.page_2.title")}
        </span>
        <span className="font-medium lg:text-xl text-neutral-400 text-center text-base">
          {t("register.professor.page_2.description")}
        </span>
      </div>
      {/* input fileds */}
      <div
        className="flex flex-col gap-6 w-full justify-start items-start"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <TwoOptionRadio
          label={t("register.professor.page_2.questions.q_1")}
          required={false}
          firstOption={"Yes"}
          secondOption={"No"}
        />
        <TwoOptionRadio
          label={t("register.professor.page_2.questions.q_2")}
          required={false}
          firstOption={"Yes"}
          secondOption={"No"}
        />
        <InputButton
          label={t("register.professor.page_2.questions.q_3")}
          type={"plus-minus"}
        />
        <TwoOptionRadio
          label={t("register.professor.page_2.questions.q_4")}
          required={false}
          firstOption={"Yes"}
          secondOption={"No"}
        />
        <div className="w-full flex flex-row justify-center items-center ">
          <span className="font-normal text-base text-neutral-600 grow">
            {t("register.professor.page_2.questions.q_5")}
          </span>
          <div className="grow-0">
            <Button
              state={"outlined"}
              size={"M"}
              icon_position={"none"}
              text={t("register.common.upload")}
            />
          </div>
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
