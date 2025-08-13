"use client";

import DropDown from "@/components/input/dropDown";
import InputButton from "@/components/input/InputButton";
import SimpleInput from "@/components/input/simpleInput";
import Button from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowLeft, ArrowRight, Phone } from "lucide-react";

export default function registerPart1() {
  const { t, isRTL } = useLanguage();
  return (
    <div className="w-fit h-full p-10 flex flex-col justify-center items-center gap-10 mt-15">
      {/* Header */}
      <div className="flex flex-col justify-center items-center gap-2">
        <span className="font-work-sans font-semibold lg:text-4xl text-neutral-600 text-center text-2xl">
          {t("register.student.page_1.title")}
        </span>
        <span className="font-work-sans font-medium lg:text-xl text-neutral-400 text-center text-base">
          {t("register.student.page_1.description")}
        </span>
      </div>
      {/* input fields */}
      <div className="flex flex-col gap-6" dir={isRTL ? "rtl" : "ltr"}>
        <div className="flex flex-row flex-wrap gap-4">
<<<<<<< HEAD
          <SimpleInput label={t("register.common.firstname")} value={"firstname"} type="text" />
          <SimpleInput label={t("register.common.lastname")} value={"lastname"} type="text" />
        </div>
        <DropDown label={t("register.common.Wilaya")} t={t}  />
        <InputButton
          label={t("register.common.phone")}
          type="icon"
          icon={<Phone />}
          icon_position="left"
        />
=======
          <SimpleInput label={"Firstname"} value={"firstname"} type="text" />
          <SimpleInput label={"Lastname"} value={"lastname"} type="text" />
        </div>
        <SimpleInput label={"Wilaya"} value={"Wilaya"} type="text" />
        <SimpleInput label={"Phone number"} value={"phonenumber"} type="text" />
>>>>>>> origin/courses
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
