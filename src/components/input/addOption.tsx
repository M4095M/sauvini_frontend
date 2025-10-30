"use client";

import { useRef, useState } from "react";
import Button from "../ui/button";
import { Plus } from "lucide-react";

export type AddOptionProps = {
  label?: string;
  placeholder?: string;
  readOnly?: boolean;
  icon?: any;
  onClick?: (module_name: string) => void;
};

export default function AddOption({
  label,
  placeholder,
  readOnly = false,
  icon,
  onClick = () => {},
}: AddOptionProps) {
  const [shwoInput, setShowInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full px-10 py-3 rounded-full text-base bg-white border border-neutral-200 hover:border-primary-300 flex gap-4 items-center justify-between">
      {/* text */}
      <input
        type="text"
        ref={inputRef}
        readOnly={readOnly}
        placeholder={placeholder || "Add Option"}
        className="appearance-none border-none outline-none bg-transparent p-0 m-0 shadow-none focus:ring-0 focus:outline-none
        text-neutral-600 font-normal grow"
        onChange={() => {
          if (inputRef.current?.value !== "") {
            setShowInput(true);
          } else {
            setShowInput(false);
          }
        }}
      />
      {/* button: SHOW ONLY WHEN INPUT IS NOT EMPTY */}
      {shwoInput && (
        <div className="">
          <Button
            state={"text"}
            size={"XS"}
            icon_position={"icon-only"}
            icon={icon}
            onClick={() => {
              if (inputRef.current?.value) {
                onClick(inputRef.current?.value);
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
