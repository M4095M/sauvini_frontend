"use client";

import { InputButtonProps } from "@/types/inputButton";
import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";

export default function InputButton({
  label,
  type,
  icon,
  icon_position,
  icon_filled = false,
  max_width = "max-w-xl"
}: InputButtonProps) {
  const [counter, setCounter] = useState(0);
  const inputRef = useRef(null);

  const returnButton = (type: string) => {
    switch (type) {
      case "icon":
        return <div className="">{icon}</div>;
      case "plus-minus":
        return (
          <div className="w-full flex flex-col justify-center items-center">
            <span
              className="font-work-sans text-primary-300 text-xl w-full text-center cursor-pointer select-none"
              onClick={() => {
                setCounter(counter + 1);
                if (inputRef.current) {
                  (inputRef.current as HTMLInputElement).value = String(
                    counter + 1
                  );
                }
              }}
            >
              +
            </span>
            {/* <div className="w-full self-start h-0.5 bg-neutral-300"></div> */}
            <span
              className="font-work-sans text-primary-300 text-xl  w-full text-center cursor-pointer select-none"
              onClick={() => {
                setCounter(counter - 1);
                if (inputRef.current && counter > 0) {
                  (inputRef.current as HTMLInputElement).value = String(
                    counter - 1
                  );
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
    <div className={`${max_width} w-full min-w-2xs shrink grow flex flex-col gap-2`}>
      <div className="font-work-sans text-neutral-600 font-normal px-4">
        {label}
      </div>
      <div
        className={`flex flex-row${
          icon_position === "left" ? "-reverse" : ""
        } w-full  items-center 
       border ${
         icon_filled ? "bg-primary-50" : "bg-white"
       }  border-neutral-200 rounded-full overflow-hidden
        text-work-sans font-normal text-base relative`}
      >
        <input
          type="text"
          className={`appearance-none outline-none p-0 m-0 shadow-none bg-white border-neutral-200
          px-5 py-3 w-full 
        text-work-sans font-normal text-base text-neutral-600`}
          ref={inputRef}
        />
        <button
          className={`px-4 ${type === "plus-minus" ? "bg-primary-50" : ""} ${
            icon_filled ? "text-primary-300" : "text-neutral-400"
          }  flex justify-center items-center`}
        >
          {returnButton(type)}
        </button>
      </div>
    </div>
  );
}
