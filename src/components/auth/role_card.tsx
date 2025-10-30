"use client";

import { AuthRoleCardProps } from "@/types/auth-role-card";
import RadioButton from "../ui/radio-button";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

export default function AuthRoleCard({
  user,
  icon,
  t,
  isRTL,
  language,
  onClick = () => {},
}: AuthRoleCardProps) {
  const [selected, setSelected] = useState(false);
  const [benefits, setBenefits] = useState<string[] | undefined>(undefined);

  useEffect(() => {
    if (user === "student") {
      setBenefits([
        t("register.cards.role.student.benefit_1"),
        t("register.cards.role.student.benefit_2"),
        t("register.cards.role.student.benefit_3"),
      ]);
    } else {
      setBenefits([
        t("register.cards.role.professor.benefit_1"),
        t("register.cards.role.professor.benefit_2"),
        t("register.cards.role.professor.benefit_3"),
      ]);
    }
  }, [language]);

  return (
    <div
      className={`max-w-72 w-full min-w-48 h-52 rounded-3xl flex flex-col  cursor-pointer transition-all duration-200
        hover:shadow-[0px_4px_9px_0px_rgba(0,0,0,0.1)]
        active:bg-second01-100 active:border-primary-300 
        ${
          selected
            ? "border-2 border-primary-300 bg-neutral-200 hover:bg-neutral-300"
            : "bg-neutral-100 border border-neutral-300 hover:bg-white"
        }`}
      onClick={() => {
        setSelected(!selected);
        onClick(user)
      }}
    >
      <RadioButton
        state={selected ? "clicked" : "default"}
        onClick={undefined}
      />
      <div
        className={`flex flex-col gap-4 justify-center items-start ${
          isRTL ? "mr-6" : "ml-6"
        }`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* user text */}
        <div
          className="flex justify-center items-center gap-2"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <span className="w-10 h-10 rounded-[50%] flex justify-center items-center">
            {icon}
          </span>
          <span className="font-work-sans font-medium md:text-2xl text-xl text-primary-500">
            {user === "student"
              ? t("register.cards.role.student.title")
              : t("register.cards.role.professor.title")}
          </span>
        </div>
        {/* benefits */}
        <div className="flex flex-col justify-center items-start gap-3">
          {benefits &&
            benefits.map((benefit) => {
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
