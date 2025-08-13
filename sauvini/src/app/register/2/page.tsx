"use client";

import PasswordInputField from "@/components/input/passwordInput";
import SimpleInput from "@/components/input/simpleInput";
import Button from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Register2() {
  const { t, isRTL } = useLanguage();
  return (
    <div className="w-fit h-full p-10 flex flex-col justify-center items-center gap-10 mt-15">
      {/* Header */}
      <div className="flex flex-col justify-center items-center gap-2">
        <span className="font-work-sans font-semibold lg:text-4xl text-neutral-600 text-center text-2xl">
          {t("register.student.page_2.title")}
        </span>
        <span className="font-work-sans font-medium lg:text-xl text-neutral-400 text-center text-base">
          {t("register.student.page_2.description")}
        </span>
      </div>
      {/* input fields */}
      <div className="flex flex-col gap-6" dir={isRTL ? "rtl" : "ltr"}>
        <SimpleInput
          label={t("register.common.Academic_stream")}
          value={""}
          type="text"
        />
        <SimpleInput label={t("register.common.email")} value={""} type="text" />
        <div className="flex flex-row flex-wrap gap-4">
          {/* <SimpleInput label={"Password"} value={""} type="password" /> */}
          {/* <SimpleInput label={"Confirm password"} value={""} type="password" /> */}
          <PasswordInputField label={t("register.common.password")} />
          <PasswordInputField label={t("register.common.confirm_password")} />
        </div>
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
