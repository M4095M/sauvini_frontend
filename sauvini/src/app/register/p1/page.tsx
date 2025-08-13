"use client";

import DropDown from "@/components/input/dropDown";
import InputButton from "@/components/input/InputButton";
import SimpleInput from "@/components/input/simpleInput";
import TwoOptionRadio from "@/components/input/twoOptionRadio";
import Button from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowLeft, ArrowRight, Calendar, Calendar1, Phone } from "lucide-react";

export default function Register3() {
  const { t, isRTL } = useLanguage();
  return (
    <div className="w-fit h-full p-10 flex flex-col justify-center items-center gap-10 mt-15">
      {/* Header */}
      <div className="flex flex-col justify-center items-center gap-2">
        <span className="font-work-sans font-semibold lg:text-4xl text-neutral-600 text-center text-2xl">
          {t("register.professor.page_1.title")}
        </span>
        <span className="font-work-sans font-medium lg:text-xl text-neutral-400 text-center text-base">
          {t("register.professor.page_1.description")}
        </span>
      </div>
      {/* input fields */}
      <div className="flex flex-col gap-6" dir={isRTL ? "rtl" : "ltr"}>
        <div className="flex flex-row flex-wrap gap-4">
          <SimpleInput label={t("register.common.firstname")} value={""} type="text" />
          <SimpleInput label={t("register.common.lastname")} value={""} type="text" />
        </div>
        <TwoOptionRadio
          label={t("register.common.gender")}
          required={true}
          firstOption={t("register.common.male")}
          secondOption={t("register.common.Female")}
        />
        <InputButton
          label={t("register.common.date_of_birth")}
          type="icon"
          icon={<Calendar />}
          icon_position="right"
          icon_filled={true}
        />
        <DropDown label={t("register.common.Wilaya")} t={t} isRTL={isRTL} />
        <InputButton
          label={t("register.common.phone")}
          type="icon"
          icon={<Phone />}
          icon_position="left"
        />
      </div>
      {/* buttons */}
      <div className="flex flex-row gap-4 ">
        <Button
          state={"outlined"}
          size={"M"}
          icon_position={"left"}
          text="Previous"
          icon={<ArrowLeft />}
        />
        <Button
          state={"filled"}
          size={"M"}
          icon_position={"right"}
          text="Next"
          icon={<ArrowRight />}
        />
      </div>
    </div>
  );
}
