"use client";

import { InputButtonProps } from "@/types/inputButton";
import { ChevronDown } from "lucide-react";
import { input } from "motion/react-client";
import { useEffect, useRef, useState } from "react";

export default function InputButton({
  label,
  type,
  icon,
  icon_position,
  ref,
  name,
  icon_filled = false,
  max_width = "max-w-xl",
  onClick,
  onChange,
  errors,
}: InputButtonProps) {
  const [counter, setCounter] = useState(0);

  // Sync counter with input value for plus-minus type
  useEffect(() => {
    if (type === "plus-minus" && name) {
      const inputElement = document.querySelector(
        `input[name="${name}"]`
      ) as HTMLInputElement;
      if (inputElement) {
        const currentValue = parseInt(inputElement.value || "0") || 0;
        setCounter(currentValue);
      }
    }
  }, [type, name]);

  const returnButton = (type: string) => {
    switch (type) {
      case "icon":
        return (
          <div className="" onClick={onClick}>
            {icon}
          </div>
        );
      case "plus-minus":
        return (
          <div className="w-full flex flex-col justify-center items-center">
            <span
              className="font-work-sans text-primary-300 text-xl w-full text-center cursor-pointer select-none hover:bg-primary-100 rounded transition-colors"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                // Get the input element from the refs object
                const inputElement = document.querySelector(
                  `input[name="${name}"]`
                ) as HTMLInputElement;
                if (inputElement) {
                  const currentValue = parseInt(inputElement.value || "0") || 0;
                  const newValue = currentValue + 1;

                  inputElement.value = newValue.toString();
                  setCounter(newValue);
                  onChange?.({
                    target: { value: newValue.toString() },
                  } as React.ChangeEvent<HTMLInputElement>);
                }
              }}
            >
              +
            </span>
            {/* <div className="w-full self-start h-0.5 bg-neutral-300"></div> */}
            <span
              className="font-work-sans text-primary-300 text-xl  w-full text-center cursor-pointer select-none hover:bg-primary-100 rounded transition-colors"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                // Get the input element from the refs object
                const inputElement = document.querySelector(
                  `input[name="${name}"]`
                ) as HTMLInputElement;
                if (inputElement) {
                  const currentValue = parseInt(inputElement.value || "0") || 0;
                  const newValue = Math.max(0, currentValue - 1);

                  inputElement.value = newValue.toString();
                  setCounter(newValue);
                  onChange?.({
                    target: { value: newValue.toString() },
                  } as React.ChangeEvent<HTMLInputElement>);
                }
              }}
            >
              -
            </span>
          </div>
        );
      case "number-input":
        return (
          <div className="w-full flex flex-col justify-center items-center">
            <span
              className="font-work-sans text-primary-300 text-xl w-full text-center cursor-pointer select-none hover:bg-primary-100 rounded transition-colors"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                // Get the input element from the refs object
                const inputElement = document.querySelector(
                  `input[name="${name}"]`
                ) as HTMLInputElement;
                if (inputElement) {
                  const currentValue = parseInt(inputElement.value || "0") || 0;
                  const newValue = currentValue + 1;

                  inputElement.value = newValue.toString();
                  onChange?.({
                    target: { value: newValue.toString() },
                  } as React.ChangeEvent<HTMLInputElement>);
                }
              }}
            >
              +
            </span>
            <span
              className="font-work-sans text-primary-300 text-xl w-full text-center cursor-pointer select-none hover:bg-primary-100 rounded transition-colors"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                // Get the input element from the refs object
                const inputElement = document.querySelector(
                  `input[name="${name}"]`
                ) as HTMLInputElement;
                if (inputElement) {
                  const currentValue = parseInt(inputElement.value || "0") || 0;
                  const newValue = Math.max(0, currentValue - 1);

                  inputElement.value = newValue.toString();
                  onChange?.({
                    target: { value: newValue.toString() },
                  } as React.ChangeEvent<HTMLInputElement>);
                }
              }}
            >
              -
            </span>
          </div>
        );

      default:
        break;
    }
  };

  return (
    <div
      className={`${max_width} w-full min-w-2xs shrink grow flex flex-col gap-2`}
    >
      <div className="font-work-sans text-neutral-600 font-normal px-4">
        {label}
      </div>
      <div
        className={`flex flex-row${
          icon_position === "left" ? "-reverse" : ""
        } w-full  items-center 
       border ${
         icon_filled ? "bg-primary-50" : "bg-white"
       } rounded-full overflow-hidden ${
          errors ? "border-red-500" : "border-neutral-200 "
        }
        text-work-sans font-normal text-base relative`}
      >
        <input
          type={type === "number-input" ? "number" : "text"}
          className={`appearance-none outline-none p-0 m-0 shadow-none bg-white border-neutral-200
          px-5 py-3 w-full 
        text-work-sans font-normal text-base text-neutral-600
        ${
          type === "number-input"
            ? "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
            : ""
        }`}
          ref={ref as React.RefObject<HTMLInputElement>}
          name={name}
          readOnly={type === "plus-minus"}
          value={type === "plus-minus" ? counter : undefined}
          onChange={onChange}
          min={type === "number-input" ? "0" : undefined}
          max={type === "number-input" ? "50" : undefined}
          placeholder={type === "number-input" ? "0" : undefined}
          onKeyDown={(e) => {
            // Disable arrow keys for number input to prevent built-in increment/decrement
            if (
              type === "number-input" &&
              (e.key === "ArrowUp" || e.key === "ArrowDown")
            ) {
              e.preventDefault();
            }
          }}
        />
        <div
          className={`px-4 ${
            type === "plus-minus" || type === "number-input"
              ? "bg-primary-50"
              : ""
          } ${
            icon_filled ? "text-primary-300" : "text-neutral-400"
          }  flex justify-center items-center`}
        >
          {returnButton(type)}
        </div>
      </div>
      <div className="h-6 flex items-start">
        {errors && (
          <div className="px-4 text-red-500 text-sm font-medium animate-in fade-in-0 slide-in-from-top-1 duration-200 leading-tight">
            {errors}
          </div>
        )}
      </div>
    </div>
  );
}
