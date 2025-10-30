"use client";

import { SimpleInputProps } from "@/types/simpleInput";
import { forwardRef } from "react";

const SimpleInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  SimpleInputProps
>(function SimpleInput(
  {
    label,
    value,
    defaultValue,
    onChange,
    type,
    long = false,
    name,
    max_width = "max-w-xl",
    max_hight = "max-h-64",
    errors,
  },
  ref
) {
  // Determine if this is a controlled component
  const isControlled = value !== undefined;

  // Common props for both input and textarea
  const commonProps = {
    ref: ref as any,
    name,
    className: long
      ? `appearance-none outline-[var(--primary-200)] p-0 m-0 shadow-none 
        bg-white border  px-5 py-3 rounded-3xl w-full ${max_hight} ${
          errors ? "border-red-500" : "border-neutral-200"
        } focus:border-2
        text-work-sans font-normal text-base text-neutral-600 resize-none`
      : `appearance-none outline-[var(--primary-200)] p-0 m-0 shadow-none 
        bg-white border px-5 py-3 rounded-full w-full focus:border-2
        text-work-sans font-normal text-base text-neutral-600 ${
          errors ? "border-red-500" : "border-neutral-200"
        } ${long ? "grow" : ""}`,
  };

  return (
    <div className={` ${max_width}  min-w-2xs shrink grow flex flex-col gap-2`}>
      <div className="font-work-sans text-neutral-600 font-normal px-4">
        {label}
      </div>
      {long ? (
        <textarea
          {...commonProps}
          {...(isControlled
            ? { value: value || "", onChange }
            : { defaultValue: defaultValue || "" })}
        />
      ) : (
        <input
          type={type}
          {...commonProps}
          {...(isControlled
            ? { value: value || "", onChange }
            : { defaultValue: defaultValue || "" })}
        />
      )}
      <div className="h-6 flex items-start">
        {errors && (
          <div className="px-4 text-red-500 text-sm font-medium animate-in fade-in-0 slide-in-from-top-1 duration-200 leading-tight">
            {errors}
          </div>
        )}
      </div>
    </div>
  );
});

export default SimpleInput;
