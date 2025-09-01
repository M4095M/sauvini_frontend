import CheckBoxGroup from "@/components/quizes/checkBoxGroup";
import CheckBoxQuestion from "@/components/quizes/checkBoxQuestion";
import Button from "@/components/ui/button";

type ChapterDependencyPopupProps = {
  onClose: () => void;
  t: any;
  isRTL: boolean;
};

export default function ChapterDependencyPopup({
  onClose,
  t,
  isRTL
}: ChapterDependencyPopupProps) {
  return (
    <div className="py-10 px-11 flex flex-col gap-12 bg-neutral-100 rounded-[40px]">
      {/* header */}
      <div className="flex flex-col gap-4">
        <div className="font-semibold text-neutral-600 text-4xl">
          {t("professor.lessons.AddDepency")}
        </div>
        <div className="font-medium text-xl text-neutral-400">
          {t("professor.lessons.AddDepencyDesc")}
        </div>
      </div>
      {/* input header */}
      <div className="flex flex-col gap-3">
        <CheckBoxGroup options={["option 1", "option 2"]} isRTL={isRTL} />
      </div>
      {/* action buttons */}
      <div className="flex flex-row gap-5">
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
          text={t("professor.lessons.SaveDepencies")}
        />
      </div>
    </div>
  );
}
