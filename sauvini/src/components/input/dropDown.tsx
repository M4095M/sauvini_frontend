"use client";

import { DropDownProps } from "@/types/dropDownProps";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function DropDown({
  label,
  placeholder,
  options = [],
  onChange,
  t,
  isRTL,
  ref,
  name,
  max_width = "max-w-xl",
  errors,
}: DropDownProps) {
  const [currentItem, setCurrentItem] = useState("");
  const [showList, setShowList] = useState(false);

  return (
    <div
      className={`${max_width} w-full min-w-2xs shrink grow flex flex-col gap-2`}
    >
      <div className="font-work-sans text-neutral-600 font-normal px-4">
        {label}
      </div>
      <div
        className={`flex flex-row w-full justify-center items-center
      bg-white border rounded-full ${
        errors ? "border-red-500" : "border-neutral-200"
      }
        text-work-sans font-normal text-base relative`}
      >
        <input
          type="text"
          value={currentItem}
          placeholder={placeholder}
          readOnly
          ref={ref}
          name={name}
          className="appearance-none outline-none p-0 m-0 shadow-none 
         border-neutral-200 px-5 py-3 w-full
        text-work-sans font-normal text-base text-neutral-600"
        />
        <button className="px-4" onClick={() => setShowList(!showList)}>
          {!showList ? (
            <ChevronDown className="text-neutral-400" />
          ) : (
            <ChevronUp className="text-neutral-400" />
          )}
        </button>
        {showList && (
          <div
            className="absolute top-[101%] bg-white border-2 border-neutral-200 rounded-2xl w-full max-h-40
            text-work-sans font-normal text-base overflow-y-auto z-1"
          >
            {options.map((option) => {
              return (
                <div
                  className="text-work-sans font-normal text-base text-primary-600 px-5 py-4 w-full hover:bg-neutral-200 cursor-pointer"
                  key={option.id}
                  onClick={() => {
                    setCurrentItem(option.text);
                    setShowList(false);
                  }}
                >
                  {option.text}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
