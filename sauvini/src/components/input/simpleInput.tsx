"use client";

import { SimpleInputProps } from "@/types/simpleInput";
import { useRef } from "react";

export default function SimpleInput({
  label,
  value,
  type,
  long = false,
  ref,
  name,
  max_width = "max-w-xl",
  max_hight = "max-h-64",
}: SimpleInputProps) {
  const firstName = useRef<HTMLInputElement>(null);
  return (
    <div className={` ${max_width}  min-w-2xs shrink grow flex flex-col gap-2`}>
      <div className="font-work-sans text-neutral-600 font-normal px-4">
        {label}
      </div>
      {long ? (
        <textarea
          className={`appearance-none outline-[var(--primary-200)] p-0 m-0 shadow-none 
        bg-white border border-neutral-200 px-5 py-3 rounded-3xl w-full ${max_hight}  focus:border-2
        text-work-sans font-normal text-base text-neutral-600 resize-none`}
          ref={ref}
          name={name}
        />
      ) : (
        <input
          type={type}
          name={name}
          ref={ref}
          className={`appearance-none outline-[var(--primary-200)] p-0 m-0 shadow-none 
        bg-white border border-neutral-200 px-5 py-3 rounded-full w-full focus:border-2
        text-work-sans font-normal text-base text-neutral-600 ${
          long ? "grow" : ""
        }`}
        />
      )}
    </div>
  );
}
