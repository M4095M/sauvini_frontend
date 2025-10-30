import CheckBoxGroup from "@/components/quizes/checkBoxGroup";
import CheckBoxQuestion from "@/components/quizes/checkBoxQuestion";
import Button from "@/components/ui/button";
import { FrontendChapter } from "@/api/chapters";

type ChapterDependencyPopupProps = {
  onClose: () => void;
  t: any;
  isRTL: boolean;
  availableChapters: FrontendChapter[];
  selectedDependencies: string[];
  onDependenciesChange: (dependencies: string[]) => void;
};

export default function ChapterDependencyPopup({
  onClose,
  t,
  isRTL,
  availableChapters,
  selectedDependencies,
  onDependenciesChange,
}: ChapterDependencyPopupProps) {
  const handleDependencyToggle = (chapterId: string) => {
    if (selectedDependencies.includes(chapterId)) {
      onDependenciesChange(
        selectedDependencies.filter((id) => id !== chapterId)
      );
    } else {
      onDependenciesChange([...selectedDependencies, chapterId]);
    }
  };

  const handleSave = () => {
    onClose();
  };
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
        {availableChapters.length > 0 ? (
          <div className="space-y-3">
            {availableChapters.map((chapter) => (
              <label
                key={chapter.id}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedDependencies.includes(chapter.id)}
                  onChange={() => handleDependencyToggle(chapter.id)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-lg text-neutral-600">
                  {chapter.title}
                </span>
              </label>
            ))}
          </div>
        ) : (
          <div className="text-neutral-400 text-center py-8">
            No other chapters available for dependencies
          </div>
        )}
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
          onClick={handleSave}
        />
      </div>
    </div>
  );
}
