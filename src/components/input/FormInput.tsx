"use client";

import React from "react";

interface FormInputProps {
  label: string;
  value: string;
  type: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function FormInput({
  label,
  value,
  type,
  onChange,
  error,
  placeholder,
  disabled = false,
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-work-sans text-neutral-600 font-normal px-4">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`appearance-none outline-[var(--primary-200)] p-0 m-0 shadow-none 
          bg-white border px-5 py-3 rounded-3xl w-full ${
            error ? "border-red-500" : "border-neutral-200"
          } focus:border-2
          text-work-sans font-normal text-base text-neutral-600`}
      />
      {error && <p className="text-red-500 text-sm px-4">{error}</p>}
    </div>
  );
}
