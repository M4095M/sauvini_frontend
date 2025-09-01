import FileAttachement from "@/components/lesson/fileAttachment";
import BigTag from "@/components/professor/BigTags";
import { IconMissingQuiz } from "@/components/professor/tagIcons";
import Tag from "@/components/questions/tag";
import Button from "@/components/ui/button";

type ViewLessonPopupProps = {
  onClose?: () => void;
  t: any;
  isRTL: boolean;
};

export default function ViewLessonPopup({
  onClose,
  t,
  isRTL,
}: ViewLessonPopupProps) {
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
        Chapter title
      </div>
      {/* content */}
      <div className="flex flex-col gap-10">
        {/* lesson name */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-2xl text-neutral-600">
            {t("professor.lessons.LessonName")}
          </div>
          <div className="text-base font-normal text-neutral-600">Name</div>
        </div>
        {/* lesson desc */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-2xl text-neutral-600">
            {t("professor.lessons.LessonDescription")}
          </div>
          <div className="text-base font-normal text-neutral-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
            odio. Praesent libero. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Integer nec odio. Praesent libero. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Integer nec odio.
            Praesent libero.
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
          <div className="text-base font-normal text-neutral-600">20</div>
        </div>
        {/* total xp */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-2xl text-neutral-600">
            {t("professor.lessons.ExerciceTotalXP")}
          </div>
          <div className="text-base font-normal text-neutral-600">64</div>
        </div>
        {/* acadmic dependencties */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-2xl text-neutral-600">
            {t("professor.lessons.SupportedStreams")}
          </div>
          <div className="flex gap-3">
            <BigTag icon={undefined} text={"Mathematics"} />
            <BigTag icon={undefined} text={"Experimental Sciences"} />
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
