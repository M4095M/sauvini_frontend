"use client";

import { PasswordInputProps } from "@/types/passwordInputProps";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";

export default function PasswordInputField({
  label,
  placeholder,
  ref,
  name,
  errors,
  isRTL,
}: PasswordInputProps) {
  const [show, setShow] = useState(false);
  return (
    <div className="max-w-xl min-w-2xs shrink grow flex flex-col gap-2">
      <div className="font-work-sans text-neutral-600 font-normal px-4">
        {label}
      </div>
      <div
        className={`flex flex-row w-full justify-center items-center
      bg-white border  rounded-full ${
        errors ? "border-red-500" : "border-neutral-200"
      }
        text-work-sans font-normal text-base relative`}
      >
        <input
          type={show === true ? "text" : "password"}
          className="appearance-none outline-none p-0 m-0 shadow-none 
         border-neutral-200 px-5 py-3 w-full rounded-full
        text-work-sans font-normal text-base text-neutral-600"
          name={name}
          ref={ref}
          dir={isRTL ? "rtl" : "ltr"}
        />
        <button
          className="px-4 text-neutral-400"
          onClick={() => {
            setShow(!show);
          }}
        >
          {show === true ? <EyeClosed /> : <Eye />}
        </button>
      </div>
    </div>
  );
}
