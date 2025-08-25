import CheckBoxQuestion from "@/components/quizes/checkBoxQuestion";
import Button from "@/components/ui/button";

export default function ChapterDependencyPopup() {
  return (
    <div className="py-10 px-11 flex flex-col gap-12 bg-neutral-100 rounded-[40px]">
      {/* header */}
      <div className="flex flex-col gap-4">
        <div className="font-semibold text-neutral-600 text-4xl">
          Add Chapter Dependencies
        </div>
        <div className="font-medium text-xl text-neutral-400">
          Select the chapters this one depends on:
        </div>
      </div>
      {/* input header */}
      <div className="flex flex-col gap-3">
        <CheckBoxQuestion option={"Option"} isRTL={false} max_width="" />
        <CheckBoxQuestion option={"Option"} isRTL={false} max_width="" />
        <CheckBoxQuestion option={"Option"} isRTL={false} max_width="" />
      </div>
      {/* action buttons */}
      <div className="flex flex-row gap-5">
        <Button
          state={"tonal"}
          size={"M"}
          icon_position={"none"}
          text="Cancel"
        />
        <Button
          state={"filled"}
          size={"M"}
          icon_position={"none"}
          text="Save Dependencies"
        />
      </div>
    </div>
  );
}
