"use client"

import { twoOptionRadioProps } from "@/types/twoOptionRadioProps";
import RadioButton from "../ui/radio-button";
import React from "react";

export default function TwoOptionRadio({
  label,
  required,
  firstOption,
  secondOption,
}: twoOptionRadioProps) {
  const [selectedOption, setSelectedOption] = React.useState<
    "first" | "second"
  >("first");

  return (
    <div className="flex flex-col gap-2 justify-start items-start">
      <div className="font-work-sans text-base font-normal">
        {label}
        <span className="text-red-500">{required ? "*" : ""}</span>
      </div>
      {/* radio options */}
      <div className="flex flex-col justify-start items-start">
        <div className="flex flex-row justify-center items-center ">
          <RadioButton
            state={selectedOption === "first" ? "clicked" : "default"}
            onClick={() => setSelectedOption("first")}
          />
          <span className="font-work-sans font-normal text-base">
            {firstOption}
          </span>
        </div>
        <div className="flex flex-row justify-center items-center">
          <RadioButton
            state={selectedOption === "second" ? "clicked" : "default"}
            onClick={() => setSelectedOption("second")}
          />
          <span className="font-work-sans font-normal text-base">
            {secondOption}
          </span>
        </div>
      </div>
    </div>
  );
}
