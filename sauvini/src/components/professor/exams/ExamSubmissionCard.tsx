"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Download, ChevronDown, Check } from "lucide-react";
import Button from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import AttachementField from "@/components/input/attachementField";
import InputButton from "@/components/input/InputButton";
import type { ExamSubmission } from "@/types/exam";
import Tag from "@/components/professor/tag";
import { IconAnswered, IconNotAnswered } from "@/components/professor/tagIcons";

interface ExamsCardProps {
  submission: ExamSubmission;
  isRTL?: boolean;
  isMobile?: boolean;
  onCorrect?: (
    submissionId: string,
    payload?: { file?: File | null; mark?: number | null; notes?: string }
  ) => void;
  onDownload?: (submissionId: string) => void;
}

export default function ExamsCard({
  submission,
  isRTL: isRTLProp = false,
  isMobile = false,
  onCorrect,
  onDownload,
}: ExamsCardProps) {
  const { t, isRTL: isRTLFromHook } = useLanguage();
  const isRTL = isRTLFromHook ?? isRTLProp;

  const [open, setOpen] = useState(false);
  const [correctionFile, setCorrectionFile] = useState<File | null>(null);
  const [studentMark, setStudentMark] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const contentWrapperRef = useRef<HTMLDivElement | null>(null);
  const contentInnerRef = useRef<HTMLDivElement | null>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  useEffect(() => {
    // measure inner content height for smooth open/close
    const el = contentInnerRef.current;
    if (!el) return;
    setContentHeight(el.scrollHeight);
  }, [open, submission, studentMark, notes, correctionFile]);

  const initials = (submission.student?.name || "U")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");

  const isCorrected = submission.status === "corrected";

  const canonicalStatus =
    submission.status === "corrected" ? "corrected" : "waiting";
  const localizedStatusLabel =
    canonicalStatus === "corrected"
      ? t("professor.exams.status.corrected") ?? "corrected"
      : t("professor.exams.status.waiting") ?? "waiting";

  const statusIcon =
    canonicalStatus === "corrected" ? (
      <IconAnswered className="text-emerald-600" />
    ) : (
      <IconNotAnswered className="text-yellow-600" />
    );

  const statusClass =
    canonicalStatus === "corrected"
      ? "text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-200"
      : "text-yellow-800 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200";

  const statusBadge = (
    <Tag
      icon={statusIcon}
      text={localizedStatusLabel}
      className={`px-3 py-1 text-sm font-medium rounded-full ${statusClass}`}
    />
  );

  const toggleOpen = () => setOpen((v) => !v);

  const correctionFileName =
    (submission.correctionFileUrl?.split("/").pop() ??
      submission.correctionFileUrl ??
      t("professor.exams.correctionFileDefault")) ||
    "File.pdf";

  // button text
  const buttonText = isCorrected
    ? open
      ? t("professor.exams.hideDetails") ?? "Hide details"
      : t("professor.exams.viewDetails") ?? "View details"
    : open
    ? t("professor.exams.hideCorrectionForm") ?? "Hide"
    : t("professor.exams.correct") ?? "Correct";

  // alignment helpers for RTL
  const textAlignClass = isRTL ? "text-right" : "text-left";
  const detailsItemAlignment = isRTL ? "items-end" : "items-start";
  const firstFrameDirection = isRTL ? "md:flex-row-reverse" : "md:flex-row";
  const downloadIconPosition = isRTL ? "left" : "right";
  const toggleIconPosition = isRTL ? "left" : "right";

  // TODO: replace with real API call, e.g. await api.saveCorrection(submission.id, formData)
  const handleSaveCorrection = async () => {
    const markNumber = studentMark ? Number(studentMark) : null;
    onCorrect?.(submission.id, {
      file: correctionFile,
      mark: markNumber,
      notes,
    });
    setTimeout(() => setOpen(false), 150);
  };

  const handleDownload = () => {
    if (submission.submissionFileUrl)
      window.open(submission.submissionFileUrl, "_blank");
    else onDownload?.(submission.id);
  };

  // rotating chevron visual (we pass rotated node to Button)
  const rotatingIcon = (
    <span
      style={{
        display: "inline-block",
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 200ms ease",
      }}
    >
      <ChevronDown className="w-4 h-4" />
    </span>
  );

  return (
    <article
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full max-w-[1153px] p-5 md:p-6 bg-white dark:bg-[#0b1220] rounded-[40px] border border-[var(--Card-Outline-Default,#BDBDBD)] flex flex-col gap-3"
    >
      {/* First frame */}
      <div
        className={`w-full flex  md:items-center gap-4 `}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="flex items-start md:items-center gap-4 md:gap-6 flex-1 ">
          {/* Avatar */}
          <div className="flex-shrink-0 w-[90px] h-[90px] rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center">
            {submission.student?.avatar ? (
              <Image
                src={submission.student.avatar}
                alt={submission.student.name}
                width={90}
                height={90}
                className="object-cover"
              />
            ) : (
              <div className="w-[90px] h-[90px] rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-lg">
                {initials}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col justify-center">
            <div
              className={`text-sm text-gray-600 dark:text-gray-300 ${textAlignClass}`}
            >
              {submission.moduleName} / {submission.chapterName}
            </div>

            <div className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mt-1">
              {submission.student?.name}
            </div>

            <div className="flex items-center gap-3 mt-2">{statusBadge}</div>
          </div>
        </div>

        {/* Download button */}
        <div className="mt-2 md:mt-0 md:flex-shrink-0 md:self-start md:ml-0 ">
          <div
            className={`w-full md:w-auto ${
              isRTL ? "md:text-left" : "md:text-right"
            }`}
          >
            <Button
              state="outlined"
              size={isMobile ? "S" : "M"}
              icon_position={downloadIconPosition}
              text={
                isMobile
                  ? t("common.downloadShort") ?? "Download"
                  : t("professor.exams.downloadSubmission") ??
                    "Download Student Submission file"
              }
              icon={<Download className="w-4 h-4" />}
              onClick={handleDownload}
              optionalStyles="!w-auto"
            />
          </div>
        </div>
      </div>

      {/* animated details wrapper*/}
      <div
        ref={contentWrapperRef}
        style={{
          height: open ? contentHeight : 0,
          overflow: "hidden",
          transition: "height 220ms ease, opacity 180ms ease",
          opacity: open ? 1 : 0,
        }}
        aria-hidden={!open}
      >
        <div
          ref={contentInnerRef}
          className={`pt-4 pb-2 ${detailsItemAlignment}`}
        >
          {/* Corrected expanded details */}
          {isCorrected ? (
            <div className="w-full flex flex-col gap-4">
              <div
                className={`flex flex-col gap-3 w-full`}
              >
                <div
                  className={`text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white ${textAlignClass}`}
                >
                  {t("professor.exams.gradeTitle") ?? "Grade:"}{" "}
                  <span className="inline-block ml-2 md:ml-3 text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                    {submission.grade}/{submission.maxGrade}
                  </span>
                </div>

                {submission.professorNotes && (
                  <div
                    className={`text-sm text-gray-700 dark:text-gray-300 ${textAlignClass}`}
                  >
                    <strong className="block mb-1">
                      {t("professor.exams.professorNotesTitle") ??
                        "Professor notes:"}
                    </strong>
                    <div>{submission.professorNotes}</div>
                  </div>
                )}
              </div>

              <div
                className={`flex flex-col gap-2 w-full`}
              >
                <div
                  className={`text-sm text-gray-600 dark:text-gray-400 ${textAlignClass}`}
                >
                  {t("professor.exams.correctionFileLabel") ??
                    "Correction File"}
                </div>

                <div className="flex items-center justify-between w-full rounded-lg border border-[var(--BASE-Neutral-200,#EAEAEA)] p-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-sm text-gray-600">
                      <Download className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="text-sm text-gray-800 dark:text-gray-200">
                      {correctionFileName}
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <Button
                      state="outlined"
                      size="S"
                      icon_position={downloadIconPosition}
                      text={t("common.downloadShort") ?? "Download"}
                      icon={<Download className="w-4 h-4" />}
                      onClick={() =>
                        submission.correctionFileUrl &&
                        window.open(submission.correctionFileUrl, "_blank")
                      }
                      optionalStyles="!w-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Correction form for waiting submissions
            <div className="w-full flex flex-col gap-4">
              <div className="w-full">
                <AttachementField
                  label={
                    t("professor.exams.uploadCorrectionLabel") ??
                    "Upload Correction File"
                  }
                  max_size={50}
                  name={`correction-${submission.id}`}
                  acceptedTypes={"image/*,.pdf,.doc,.docx"}
                  mandatory={false}
                  onFileChange={(f) => setCorrectionFile(f)}
                />
              </div>

              <div className="w-full">
                <InputButton
                  label={
                    t("professor.exams.studentTotalMarkLabel") ?? "Total Mark"
                  }
                  type="plus-minus"
                  icon_position={isRTL ? "left" : "right"}
                  max_width="max-w-full"
                  name={`total-mark-${submission.id}`}
                  value={studentMark}
                  onChange={(e: any) => setStudentMark(e?.target?.value ?? "")}
                />
              </div>

              <div className="w-full">
                <div
                  className={`text-sm text-gray-600 dark:text-gray-400 mb-2 ${textAlignClass}`}
                >
                  {t("professor.exams.additionalNotesLabel") ??
                    "Additional notes"}
                </div>
                <InputButton
                  label=""
                  type="icon"
                  icon_position={isRTL ? "left" : "right"}
                  max_width="max-w-full"
                  name={`notes-${submission.id}`}
                  value={notes}
                  onChange={(e: any) => setNotes(e?.target?.value ?? "")}
                />
              </div>

              <div className="w-full flex justify-center">
                <Button
                  state="filled"
                  size="M"
                  icon_position="left"
                  text={
                    t("professor.exams.saveCorrection") ?? "Save Correction"
                  }
                  icon={<Check className="w-4 h-4" />}
                  onClick={handleSaveCorrection}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toggle button */}
      <div className="w-full mt-2 flex justify-center">
        <Button
          state="text"
          size={isMobile ? "S" : "M"}
          icon_position={toggleIconPosition}
          text={buttonText}
          icon={rotatingIcon}
          onClick={toggleOpen}
          optionalStyles="!w-auto py-2 text-sm text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
          aria-expanded={open}
        />
      </div>
    </article>
  );
}
