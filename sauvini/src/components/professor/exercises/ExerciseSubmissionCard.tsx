"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Download, ChevronDown, Check } from "lucide-react";
import Button from "@/components/ui/button";
import AttachementField from "@/components/input/attachementField";
import InputButton from "@/components/input/InputButton";
import { useLanguage } from "@/hooks/useLanguage";
import type { ExerciseSubmission } from "@/types/modules";
import Tag from "@/components/professor/tag";
import { IconAnswered, IconNotAnswered } from "@/components/professor/tagIcons";

interface Props {
  submission: ExerciseSubmission;
  isRTL?: boolean;
  isMobile?: boolean;
  onCorrect?: (id: string, payload?: { file?: File | null; mark?: number | null; notes?: string }) => void;
  onDownload?: (id: string) => void;
}

export default function ExerciseSubmissionCard({
  submission,
  isRTL: isRTLProp = false,
  isMobile = false,
  onCorrect,
  onDownload,
}: Props) {
  const { t, isRTL: isRTLFromHook } = useLanguage();
  const isRTL = isRTLFromHook ?? isRTLProp;

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [mark, setMark] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const innerRef = useRef<HTMLDivElement | null>(null);
  const [innerHeight, setInnerHeight] = useState(0);

  useEffect(() => {
    const el = innerRef.current;
    if (el) setInnerHeight(el.scrollHeight);
  }, [open, file, mark, notes, submission]);

  const initials = (submission.student?.name || "U")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  const statusIsGraded = submission.status === "corrected";

  const canonicalStatus = submission.status === "corrected" || submission.status === "corrected" ? "corrected" : "waiting";
  const statusIcon = canonicalStatus === "corrected" ? <IconAnswered className="text-emerald-600" /> : <IconNotAnswered className="text-yellow-600" />;
  const statusClass =
    canonicalStatus === "corrected"
      ? "text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-200"
      : "text-yellow-800 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200";

  const localizedStatusLabel =
    canonicalStatus === "corrected"
      ? t("professor.exercises.status.corrected") ?? "Corrected"
      : t("professor.exercises.status.waiting") ?? "Waiting";

  // TODO: backend
  const handleSave = async () => {
    const numeric = mark ? Number(mark) : null;
    onCorrect?.(submission.id, { file, mark: numeric, notes });
    setTimeout(() => setOpen(false), 150);
  };

  const handleDownload = () => {
    if (submission.submissionFileUrl) window.open(submission.submissionFileUrl, "_blank");
    else onDownload?.(submission.id);
  };

  const rotateIcon = (
    <span style={{ display: "inline-block", transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 180ms ease" }}>
      <ChevronDown className="w-4 h-4" />
    </span>
  );

  const textAlign = isRTL ? "text-right" : "text-left";
  const itemAlign = isRTL ? "items-end" : "items-start";
  const rowDir = isRTL ? "md:flex-row-reverse" : "md:flex-row";
  const iconPos = isRTL ? "left" : "right";

  return (
    <article
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full max-w-[1153px] mx-auto p-6 bg-white dark:bg-[#0b1220] rounded-[40px] border border-[#BDBDBD] flex flex-col gap-10"
    >
      <div className={`w-full flex flex-col md:items-center gap-4 ${rowDir}`}>
        <div className="flex items-start md:items-center gap-4 md:gap-6 flex-1">
          <div className="flex-shrink-0 w-[90px] h-[90px] rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center">
            {submission.student?.avatar ? (
              <Image src={submission.student.avatar} alt={submission.student.name} width={90} height={90} className="object-cover" />
            ) : (
              <div className="w-[90px] h-[90px] rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-lg">{initials}</div>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className={`text-sm text-gray-600 dark:text-gray-300 ${textAlign}`}>{submission.moduleName} / {submission.chapterName} / {submission.lessonName}</div>
            <div className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mt-1">{submission.student?.name}</div>
            <div className="flex items-center gap-3 mt-2">
              <Tag icon={statusIcon} text={localizedStatusLabel} className={`px-3 py-1 text-sm font-medium rounded-full ${statusClass}`} />
            </div>
          </div>
        </div>

        <div className="mt-2 md:mt-0 md:flex-shrink-0 md:self-start">
          <Button state="outlined" size={isMobile ? "S" : "M"} icon_position={iconPos} text={t("professor.exercises.downloadSubmissionFile") ?? "Download Submission File"} icon={<Download className="w-4 h-4" />} onClick={handleDownload} optionalStyles="!w-auto" />
        </div>
      </div>

      {/* animated content */}
      <div style={{ height: open ? innerHeight : 0, overflow: "hidden", transition: "height 220ms ease, opacity 180ms ease", opacity: open ? 1 : 0 }} aria-hidden={!open}>
        <div ref={innerRef} className={`pt-4 pb-2 ${itemAlign}`}>
          {/* Student notes */}
          {submission.studentNotes && (
            <div className={`mb-3 text-sm text-gray-700 dark:text-gray-300 ${textAlign}`}>
              <strong className="block mb-1">{t("professor.exercises.studentNotesLabel") ?? "Student notes:"}</strong>
              <div>{submission.studentNotes}</div>
            </div>
          )}

          {statusIsGraded ? (
            <div className="w-full flex flex-col gap-4">
              <div className={`text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white ${textAlign}`}>
                {t("professor.exercises.gradeTitle") ?? "Grade"}<span className="ml-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">{submission.grade}/{submission.totalMarks ?? ""}</span>
              </div>

              {submission.professorNotes && (
                <div className={`text-sm text-gray-700 dark:text-gray-300 ${textAlign}`}>
                  <strong className="block mb-1">{t("professor.exercises.professorNotesTitle") ?? "Professor notes:"}</strong>
                  <div>{submission.professorNotes}</div>
                </div>
              )}

              {submission.professorReviewPdfUrl && (
                <div className="flex items-center justify-between w-full rounded-lg border border-[var(--BASE-Neutral-200,#EAEAEA)] p-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-sm text-gray-600"><Download className="w-4 h-4 text-gray-500" /></div>
                    <div className="text-sm text-gray-800 dark:text-gray-200">{submission.professorReviewFileName ?? "Review.pdf"}</div>
                  </div>
                  <div className="flex-shrink-0">
                    <Button state="outlined" size="S" icon_position={iconPos} text={t("common.downloadShort") ?? "Download"} icon={<Download className="w-4 h-4" />} onClick={() => submission.professorReviewPdfUrl && window.open(submission.professorReviewPdfUrl, "_blank")} optionalStyles="!w-auto" />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full flex flex-col gap-4">
              <div className="w-full">
                <AttachementField label={t("professor.exercises.uploadReviewLabel") ?? "Upload Review File"} max_size={50} name={`review-${submission.id}`} acceptedTypes={"application/pdf"} mandatory={false} onFileChange={(f) => setFile(f)} />
              </div>

              <div className="w-full">
                <InputButton label={t("professor.exercises.totalMarkLabel") ?? "Total Mark"} type="plus-minus" icon_position={isRTL ? "left" : "right"} max_width="max-w-full" name={`mark-${submission.id}`} value={mark} onChange={(e: any) => setMark(e?.target?.value ?? "")} />
              </div>

              <div className="w-full">
                <div className={`text-sm text-gray-600 dark:text-gray-400 mb-2 ${textAlign}`}>{t("professor.exercises.additionalNotesLabel") ?? "Additional notes"}</div>
                <InputButton label="" type="icon" icon_position={isRTL ? "left" : "right"} max_width="max-w-full" name={`notes-${submission.id}`} value={notes} onChange={(e: any) => setNotes(e?.target?.value ?? "")} />
              </div>

              <div className="w-full flex justify-center">
                <Button state="filled" size="M" icon_position="left" text={t("professor.exercises.saveReview") ?? "Save Review"} icon={<Check className="w-4 h-4" />} onClick={handleSave} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-full mt-2 flex justify-center">
        <Button state="text" size={isMobile ? "S" : "M"} icon_position={iconPos} text={statusIsGraded ? (open ? t("professor.exercises.hideDetails") ?? "Hide details" : t("professor.exercises.viewDetails") ?? "View details") : (open ? t("professor.exercises.hideDetails") ?? "Hide" : t("professor.exercises.correct") ?? "Correct")} icon={rotateIcon} onClick={() => setOpen((s) => !s)} optionalStyles="!w-auto py-2 text-sm text-gray-700 dark:text-gray-200" aria-expanded={open} />
      </div>
    </article>
  );
}