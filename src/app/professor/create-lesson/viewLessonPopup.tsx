import { useState, useEffect } from "react";
import FileAttachement from "@/components/lesson/fileAttachment";
import BigTag from "@/components/professor/BigTags";
import { IconMissingQuiz } from "@/components/professor/tagIcons";
import Tag from "@/components/questions/tag";
import Button from "@/components/ui/button";
import { getLesson, type Lesson } from "@/api/lesson";

type ViewLessonPopupProps = {
  onClose?: () => void;
  t: any;
  isRTL: boolean;
  lessonId?: string;
};

export default function ViewLessonPopup({
  onClose,
  t,
  isRTL,
  lessonId,
}: ViewLessonPopupProps) {
  // Lesson data state
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load lesson data
  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const lessonResponse = await getLesson(lessonId);
        if (!lessonResponse.success || !lessonResponse.data) {
          throw new Error("Lesson not found");
        }
        const lessonData = lessonResponse.data;
        setLesson(lessonData);
      } catch (error) {
        console.error("Error fetching lesson:", error);
        setError(t("errors.lesson.failedToLoad"));
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  // Show loading state
  if (loading) {
    return (
      <div className="w-full pt-20 pb-11 px-10 bg-neutral-100 rounded-[60px] flex flex-col gap-12">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full pt-20 pb-11 px-10 bg-neutral-100 rounded-[60px] flex flex-col gap-12">
        <div className="text-center">
          <div className="text-red-500 text-2xl mb-2">⚠️</div>
          <p className="text-red-600 font-medium mb-2">Failed to load lesson</p>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <Button
            state="outlined"
            size="M"
            icon_position="none"
            text="Retry"
            onClick={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  // Show lesson not found state
  if (!lesson) {
    return (
      <div className="w-full pt-20 pb-11 px-10 bg-neutral-100 rounded-[60px] flex flex-col gap-12">
        <div className="text-center">
          <div className="text-gray-500 text-2xl mb-2">📚</div>
          <p className="text-gray-600 font-medium mb-2">Lesson not found</p>
          <p className="text-sm text-gray-500">
            The requested lesson could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pt-20 pb-11 px-10 bg-neutral-100 rounded-[60px] flex flex-col gap-12">
      <div
        className="flex justify-end w-full "
        dir={isRTL ? "rtl" : "ltr"}
        onClick={onClose}
      >
        <div className="w-fit text-neutral-400 cursor-pointer select-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M5 15L15 5M5 5L15 15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      {/* header */}
      <div className="font-semibold text-4xl text-neutral-600">
        {lesson.title}
      </div>
      {/* content */}
      <div className="flex flex-col gap-10">
        {/* lesson name */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-2xl text-neutral-600">
            {t("professor.lessons.LessonName")}
          </div>
          <div className="text-base font-normal text-neutral-600">
            {lesson.title}
          </div>
        </div>
        {/* lesson desc */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-2xl text-neutral-600">
            {t("professor.lessons.LessonDescription")}
          </div>
          <div className="text-base font-normal text-neutral-600">
            {lesson.description}
          </div>
        </div>
        {/* lesson duration */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-2xl text-neutral-600">Duration</div>
          <div className="text-base font-normal text-neutral-600">
            {lesson.duration} minutes
          </div>
        </div>
        {/* lesson order */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-2xl text-neutral-600">Order</div>
          <div className="text-base font-normal text-neutral-600">
            {lesson.order}
          </div>
        </div>
        {/* lesson created date */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-2xl text-neutral-600">Created</div>
          <div className="text-base font-normal text-neutral-600">
            {lesson.created_at
              ? new Date(lesson.created_at).toLocaleDateString()
              : t("common.unknown")}
          </div>
        </div>
        {/* lesson updated date */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-2xl text-neutral-600">
            Last Updated
          </div>
          <div className="text-base font-normal text-neutral-600">
            {lesson.updated_at
              ? new Date(lesson.updated_at).toLocaleDateString()
              : t("common.unknown")}
          </div>
        </div>
        {/* Lesson video */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-2xl text-neutral-600">
            {t("professor.lessons.LessonVideo")}
          </div>
          <FileAttachement isRTL={false} downloadable={false} />
        </div>
        {/* attachement */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-2xl text-neutral-600">
            {t("professor.lessons.LessonAttachment")}
          </div>
          <div className="flex flex-col gap-3">
            <FileAttachement isRTL={false} downloadable />
            <FileAttachement isRTL={false} downloadable />
            <FileAttachement isRTL={false} downloadable />
          </div>
        </div>
        {/* Exercices pdf */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-2xl text-neutral-600">
            {t("professor.lessons.ExercicePDF")}
          </div>
          <FileAttachement isRTL={false} downloadable={false} />
        </div>
        {/* total marks */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-2xl text-neutral-600">
            {t("professor.lessons.ExerciceTotalMark")}
          </div>
          <div className="text-base font-normal text-neutral-600">
            {lesson?.exercise_total_mark || 0}
          </div>
        </div>
        {/* total xp */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-2xl text-neutral-600">
            {t("professor.lessons.ExerciceTotalXP")}
          </div>
          <div className="text-base font-normal text-neutral-600">
            {lesson?.exercise_total_xp || 0}
          </div>
        </div>
        {/* acadmic dependencties */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-2xl text-neutral-600">
            {t("professor.lessons.SupportedStreams")}
          </div>
          <div className="flex gap-3 flex-wrap">
            {lesson?.academic_streams && lesson.academic_streams.length > 0 ? (
              lesson.academic_streams.map((stream, index) => {
                const displayName =
                  typeof stream === "string"
                    ? stream
                    : stream.name || stream.labelKey || stream;
                return (
                  <BigTag key={index} icon={undefined} text={displayName} />
                );
              })
            ) : (
              <div className="text-gray-500 italic">
                No academic streams assigned
              </div>
            )}
          </div>
        </div>
        {/* SHOW IF MISSING QUIZES */}
        <div className="flex flex-row justify-between items-center ">
          {/* left part */}
          <div className="flex flex-row gap-3">
            <div className="font-normal text-neutral-600 text-base">
              {t("professor.lessons.Quiz")}
            </div>
            <Tag
              icon={
                <IconMissingQuiz
                  className={"text-warning-400"}
                  width={"12"}
                  height={"12"}
                />
              }
              text={"missing quiz"}
              className={"bg-warning-100 text-warning-400"}
            />
          </div>
          {/* right part */}
          <div className="">
            <Button
              state={"filled"}
              size={"M"}
              icon_position={"none"}
              text={t("professor.lessons.UpdateQuiz")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
