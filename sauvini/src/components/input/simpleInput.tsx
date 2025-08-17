"use client";

import { SimpleInputProps } from "@/types/simpleInput";
import { useRef } from "react";

export default function SimpleInput({
  label,
  value,
  type,
  long = false,
}: SimpleInputProps) {
  const firstName = useRef<HTMLInputElement>(null);
  return (
    <div className="max-w-xl min-w-2xs shrink grow flex flex-col gap-2">
      <div className="font-work-sans text-neutral-600 font-normal px-4">
        {label}
      </div>
      {long ? (
        <textarea
          className={`appearance-none outline-[var(--primary-200)] p-0 m-0 shadow-none 
        bg-white border border-neutral-200 px-5 py-3 rounded-3xl w-full max-h-64 focus:border-2
        text-work-sans font-normal text-base text-neutral-600`}
        />
      ) : (
        <input
          type={type}
          name={value}
          ref={firstName}
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
