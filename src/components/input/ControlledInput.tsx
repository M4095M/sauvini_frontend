"use client";

import { ChangeEvent } from "react";

export interface ControlledInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  max_width?: string;
  long?: boolean;
  max_height?: string;
}

export default function ControlledInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  error,
  disabled = false,
  max_width = "max-w-xl",
  long = false,
  max_height = "max-h-64",
}: ControlledInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`${max_width} min-w-2xs shrink grow flex flex-col gap-1`}>
      {/* Label */}
      <div className="font-work-sans text-neutral-600 font-normal text-sm px-4">
        {label}
      </div>

      {/* Input or Textarea */}
      {long ? (
        <textarea
          className={`appearance-none outline-[var(--primary-200)] p-0 m-0 shadow-none 
            bg-white border px-5 py-3 rounded-3xl w-full ${max_height} ${
            error ? "border-red-500" : "border-neutral-200"
          } focus:border-2
            text-work-sans font-normal text-base text-neutral-600 resize-none`}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`appearance-none outline-[var(--primary-200)] p-0 m-0 shadow-none 
            bg-white border px-5 py-3 rounded-full w-full focus:border-2
            text-work-sans font-normal text-base text-neutral-600 ${
            error ? "border-red-500" : "border-neutral-200"
          }`}
        />
      )}

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm mt-1 px-4">{error}</p>
      )}
    </div>
  );
}
