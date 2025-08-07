import { RadioButtonProps } from "@/types/radio-button";
import React from "react";

export default function RadioButton({ state, onClick }: RadioButtonProps) {
  return (
    <div className="relative flex justify-end items-center m-4">
      <label className="cursor-pointer">
        <input
          type="radio"
          name="role"
          value={state}
          className="peer hidden sr-only"
          checked={state === "clicked"}
          onChange={onClick}
          readOnly
        />
        <div
          className={`rounded-[50%] w-5 h-5 border-2 transition-all duration-200 flex justify-center items-center
            ${circleColor(state)}
            peer-checked:border-primary-300 peer-checked:bg-primary-100
            peer-hover:border-primary-200 peer-hover:bg-neutral-100
            peer-focus:ring-2 peer-focus:ring-primary-200 peer-focus:ring-offset-1
          `}
        >
          {/* Inner dot for checked state */}
          <div
            className={`rounded-[50%] w-2 h-2 transition-all duration-200
              ${state === "clicked" ? `bg-primary-300` : `bg-transparent`}
            `}
          />
        </div>
      </label>
    </div>
  );
}

function circleColor(state: string) {
  switch (state) {
    case "hover":
      return `border-prmimary-300`;
    case "clicked":
      return `border-primary-300`;
    default:
      return `border-black bg-white`;
  }
}
