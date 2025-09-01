import AttachementField from "@/components/input/attachementField";
import DropDown from "@/components/input/dropDown";
import InputButton from "@/components/input/InputButton";
import SimpleInput from "@/components/input/simpleInput";
import FileAttachement from "@/components/lesson/fileAttachment";
import BigTag from "@/components/professor/BigTags";
import { IconMissingQuiz } from "@/components/professor/tagIcons";
import Tag from "@/components/questions/tag";
import Button from "@/components/ui/button";

type UpdateLessonPopUProps = {
  onClose: () => void;
  t: any;
  isRTL: boolean;
};

export default function UpdateLessonPopUp({
  onClose,
  t,
  isRTL,
}: UpdateLessonPopUProps) {
  return (
    <div className="w-full rounded-[60px] bg-neutral-100 py-11 px-10 flex flex-col justify-center gap-14">
      {/* header */}
      <div className="flex flex-col gap-4">
        <div className="font-semibold text-4xl text-neutral-600">
          {t("professor.lessons.UpdateLesson")}
        </div>
        <div className="text-neutral-400 text-xl font-medium">
          {t("professor.lessons.UpdateLessonDesc")}
        </div>
      </div>
      {/* input fields */}
      <div className="flex flex-col gap-10">
        {/* lesson name */}
        <SimpleInput
          label={t("professor.lessons.LessonName")}
          value={""}
          type={"text"}
          max_width=""
        />
        {/* lesson description */}
        <SimpleInput
          label={t("professor.lessons.LessonDescription")}
          value={""}
          type={"text"}
          long
          max_width=""
          max_hight="h-32"
        />
        {/* Lesson video */}
        <AttachementField
          label={t("professor.lessons.LessonVideo")}
          max_size={0}
          name={""}
          acceptedTypes={"image/*,.pdf,.doc,.docx"}
          mandatory={false}
        />
        {/* attachements */}
        <div className="flex flex-col gap-5">
          {/* attach compo */}
          <AttachementField
            label={t("professor.lessons.LessonAttachment")}
            max_size={0}
            name={""}
            acceptedTypes={"image/*,.pdf,.doc,.docx"}
            mandatory={false}
          />
          {/* attached files */}
          <div className="flex flex-col gap-3">
            <FileAttachement isRTL={false} downloadable />
            <FileAttachement isRTL={false} downloadable />
            <FileAttachement isRTL={false} downloadable />
          </div>
        </div>
        {/* Exercise PDF */}
        <AttachementField
          label={t("professor.lessons.ExercicePDF")}
          max_size={0}
          name={""}
          acceptedTypes={"image/*,.pdf,.doc,.docx"}
          mandatory={false}
        />
        {/* Exercises Total Marks */}
        <InputButton
          label={t("professor.lessons.ExerciceTotalMark")}
          type={"plus-minus"}
          max_width=""
        />
        {/* Exercises Total XP */}
        <InputButton
          label={t("professor.lessons.ExerciceTotalXP")}
          type={"plus-minus"}
          max_width=""
        />
        {/* Supported Academic Streams */}
        <div className="flex flex-col gap-4">
          <DropDown
            label={t("professor.lessons.SupportedStreams")}
            placeholder=""
            options={[
              {
                id: "1",
                text: "Option 1",
              },
            ]}
            max_width=""
          />
          {/* tags */}
          <div className="flex gap-3">
            <BigTag icon={undefined} text={"Mathematics"} />
            <BigTag icon={undefined} text={"Experimental Sciences"} />
          </div>
        </div>
        {/* SHOW IF MISSING QUIZES */}
        <div className="flex flex-row justify-between items-center ">
          {/* left part */}
          <div className="flex flex-row gap-3">
            <div className="font-normal text-neutral-600 text-base">{t("professor.lessons.Quiz")}</div>
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
      {/* buttons */}
      <div className="flex gap-5">
        <Button
          state={"tonal"}
          size={"M"}
          icon_position={"none"}
          text={t("professor.lessons.Cancel")}
          onClick={onClose}
        />
        <Button
          state={"filled"}
          size={"M"}
          icon_position={"none"}
          text={t("professor.lessons.UpdateLesson")}
        />
      </div>
    </div>
  );
}
