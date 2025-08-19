"use client"

import { useState } from "react";

type checkBoxProps = {
  isChecked: boolean;
};

export default function checkBox({ isChecked }: checkBoxProps) {
  const [Checked, setChecked] = useState(isChecked)
  return (
    <div
      className={`w-[18px] h-[18px] border-2 border-primary-300 rounded-[2px] flex justify-center items-center ${
        Checked ? "bg-primary-300" : "bg-white"
      }`}
      onClick={() => setChecked(!Checked)}
    >
      {Checked && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M10 16.4L6 12.4L7.4 11L10 13.6L16.6 7L18 8.4L10 16.4Z"
            fill="white"
          />
        </svg>
      )}
    </div>
  );
}
