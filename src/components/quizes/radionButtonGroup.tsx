"use client";
import { useEffect, useState } from "react";
import RadioQuestion from "./radioButtonQuestion";

type RadionButtonGroupProps = {
  options: string[];
  name: string;
  ref: any;
  isRTL?: boolean;
  errors?: string;
  onChange?: (value: string) => void;
};

export default function RadioButtonGroup({
  options,
  name,
  ref,
  isRTL = false,
  errors,
  onChange,
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
        value={
          selectedOption !== null && options[selectedOption]
            ? options[selectedOption]
            : ""
        }
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
            if (onChange && options[selected_index]) {
              onChange(options[selected_index]);
            }
          }}
        />
      ))}
      <div className="h-6 flex items-start">
        {errors && (
          <div className="px-4 text-red-500 text-sm font-medium animate-in fade-in-0 slide-in-from-top-1 duration-200 leading-tight">
            {errors}
          </div>
        )}
      </div>
    </div>
  );
}
