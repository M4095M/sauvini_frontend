import { AuthRoleCardProps } from "@/types/auth-role-card";
import RadioButton from "../ui/radio-button";
import { Check } from "lucide-react";
import { useState } from "react";

export default function AuthRoleCard({
  user,
  benefits,
  icon,
}: AuthRoleCardProps) {
  const [selected, setSelected] = useState(false);
  return (
    <div
      className={`max-w-72 w-full min-w-44 h-52 rounded-3xl flex flex-col  cursor-pointer transition-all duration-200
        hover:shadow-[0px_4px_9px_0px_rgba(0,0,0,0.1)]
        active:bg-second01-100 active:border-primary-300 
        ${
          selected
            ? "border-2 border-primary-300 bg-neutral-200 hover:bg-neutral-300"
            : "bg-neutral-100 border border-neutral-300 hover:bg-white"
        }`}
      onClick={() => setSelected(!selected)}
    >
      <RadioButton state={selected ? "clicked" : "default"} onClick={undefined}/>
      <div className="flex flex-col gap-4 justify-center items-start ml-6 ">
        <div className="flex justify-center items-center gap-2">
          <span className="w-10 h-10 rounded-[50%] bg-second01-100 flex justify-center items-center text-second01-200">
            {icon}
          </span>
          <span className="font-work-sans font-medium md:text-2xl text-xl text-primary-500">
            {user}
          </span>
        </div>
        <div className="flex flex-col justify-center items-start gap-3">
          {benefits.map((benefit) => {
            return (
              <div
                className="flex justify-center items-center gap-2"
                key={benefit}
              >
                <span className="text-green-600 w-4 h-4">
                  <Check className="w-4 h-4" />
                </span>
                <span className="font-work-sans md:text-xs text-xs text-neutral-600">
                  {benefit}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
