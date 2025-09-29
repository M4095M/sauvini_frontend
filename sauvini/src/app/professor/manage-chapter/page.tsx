"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MOCK_PROFESSOR_MODULES } from "@/data/mockProfessor";
import DropDown from "@/components/input/dropDown";
import InputButton from "@/components/input/InputButton";
import FileAttachement from "@/components/lesson/fileAttachment";
import BigTag from "@/components/professor/BigTags";
import Button from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateLessonPopup from "../create-lesson/createLessonPopup";
import ChapterDependencyPopup from "../create-lesson/chapterDependencyPopup";
import LessonCard from "@/components/professor/lessonCard";
import UpdateLessonPopUp from "../create-lesson/updateLessonPopup";
import ViewLessonPopup from "../create-lesson/viewLessonPopup";
import { useLanguage } from "@/context/LanguageContext";

export default function ProfessorManageChapter() {
  const { t, language, isRTL } = useLanguage();
  const searchParams = useSearchParams();
  const chapterId = searchParams?.get("chapterId") || null;
  const moduleId = searchParams?.get("moduleId") || null;

  const { module: mod, chapter } = useMemo(() => {
    const modul =
      MOCK_PROFESSOR_MODULES.find((m) => m.id === moduleId) || null;
    const chapter =
      modul?.chapters?.find((c: any) => c.id === chapterId) ||
      // fallback: search across all modules
      MOCK_PROFESSOR_MODULES.flatMap((m) => m.chapters).find(
        (c: any) => c.id === chapterId
      ) ||
      null;
    return { module: modul, chapter };
  }, [chapterId, moduleId]);

  const resolveChapterTitle = (id?: string) => {
    if (!id) return id;
    const found = MOCK_PROFESSOR_MODULES.flatMap((m) => m.chapters).find(
      (c) => c.id === id
    );
    return found ? found.title : id;
  };

  const displayedStreams = chapter?.academicStreams?.length
    ? chapter.academicStreams
    : mod?.academicStreams ?? [];

  const dependencies = chapter?.prerequisites ?? [];

  const lessons = chapter?.lessons ?? [];

  // manage popupss states
  const [showCreateLessonPopup, setShowCreateLessonPopup] = useState(false);
  const [showChapterDependencyPopup, setShowChapterDependencyPopup] =
    useState(false);
  const [showUpdateChapterPopup, setShowUpdateChapterPopup] = useState(false);
  const [showLessonDetailsPopup, setShowLessonDetailsPopup] = useState(false);


  // callback function for form elements:
  const handleAddStream = (value: string) => {
    console.log("selected stream: ", value);
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* manage chapter */}
      <div className="w-full flex flex-col gap-12 py-11 px-3 rounded-[52px] bg-neutral-100">
        {/* header */}
        <div className="flex justify-between gap-3">
          {/* info */}
          <div className="flex flex-col px-6 gap-1">
            <span className="font-semibold text-5xl text-neutral-600">
              {chapter?.title ?? "Chapter title"}
            </span>
            <span className="font-medium text-2xl text-neutral-400">
              {mod?.name ?? "Module name"}
            </span>
          </div>
          {/* action button */}
          <div>
            <Button
              state={"filled"}
              size={"M"}
              icon_position={"right"}
              text={t("professor.chapters.SaveChanges")}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="24"
                  viewBox="0 0 25 24"
                  fill="none"
                >
                  <path
                    d="M9.69961 12.0001L11.5663 13.8668L15.2996 10.1334M20.8996 12.0001C20.8996 16.6393 17.1388 20.4001 12.4996 20.4001C7.86042 20.4001 4.09961 16.6393 4.09961 12.0001C4.09961 7.36091 7.86042 3.6001 12.4996 3.6001C17.1388 3.6001 20.8996 7.36091 20.8996 12.0001Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
          </div>
        </div>
        {/* input fields */}
        <div className="flex flex-col gap-12">
          {/* academic stream */}
          <div className="flex flex-col gap-5">
            <div className="px-8 text-2xl font-medium text-neutral-600">
              {t("professor.chapters.supportedStreams")}
            </div>
            <div className="px-8 flex flex-col gap-4">
              <DropDown
                label={t("professor.chapters.AddStream")}
                placeholder=""
                options={[
                  {
                    id: "1",
                    text: "Science",
                  },
                ]}
                max_width=""
                onChange={handleAddStream}
              />
              {/* selected streams */}
              <div className="flex flex-row gap-3 flex-wrap">
                {displayedStreams.length > 0 ? (
                  displayedStreams.map((s) => (
                    <BigTag key={s} icon={undefined} text={s} />
                  ))
                ) : (
                  <div className="text-sm text-neutral-400 px-4">
                    No streams configured
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Chapter dependencies */}
          <div className="px-8 flex flex-row justify-between items-center gap-3">
            {/* info */}
            <div className="flex flex-col gap-5">
              <div className="text-2xl font-medium text-neutral-600">
                {t("professor.chapters.ChapterDepencies")}
              </div>
              <div className="flex flex-row gap-3 flex-wrap">
                {dependencies.length > 0 ? (
                  dependencies.map((depId) => (
                    <BigTag
                      key={depId}
                      icon={undefined}
                      text={resolveChapterTitle(depId)}
                    />
                  ))
                ) : (
                  <div className="text-sm text-neutral-400 px-4">
                    No dependencies
                  </div>
                )}
              </div>
            </div>
            {/* action buttons */}
            <div className="">
              <Button
                state={"outlined"}
                size={"M"}
                text={t("professor.chapters.AddDepencies")}
                icon_position={"left"}
                icon={<Plus />}
                onClick={() => {
                  window.scrollTo(0, 0);
                  document.body.classList.add("no-scroll");
                  setShowChapterDependencyPopup(true);
                }}
              />
            </div>
          </div>
          {/* Chapter exam */}
          <div className="flex flex-col gap-5 px-8">
            {/* title */}
            <div className="text-2xl font-medium text-neutral-600">
              {t("professor.chapters.ChapterExams")}
            </div>
            {/* input fields */}
            <div className="flex flex-col gap-6">
              {/* upload pdf exam */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-row justify-between items-center">
                  <div className="text-neutral-600 font-normal text-base px-4">
                    {t("professor.chapters.UploadExamPDF")}
                  </div>
                  <div className="">
                    <Button
                      state={"outlined"}
                      size={"M"}
                      icon_position={"none"}
                      text={t("professor.chapters.Upload")}
                    />
                  </div>
                </div>
                <FileAttachement isRTL={false} downloadable={false} />
              </div>
              {/* total score */}
              <InputButton
                label={t("professor.chapters.ExamTotalMark")}
                type={"plus-minus"}
                max_width=""
              />
              {/* min score */}
              <InputButton
                label={t("professor.chapters.ExamMinScore")}
                type={"plus-minus"}
                max_width=""
              />
              {/* total xp */}
              <InputButton
                label={t("professor.chapters.ExamTotalXP")}
                type={"plus-minus"}
                max_width=""
              />
            </div>
          </div>
        </div>
      </div>
      {/* lessons section */}
      <div className="w-full py-6 px-4 flex flex-col gap-4 rounded-[52px] bg-neutral-100">
        {/* header */}
        <div className="px-4 flex justify-between items-center">
          {/* title */}
          <div className="text-2xl font-medium grow">
            {t("professor.chapters.Lessons")}
          </div>
          {/* action button */}
          <div className="">
            {/* DISPLAY IF THERE IS NOT LESSONS */}
            {/* <div className="text-neural-300 font-semibold text-5xl">{t("professor.chapters.NoLessonYet")}</div> */}
            <Button
              state={"outlined"}
              size={"M"}
              icon_position={"left"}
              text={t("professor.chapters.AddLesson")}
              icon={<Plus />}
              onClick={() => {
                window.scrollTo(0, 0);
                document.body.classList.add("no-scroll");
                setShowCreateLessonPopup(true);
              }}
            />
          </div>
        </div>
        {/* content */}
        <div className="w-full flex justify-center items-center text-5xl text-neutral-200 font-medium my-12">
          <LessonCard
            id="card-1"
            title="Introduction to Algebra"
            description="Learn the basics of algebra including variables, expressions, and equations."
            created_date={new Date("2025-01-15T09:00:00")}
            isQuizAvailable={true}
            number={1}
            isUploading={false}
            isDisabled={false}
            viewDetailsCallback={() => {
              window.scrollTo(0, 0);
              document.body.classList.add("no-scroll");
              setShowUpdateChapterPopup(true);
            }}
            viewLessonDetailsCallback={() => {
              window.scrollTo(0, 0);
              document.body.classList.add("no-scroll");
              setShowLessonDetailsPopup(true);
            }}
          />
        </div>
      </div>
      {/* pop ups */}
      {showCreateLessonPopup && (
        <div className="w-full overflow-y-auto h-screen flex justify-center bg-black/40 absolute top-0 left-0 z-100000">
          <div className="m-20 max-w-4xl w-full">
            <CreateLessonPopup
              onClose={() => {
                document.body.classList.remove("no-scroll");
                setShowCreateLessonPopup(false);
              }}
              t={t}
            />
          </div>
        </div>
      )}

      {showChapterDependencyPopup && (
        <div className="w-full overflow-y-auto h-screen flex justify-center bg-black/40 absolute top-0 left-0 z-100000">
          <div className="m-20">
            <ChapterDependencyPopup
              onClose={() => {
                document.body.classList.remove("no-scroll");
                setShowChapterDependencyPopup(false);
              }}
              t={t}
              isRTL={isRTL}
            />
          </div>
        </div>
      )}

      {showUpdateChapterPopup && (
        <div className="w-full overflow-y-auto h-screen flex justify-center bg-black/40 absolute top-0 left-0 z-100000">
          <div className="m-20 max-w-4xl w-full">
            <UpdateLessonPopUp
              onClose={() => {
                document.body.classList.remove("no-scroll");
                setShowUpdateChapterPopup(false);
              }}
              t={t}
              isRTL={isRTL}
            />
          </div>
        </div>
      )}

      {showLessonDetailsPopup && (
        <div className="w-full overflow-y-auto h-screen flex justify-center bg-black/40 absolute top-0 left-0 z-100000">
          <div className="m-20 max-w-4xl w-full">
            <ViewLessonPopup
              onClose={() => {
                document.body.classList.remove("no-scroll");
                setShowLessonDetailsPopup(false);
              }}
              t={t}
              isRTL={isRTL}
            />
          </div>
        </div>
      )}
    </div>
  );
}
