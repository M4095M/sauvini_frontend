import { optgroup } from "motion/react-client";
import CheckBoxQuestion from "./checkBoxQuestion";
import { useState } from "react";

type CheckBoxGroupProps = {
  options?: string[];
  isRTL: boolean;
};

export default function CheckBoxGroup({ options, isRTL }: CheckBoxGroupProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  return (
    <div className="flex flex-col gap-3 w-full">
      {options?.map((option, index) => {
        return (
          <CheckBoxQuestion
            key={index}
            option={option}
            isRTL={isRTL}
            state={false}
            onChange={(isChecked: boolean) => {
              if (isChecked) {
                setSelectedOptions([...selectedOptions, option]);
              } else {
                setSelectedOptions(
                  selectedOptions.filter((opt) => opt !== option)
                );
              }
            }}
          />
        );
      })}
    </div>
  );
}
