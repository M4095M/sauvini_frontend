"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Download, ChevronDown, Send, X, Eye, EyeOff } from "lucide-react";
import Button from "@/components/ui/button";
import AttachementField from "@/components/input/attachementField";
import { useLanguage } from "@/hooks/useLanguage";
import Tag from "@/components/professor/tag";
import { IconAnswered, IconNotAnswered } from "@/components/professor/tagIcons";

interface Props {
  submission: any;
  isRTL?: boolean;
  isMobile?: boolean;
  onAnswer?: (id: string, payload?: { file?: File | null; answer?: string; visibility?: string }) => void;
  onDownload?: (id: string) => void;
}

export default function QuestionCard({ submission, isRTL: isRTLProp = false, isMobile = false, onAnswer, onDownload }: Props) {
  const { t, isRTL: isRTLFromHook } = useLanguage();
  const isRTL = isRTLFromHook ?? isRTLProp;

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [answer, setAnswer] = useState("");
  const [visibility, setVisibility] = useState<string>("public");
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [innerHeight, setInnerHeight] = useState(0);

  useEffect(() => {
    const el = innerRef.current;
    if (el) setInnerHeight(el.scrollHeight);
  }, [open, file, answer, submission, visibility]);

  const initials = (submission.student?.name || "U")
    .split(" ")
    .map((p: string) => p[0])
    .slice(0, 2)
    .join("");

  const canonicalStatus = submission.status === "corrected" || submission.status === "answered" ? "answered" : "waiting";
  const statusIcon = canonicalStatus === "answered" ? <IconAnswered /> : <IconNotAnswered />;
  const statusClass =
    canonicalStatus === "answered"
      ? "text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-200"
      : "text-yellow-800 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200";

  const localizedStatus = canonicalStatus === "answered" ? t("professor.questions.status.answered") ?? "Answered" : t("professor.questions.status.waiting") ?? "Waiting";

  // Button text logic
  const getButtonText = () => {
    if (canonicalStatus === "waiting") {
      return open ? t("professor.questions.cancel") ?? "Cancel" : t("professor.questions.answer") ?? "Answer";
    } else {
      return open ? t("professor.questions.hideDetails") ?? "Hide Details" : t("professor.questions.viewDetails") ?? "View Details";
    }
  };

  const handleSave = () => {
    onAnswer?.(submission.id, { file, answer, visibility });
    setTimeout(() => setOpen(false), 150);
  };

  const handleDownload = () => {
    if (submission.answerFileUrl || submission.professorFileUrl) {
      window.open(submission.answerFileUrl || submission.professorFileUrl, "_blank");
    } else {
      onDownload?.(submission.id);
    }
  };

  const textAlign = isRTL ? "text-right" : "text-left";
  const rowDir = isRTL ? "md:flex-row-reverse" : "md:flex-row";
  const itemAlign = isRTL ? "items-end" : "items-start";
  const iconPos = isRTL ? "left" : "right";

  return (
    <article 
      dir={isRTL ? "rtl" : "ltr"} 
      className="w-full max-w-[1153px] mx-auto flex flex-col items-end gap-10 p-6 bg-white dark:bg-[#0b1220] rounded-[40px] border border-[#BDBDBD]"
    >
      <div className={`w-full flex md:items-center gap-4 `}>
        <div className="flex items-start md:items-center gap-4 md:gap-6 flex-1">
          <div className="flex-shrink-0 w-[90px] h-[90px] rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center">
            {submission.student?.avatar ? (
              <Image src={submission.student.avatar} alt={submission.student.name} width={90} height={90} className="object-cover" />
            ) : (
              <div className="w-[90px] h-[90px] rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-lg">{initials}</div>
            )}
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className={`text-sm text-gray-600 dark:text-gray-300 ${textAlign}`}>
              {submission.moduleName} / {submission.chapterName} / {submission.lessonName}
            </div>
            <div className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mt-1">{submission.student?.name}</div>
            <div className="flex items-center gap-3 mt-2">
              <Tag icon={statusIcon} text={localizedStatus} className={`px-3 py-1 text-sm font-medium rounded-full ${statusClass}`} />
              {canonicalStatus === "answered" && submission.visibility && (
                <Tag 
                  icon={submission.visibility === "public" ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />} 
                  text={submission.visibility === "public" ? t("professor.questions.public") ?? "Public" : t("professor.questions.private") ?? "Private"} 
                  className="px-3 py-1 text-xs font-medium rounded-full text-blue-800 bg-blue-100 dark:bg-blue-900 dark:text-blue-200" 
                />
              )}
            </div>
          </div>
        </div>

        <div className="mt-2 md:mt-0 md:flex-shrink-0 md:self-start">
          <Button 
            state="outlined" 
            size={isMobile ? "S" : "M"} 
            icon_position={iconPos} 
            text={t("professor.questions.downloadAttachment") ?? "Download Student Attached files"} 
            icon={<Download className="w-4 h-4" />} 
            onClick={handleDownload} 
            optionalStyles="!w-auto" 
          />
        </div>
      </div>

      <div 
        style={{ 
          height: open ? innerHeight : 0, 
          overflow: "hidden", 
          transition: "height 220ms ease, opacity 180ms ease", 
          opacity: open ? 1 : 0 
        }} 
        aria-hidden={!open}
        className="w-full"
      >
        <div ref={innerRef} className={`pt-4 pb-2 flex flex-col gap-4 ${itemAlign} w-full`}>
          {/* Question title and details */}
          {submission.title && <h3 className={`text-lg font-semibold ${textAlign} w-full`}>{submission.title}</h3>}
          {submission.details && <div className={`text-sm text-gray-700 dark:text-gray-300 ${textAlign} w-full`}>{submission.details}</div>}

          {canonicalStatus === "waiting" ? (
            /* Answer form for waiting questions */
            <>
              <div className="w-full">
                <AttachementField 
                  label={t("professor.questions.uploadAnswerLabel") ?? "Upload Answer File"} 
                  max_size={50} 
                  name={`answer-${submission.id}`} 
                  acceptedTypes={"image/*,.pdf,.doc,.docx"} 
                  mandatory={false} 
                  onFileChange={(f) => setFile(f)} 
                />
              </div>

              <div className="w-full">
                <div className={`text-sm text-gray-600 dark:text-gray-400 mb-2 ${textAlign}`}>
                  {t("professor.questions.answerLabel") ?? "Answer"}
                </div>
                <textarea 
                  value={answer} 
                  onChange={(e) => setAnswer(e.target.value)} 
                  className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg min-h-[80px]" 
                  placeholder={t("professor.questions.answerPlaceholder") ?? "Type your answer here..."}
                />
              </div>

              {/* Visibility toggle */}
              <div className="w-full">
                <div className={`text-sm text-gray-600 dark:text-gray-400 mb-2 ${textAlign}`}>
                  {t("professor.questions.visibility") ?? "Visibility"}
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`visibility-${submission.id}`}
                      value="public"
                      checked={visibility === "public"}
                      onChange={(e) => setVisibility(e.target.value)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    />
                    <Eye className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {t("professor.questions.public") ?? "Public"}
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`visibility-${submission.id}`}
                      value="private"
                      checked={visibility === "private"}
                      onChange={(e) => setVisibility(e.target.value)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    />
                    <EyeOff className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {t("professor.questions.private") ?? "Private"}
                    </span>
                  </label>
                </div>
              </div>

              <div className="w-full flex justify-center">
                <Button 
                  state="filled" 
                  size="M" 
                  icon_position="left" 
                  text={t("professor.questions.sendAnswer") ?? "Send Answer"} 
                  icon={<Send className="w-4 h-4" />} 
                  onClick={handleSave} 
                />
              </div>
            </>
          ) : (
            /* Answered question details */
            <>
              {submission.professorNotes && (
                <div className={`text-sm text-gray-700 dark:text-gray-300 ${textAlign} w-full`}>
                  <strong className="block mb-1">{t("professor.questions.professorNotes") ?? "Professor notes:"}</strong>
                  <div>{submission.professorNotes}</div>
                </div>
              )}
              
              {submission.professorFileUrl && (
                <div className="w-full">
                  <div className={`text-sm text-gray-600 dark:text-gray-400 mb-2 ${textAlign}`}>
                    {t("professor.questions.professorFile") ?? "Professor File"}
                  </div>
                  <div className="flex items-center justify-between w-full rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
                        <Download className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="text-sm text-gray-800 dark:text-gray-200">
                        {submission.professorFileUrl.split("/").pop() || "Professor File"}
                      </div>
                    </div>
                    <Button
                      state="outlined"
                      size="S"
                      icon_position={iconPos}
                      text={t("common.downloadShort") ?? "Download"}
                      icon={<Download className="w-4 h-4" />}
                      onClick={() => window.open(submission.professorFileUrl, "_blank")}
                      optionalStyles="!w-auto"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="w-full flex justify-center">
        <Button 
          state="text" 
          size={isMobile ? "S" : "M"} 
          icon_position={isRTL ? "left" : "right"} 
          text={getButtonText()} 
          icon={
            <span style={{ 
              display: "inline-block", 
              transform: open ? "rotate(180deg)" : "rotate(0deg)", 
              transition: "transform 180ms ease" 
            }}>
              {canonicalStatus === "waiting" ? (
                open ? <X className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </span>
          } 
          onClick={() => setOpen((s) => !s)} 
          optionalStyles="!w-auto py-2 text-sm text-gray-700 dark:text-gray-200" 
          aria-expanded={open} 
        />
      </div>
    </article>
  );
}