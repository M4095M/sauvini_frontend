"use client";

import CheckBoxQuestion from "@/components/quizes/checkBoxQuestion";
import RadioQuestion from "@/components/quizes/radioButtonQuestion";
import Button from "@/components/ui/button";
import RadioButton from "@/components/ui/radio-button";
import { useState } from "react";

type OneQuestionBoxProps = {
  t: any;
  isRTL?: boolean;
};

export default function OneQuestionBox({ t, isRTL }: OneQuestionBoxProps) {
  const [showDropDown, setShowDropDown] = useState(false);

  const handleShowMore = () => {
    setShowDropDown(!showDropDown);
  };

  return (
    <div className="p-10 flex flex-col gap-10 border border-neutral-300 rounded-[40px]">
      {/* header */}
      <div className="flex flex-col gap-4">
        {/* title and total points */}
        <div className="flex flex-row justify-between items-center relative">
          {/* text */}
          <div className="flex flex-col gap-1">
            <div className="text-primary-400 text-2xl font-medium">
              {t("professor.quizes.Question")} 1
            </div>
            <div className="text-neutral-400 font-normal text-sm">
              {t("professor.quizes.TotalPoints")}: 5
            </div>
          </div>
          {/* actions */}
          <div className="w-fit">
            <Button
              state={"text"}
              size={"S"}
              icon_position={"icon-only"}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M10 14.0996C10.6351 14.0996 11.1504 14.6149 11.1504 15.25C11.1504 15.8851 10.6351 16.4004 10 16.4004C9.36487 16.4004 8.84961 15.8851 8.84961 15.25C8.84961 14.6149 9.36487 14.0996 10 14.0996ZM10 8.84961C10.6351 8.84961 11.1504 9.36487 11.1504 10C11.1504 10.6351 10.6351 11.1504 10 11.1504C9.36487 11.1504 8.84961 10.6351 8.84961 10C8.84961 9.36487 9.36487 8.84961 10 8.84961ZM10 3.59961C10.6351 3.59961 11.1504 4.11487 11.1504 4.75C11.1504 5.38513 10.6351 5.90039 10 5.90039C9.36487 5.90039 8.84961 5.38513 8.84961 4.75C8.84961 4.11487 9.36487 3.59961 10 3.59961Z"
                    fill="currentColor"
                    stroke="#324C72"
                    strokeWidth="1.2"
                  />
                </svg>
              }
              onClick={handleShowMore}
            />
          </div>
          {/* drop down */}
          {showDropDown && (
            <div
              className={`absolute top-[100%] ${
                isRTL ? "left-0" : "right-0"
              } max-w-3xs py-3 flex flex-col gap-2 bg-white rounded-2xl btn-elevation-1`}
            >
              <div className="px-9 flex gap-2 justify-start items-center text-error-400 cursor-pointer select-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="22"
                  viewBox="0 0 18 22"
                  fill="none"
                >
                  <path
                    d="M11.7404 8L11.3942 17M6.60577 17L6.25962 8M16.2276 4.79057C16.5696 4.84221 16.9104 4.89747 17.25 4.95629M16.2276 4.79057L15.1598 18.6726C15.0696 19.8448 14.0921 20.75 12.9164 20.75H5.08357C3.90786 20.75 2.93037 19.8448 2.8402 18.6726L1.77235 4.79057M16.2276 4.79057C15.0812 4.61744 13.9215 4.48485 12.75 4.39432M0.75 4.95629C1.08957 4.89747 1.43037 4.84221 1.77235 4.79057M1.77235 4.79057C2.91878 4.61744 4.07849 4.48485 5.25 4.39432M12.75 4.39432V3.47819C12.75 2.29882 11.8393 1.31423 10.6606 1.27652C10.1092 1.25889 9.55565 1.25 9 1.25C8.44435 1.25 7.89078 1.25889 7.33942 1.27652C6.16065 1.31423 5.25 2.29882 5.25 3.47819V4.39432M12.75 4.39432C11.5126 4.2987 10.262 4.25 9 4.25C7.73803 4.25 6.48744 4.2987 5.25 4.39432"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="text-base font-normal ">
                  {t("professor.quizes.Delete")}
                </div>
              </div>
              <div className="px-9 flex gap-2 justify-start items-center text-neutral-600 cursor-pointer select-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M16.8617 4.48667L18.5492 2.79917C19.2814 2.06694 20.4686 2.06694 21.2008 2.79917C21.9331 3.53141 21.9331 4.71859 21.2008 5.45083L10.5822 16.0695C10.0535 16.5981 9.40144 16.9868 8.68489 17.2002L6 18L6.79978 15.3151C7.01323 14.5986 7.40185 13.9465 7.93052 13.4178L16.8617 4.48667ZM16.8617 4.48667L19.5 7.12499M18 14V18.75C18 19.9926 16.9926 21 15.75 21H5.25C4.00736 21 3 19.9926 3 18.75V8.24999C3 7.00735 4.00736 5.99999 5.25 5.99999H10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="text-base font-normal">
                  {t("professor.quizes.Update")}
                </div>
              </div>
            </div>
          )}
        </div>
        {/* question details */}
        <div className="text-neutral-600 font-medium text-xl">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation
        </div>
      </div>
      {/* options */}
      <div className="flex flex-col gap-3">
        <CheckBoxQuestion
          option={"Option"}
          isRTL={false}
          max_width=""
          state={false}
          onChange={() => {}}
        />
        <RadioQuestion option={"Option"} isRTL={false} max_width="" />
      </div>
    </div>
  );
}
