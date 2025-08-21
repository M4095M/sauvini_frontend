"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import Tag from "./tag";
import { IconAnswered } from "./tagIcons";
import Button from "../ui/button";
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";

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
  const { t, isRTL } = useLanguage();
  const [anwsere, setAnswere] = useState<"collapsed" | "expaneded">("collapsed");
  const handleExpand = () => setAnswere((p) => (p === "collapsed" ? "expaneded" : "collapsed"));

  const statusTag = isAnwsered
    ? {
        text: t("questions.card.answered"),
        className: "text-success-400 bg-success-100",
        iconClass: "text-success-400 bg-success-100",
      }
    : {
        text: t("questions.card.waiting"),
        className: "text-warning-400 bg-warning-100",
        iconClass: "text-warning-400 bg-warning-100",
      };

  const visibilityTag = isPublic
    ? {
        text: t("questions.card.public"),
        className: "text-second02-200 bg-second02-100",
        iconClass: "text-second02-200",
      }
    : {
        text: t("questions.card.private"),
        className: "text-second02-200 bg-second02-100",
        iconClass: "text-second02-200",
      };

  return (
    <div
      className="bg-white w-full max-w-[1153px] mx-auto rounded-[28px] p-6 flex flex-col items-center gap-5 border border-[#BDBDBD]"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="w-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Picture */}
          <div
            className="shrink-0 w-[93px] h-[90px] flex justify-center items-center overflow-hidden rounded-full bg-neutral-100"
            style={{ padding: "0 1.15px 0 1.293px" }}
          >
            {icon}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-between h-[90px]">
            <span className="text-sm font-normal text-neutral-400">
              {path || t("questions.card.pathPlaceholder")}
            </span>

            <span className="text-[28px] leading-[34px] font-semibold text-primary-600">
              {title}
            </span>

            {/* Status tags */}
            <div className="flex gap-2">
              <Tag
                icon={<IconAnswered className={statusTag.iconClass} width={"12"} height={"12"} />}
                text={statusTag.text}
                className={statusTag.className}
              />
              <Tag
                icon={<IconAnswered className={visibilityTag.iconClass} width={"12"} height={"12"} />}
                text={visibilityTag.text}
                className={visibilityTag.className}
              />
            </div>
          </div>
        </div>

        {/* button */}
        <div className="shrink-0">
          <Button state={"outlined"} size={"M"} icon_position={"none"} text={t("questions.card.downloadStudent")} />
        </div>
      </div>

      {/* Question frame */}
      <div className="w-full max-w-[1105px] text-[#7C7C7C] font-medium text-[20px] leading-[30px] tracking-[-0.4px]">
        {question}
      </div>

      {/* Show answer button */}
      {isAnwsered && anwsere === "collapsed" && (
        <div className="w-full flex justify-center">
          <Button
            state={"text"}
            size={"M"}
            icon_position={"left"}
            icon={<ChevronDown />}
            text={t("questions.card.showAnswer")}
            onClick={handleExpand}
          />
        </div>
      )}

      {/* Answer */}
      {isAnwsered && anwsere === "expaneded" && (
        <div className="w-full flex flex-col gap-4">
          <div className="w-full flex items-start justify-between gap-4">
            <div className="flex-1 max-w-[1105px] text-[#7C7C7C] font-medium text-[20px] leading-[30px] tracking-[-0.4px]">
              {detailed_anwser || t("questions.card.noAnswerYet")}
            </div>
            <div className="shrink-0">
              <Button
                state={"outlined"}
                size={"M"}
                icon_position={"none"}
                text={t("questions.card.downloadProfessor")}
              />
            </div>
          </div>

          <div className="w-full flex justify-center">
            <Button
              state={"text"}
              size={"M"}
              icon_position={"left"}
              icon={<ChevronUp />}
              text={t("questions.card.hideAnswer")}
              onClick={handleExpand}
            />
          </div>
        </div>
      )}
    </div>
  );
}