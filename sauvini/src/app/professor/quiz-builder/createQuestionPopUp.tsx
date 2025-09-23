import SimpleInput from "@/components/input/simpleInput";
import CheckBoxQuestion from "@/components/quizes/checkBoxQuestion";
import ChoiceBox from "./choice";
import DropDown from "@/components/input/dropDown";
import FileAttachement from "@/components/lesson/fileAttachment";
import AttachementField from "@/components/input/attachementField";
import Button from "@/components/ui/button";
import InputButton from "@/components/input/InputButton";
import { Plus } from "lucide-react";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";

type Props = {
  t: any;
  isRTL: boolean;
  onClose: () => void;
};

export default function CreateQuestionPopUp({ t, isRTL, onClose }: Props) {
  // handle adding new option:
  const handleAddOption = () => {};

  const handleRemoveOption = () => {};

  return (
    <div className="px-10 py-11 w-full flex flex-col gap-12 bg-neutral-100 rounded-[60px] ">
      {/* header */}
      <div className="flex flex-col gap-4">
        <div className="font-semibold text-neutral-600 text-4xl">
          Question 1
        </div>
        <div className="text-neutral-400 font-medium text-xl">
          {t("professor.quizes.CreateQuestionDesc")}
        </div>
      </div>
      {/* questionsd */}
      <div className="flex flex-col gap-10 w-full">
        <SimpleInput
          label={t("professor.quizes.QuestionTitle")}
          value={""}
          type={"text"}
          max_width=""
        />
        <SimpleInput
          label={t("professor.quizes.QuestionText")}
          value={""}
          type={"text"}
          max_width=""
          max_hight="h-[100px]"
          long
        />
        <div className="flex flex-col">
          <DropDown
            label={t("professor.quizes.QuestionType")}
            placeholder="Question Type"
            options={[
              {
                id: "1",
                text: "Possibly has multiple correct answers",
              },
              {
                id: "2",
                text: "Has one correct answer",
              },
            ]}
            max_width=""
          />
        </div>
        <div className="flex flex-col gap-4">
          {/* add new option */}
          <InputButton
            label={t("professor.quizes.Choices")}
            type={"icon"}
            icon={<Plus />}
            max_width=""
            onClick={handleAddOption}
          />
          {/* options */}
          <div className="flex flex-col gap-2">
            <ChoiceBox handleRemove={handleRemoveOption} choice="Choice" />
            <ChoiceBox handleRemove={handleRemoveOption} choice="Choice" />
            <ChoiceBox handleRemove={handleRemoveOption} choice="Choice" />
          </div>
        </div>
        <DropDown
          label={t("professor.quizes.CorrectAnswers")}
          options={[]}
          placeholder=""
          max_width=""
        />
        <div className="flex flex-col gap-5">
          <AttachementField
            label={t("professor.quizes.QuizAttach")}
            max_size={0}
            name={""}
            acceptedTypes={"image/*,.pdf,.doc,.docx"}
            mandatory={false}
          />
          <div className="flex flex-col gap-3">
            <FileAttachement isRTL={false} downloadable />
            <FileAttachement isRTL={false} downloadable />
            <FileAttachement isRTL={false} downloadable />
          </div>
        </div>
      </div>
      {/* actions */}
      <div className="flex flex-row gap-5">
        <Button
          state={"tonal"}
          size={"M"}
          icon_position={"none"}
          text={t("professor.quizes.Cancel")}
          onClick={onClose}
        />
        <Button
          state={"filled"}
          size={"M"}
          icon_position={"none"}
          text={t("professor.quizes.CreateQuiz")}
        />
      </div>
    </div>
  );
}
