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
          Let’s Get to Know You
        </span>
        <span className="font-work-sans font-medium lg:text-xl text-neutral-400 text-center text-base">
          We’ll start with your basic information.
        </span>
      </div>
      {/* input fields */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-row flex-wrap gap-4">
          <SimpleInput label={"Firstname"} value={""} type="text" />
          <SimpleInput label={"Lastname"} value={""} type="text" />
        </div>
        <TwoOptionRadio
          label={"Gender"}
          required={true}
          firstOption={"Male"}
          secondOption={"Female"}
        />
        <InputButton
          label={"Date of Birth"}
          type="icon"
          icon={<Calendar />}
          icon_position="right"
          icon_filled={true}
        />
        <DropDown label="Wilaya" t={t} isRTL={isRTL} />
        <InputButton
          label={"Phone number"}
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
