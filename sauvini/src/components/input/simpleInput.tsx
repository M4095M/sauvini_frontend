"use client";

import { SimpleInputProps } from "@/types/simpleInput";
import { forwardRef } from "react";

const SimpleInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, SimpleInputProps>(
  function SimpleInput(
    {
      label,
      value,
      type,
      long = false,
      name,
      max_width = "max-w-xl",
      max_hight = "max-h-64",
      errors,
    },
    ref
  ) {
    return (
      <div className={` ${max_width}  min-w-2xs shrink grow flex flex-col gap-2`}>
        <div className="font-work-sans text-neutral-600 font-normal px-4">
          {label}
        </div>
        {long ? (
          <textarea
            className={`appearance-none outline-[var(--primary-200)] p-0 m-0 shadow-none 
        bg-white border  px-5 py-3 rounded-3xl w-full ${max_hight} ${
              errors ? "border-red-500" : "border-neutral-200"
            } focus:border-2
        text-work-sans font-normal text-base text-neutral-600 resize-none`}
            ref={ref as any}
            name={name}
          />
        ) : (
          <input
            type={type}
            name={name}
            ref={ref as any}
            className={`appearance-none outline-[var(--primary-200)] p-0 m-0 shadow-none 
        bg-white border px-5 py-3 rounded-full w-full focus:border-2
        text-work-sans font-normal text-base text-neutral-600 ${
          errors ? "border-red-500" : "border-neutral-200"
        } ${long ? "grow" : ""}`}
          />
        )}
      </div>
    );
  }
);

export default SimpleInput;
