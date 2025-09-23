"use client";
import { useEffect, useState } from "react";
import RadioQuestion from "./radioButtonQuestion";

type RadionButtonGroupProps = {
  options: string[];
  name: string;
  ref: any;
  isRTL?: boolean;
};

export default function RadioButtonGroup({
  options,
  name,
  ref,
  isRTL = false,
}: RadionButtonGroupProps) {
  const [selectedOption, setSelectedOption] = useState<number>(-1);

  return (
    <div className="flex flex-col gap-3 w-full">
      <input
        type="text"
        className="hidden"
        name={name}
        ref={ref}
        readOnly
        value={selectedOption !== null && options[selectedOption] ? options[selectedOption] : ""}
      />
      {options.map((option, index) => (
        <RadioQuestion
          key={index}
          option={option}
          isRTL={isRTL}
          id={index}
          state={selectedOption === index}
          onCheck={(selected_index: number) => {
            setSelectedOption(selected_index);
          }}
        />
      ))}
    </div>
  );
}
