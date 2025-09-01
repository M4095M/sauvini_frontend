import { useState } from "react";
import Tag from "./tag";
import { IconMissingQuiz, IconReady, IconUploading } from "./tagIcons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Button from "../ui/button";
import { MoreHorizontal, MoreVertical } from "lucide-react";

type LessonCardPros = {
  id: string;
  title: string;
  description: string;
  created_date: Date;
  isQuizAvailable: boolean;
  number: number;
  isUploading: boolean;
  uploadProgress?: number;
  isDisabled: boolean;
  viewDetailsCallback: () => void;
  viewLessonDetailsCallback: () => void;
};

export default function LessonCard({
  created_date,
  id,
  title,
  description,
  isQuizAvailable,
  number,
  isUploading,
  uploadProgress,
  isDisabled,
  viewDetailsCallback,
  viewLessonDetailsCallback,
}: LessonCardPros) {
  return (
    <div className="w-full flex flex-col items-center gap-6 p-6 rounded-3xl border bg-white border-neutral-300">
      <div className="w-full flex justify-between items-center">
        {/* left */}
        <div className="flex justify-start items-center gap-3 w-full">
          {/* number */}
          <div
            className={`w-8 h-8  rounded-full text-base flex justify-center items-center
            ${
              isDisabled
                ? "bg-neutral-200 text-neutral-300"
                : "bg-primary-50 text-primary-300"
            }`}
          >
            {number}
          </div>
          {/* info */}
          <div className="flex flex-col gap-1">
            <div className="font-normal text-xs text-neutral-300">
              Created on: {created_date.toString()}
            </div>
            <div className="flex gap-2">
              <div
                className={`text-xl font-medium 
                ${isDisabled ? "text-neutral-300" : "text-neutral-600 "}`}
              >
                {title}
              </div>
              {isUploading ? (
                <Tag
                  icon={
                    <IconUploading
                      className={"text-primary-300"}
                      width={"12"}
                      height={"12"}
                    />
                  }
                  text={"Uploading ..."}
                  className={"bg-primary-50 text-primary-300"}
                />
              ) : isQuizAvailable ? (
                <Tag
                  icon={
                    <IconReady
                      className={"bg-success-100 text-success-400"}
                      width={"12"}
                      height={"12"}
                    />
                  }
                  text={"Ready"}
                  className={"text-success-400"}
                />
              ) : (
                <Tag
                  icon={
                    <IconMissingQuiz
                      className={"text-second01-200"}
                      width={"12"}
                      height={"12"}
                    />
                  }
                  text={"missing quiz"}
                  className={"text-second01-200 bg-second01-100"}
                />
              )}
            </div>

            <div className="text-sm font-normal text-neutral-400">
              {description}
            </div>
          </div>
        </div>
        {/* right */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="">
              <Button
                state={"text"}
                size={"S"}
                icon_position={"icon-only"}
                icon={<MoreVertical />}
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            <DropdownMenuItem
              onClick={() => {
                viewDetailsCallback();
              }}
            >
              <div className="px-4 py-2 text-neutral-600 text-base">
                Update Chapter
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                viewLessonDetailsCallback();
              }}
            >
              <div className="px-4 py-2 text-neutral-600 text-base">
                View Lesson
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* show progress bar only if uploading */}
      {isUploading && (
        <div className="h-2 w-full bg-neutral-200 rounded-full overflow-hidden flex justify-start  items-center">
          <div
            className={`h-2 bg-primary-300 rounded-full`}
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      {/* show only if no quize  */}
      {!isQuizAvailable && (
        <div className={`font-normal text-base text-neutral-300`}>
          You can add a quiz by updating the lesson
        </div>
      )}
    </div>
  );
}
