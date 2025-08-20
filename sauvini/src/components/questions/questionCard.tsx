"use client";

import { ChevronDown, ChevronUp, Icon } from "lucide-react";
import Tag from "./tag";
import { IconAnswered } from "./tagIcons";
import Button from "../ui/button";
import { useState } from "react";

type QuestionCardProps = {
  title: string;
  isAnwsered: boolean;
  isPublic: boolean;
  icon: any;
  question: string;
  detailed_anwser?: string;
  path: string;
};

export default function QuestionCard({
  title,
  isAnwsered,
  isPublic,
  icon,
  question,
  detailed_anwser,
  path = "Module / Chapter / Lesson",
}: QuestionCardProps) {
  const [anwsere, setAnswere] = useState<"collapsed" | "expaneded">(
    "collapsed"
  );
  const handleExpand = () => {
    if (anwsere === "collapsed") {
      setAnswere("expaneded");
    } else {
      setAnswere("collapsed");
    }
  };

  return (
    <div className="bg-white w-full rounded-3xl p-6 flex flex-col gap-5 border border-neutral-300 ">
      {/* header */}
      <div className="flex flex-row gap-4 items-center justify-between">
        {/* title */}
        <div className="flex flex-row gap-4 ">
          {/* icon */}
          <div className="w-24 aspect-square bg-neutral-200">{icon}</div>
          {/* info */}
          <div className="flex flex-col gap-1">
            <span className="text-base font-normal text-neutral-400">
              {path}
            </span>
            <span className="text-4xl font-semibold text-primary-600">
              {title}
            </span>
            {/* tags */}
            <div className="flex gap-2">
              <Tag
                icon={
                  <IconAnswered
                    className={"text-success-400 bg-success-100"}
                    width={"12"}
                    height={"12"}
                  />
                }
                text={"Answered"}
                className={"text-success-400 bg-success-100"}
              />
              <Tag
                icon={
                  <IconAnswered
                    className={"text-second02-200"}
                    width={"12"}
                    height={"12"}
                  />
                }
                text={"Public"}
                className={"text-second02-200 bg-second02-100"}
              />
            </div>
          </div>
        </div>
        {/* button */}
        <div className="">
          <Button
            state={"outlined"}
            size={"M"}
            icon_position={"none"}
            text="Download Student Attached files"
          />
        </div>
      </div>
      {/* question */}
      <div className="text-xl font-medium text-neutral-400">{question}</div>
      {/* expand button */}
      {isAnwsered && (
        <Button
          state={"text"}
          size={"M"}
          icon_position={"left"}
          icon={anwsere === "collapsed" ? <ChevronDown /> : <ChevronUp />}
          text={anwsere === "collapsed" ? "Show answer" : "Hide answer"}
          onClick={handleExpand}
        />
      )}
      {/* answere */}
      {isAnwsered && anwsere === "expaneded" && (
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium text-neutral-400">
            {detailed_anwser}
          </div>
          <div className="w-fit">
            <Button
              state={"outlined"}
              size={"M"}
              icon_position={"none"}
              text={"Download Professor Attached files"}
            />
          </div>
        </div>
      )}
    </div>
  );
}