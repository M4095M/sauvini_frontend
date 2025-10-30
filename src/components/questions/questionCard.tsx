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
      className="bg-white w-full max-w-[1153px] mx-auto rounded-[28px] border border-[#BDBDBD]"
      style={{
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        alignSelf: "stretch",
      }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="w-full flex flex-col lg:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
          {/* Picture */}
          <div
            className="shrink-0 w-[93px] h-[90px] flex justify-center items-center overflow-hidden rounded-full bg-neutral-100"
            style={{ padding: "0 1.15px 0 1.293px" }}
          >
            {icon}
          </div>

          <div className="flex flex-col justify-start gap-2 md:gap-1 flex-1 text-left md:text-left min-h-0">
            {/* Path */}
            <span
              className={`text-sm font-normal text-neutral-400 leading-tight ${isRTL ? "font-arabic" : "font-sans"}`}
            >
              {path || t("questions.card.pathPlaceholder")}
            </span>

            {/* Title */}
            <span
              className={`text-lg md:text-[28px] leading-tight md:leading-[34px] font-semibold text-primary-600 break-words ${isRTL ? "font-arabic" : "font-sans"}`}
            >
              {title}
            </span>

            {/* Status tags */}
            <div className="flex gap-2 justify-start flex-wrap mt-1">
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

        {/* Download button */}
        <div className="hidden md:flex shrink-0 w-auto justify-center">
          <Button state={"outlined"} size={"M"} icon_position={"none"} text={t("questions.card.downloadStudent")} />
        </div>
      </div>

      <div
        className={`w-full max-w-[1105px] text-[#7C7C7C] font-medium text-base md:text-[20px] leading-relaxed md:leading-[30px] tracking-[-0.2px] md:tracking-[-0.4px] text-left break-words ${isRTL ? "font-arabic" : "font-sans"}`}
      >
        {question}
      </div>

      <div className="md:hidden w-full flex justify-center">
        <Button state={"outlined"} size={"M"} icon_position={"none"} text={t("questions.card.downloadStudent")} />
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
      {isAnwsered && (
        <div
          className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${
            anwsere === "expaneded" ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
        <div className="w-full flex flex-col gap-4">
          <div className="w-full flex flex-col md:flex-row items-start justify-between gap-4">
            <div
              className={`flex-1 max-w-[1105px] text-[#7C7C7C] font-medium text-base md:text-[20px] leading-relaxed md:leading-[30px] tracking-[-0.2px] md:tracking-[-0.4px] text-center md:text-left break-words ${isRTL ? "font-arabic" : "font-sans"}`}
            >
              {detailed_anwser || t("questions.card.noAnswerYet")}
            </div>
            <div className="shrink-0 w-full md:w-auto flex justify-center">
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
        </div>
      )}
    </div>
  );
}