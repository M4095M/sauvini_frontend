import AddOption from "@/components/input/addOption";
import OptionCard from "@/components/input/optionCard";
import Button from "@/components/ui/button";
import { Plus } from "lucide-react";

type ProfessorPermissionProps = {
  onClose: () => void;
};

export default function ProfessorPermission({
  onClose = () => {},
}: ProfessorPermissionProps) {
  const handleAddOption = () => {};
  const handleRemoveOption = () => {};
  return (
    <div className="w-full bg-neutral-100 rounded-[52px] pt-20 pb-11 px-10 flex flex-col gap-12">
      {/* close button */}
      <div
        className="w-full flex justify-end text-neutral-400 cursor-pointer"
        onClick={() => {
          onClose();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="29"
          viewBox="0 0 28 29"
          fill="none"
        >
          <path
            d="M7 21.5L21 7.5M7 7.5L21 21.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {/* header name */}
      <div className="font-semibold text-5xl text-neutral-600">
        [Prof name] Permissons
      </div>
      {/* info section */}
      <div className="flex flex-col gap-6">
        {/* header */}
        <div className="text-4xl font-semibold text-neutral-600">Modules</div>
        {/* add option */}
        <div className="">
          <AddOption
            placeholder="Add Option"
            icon={<Plus />}
            onClick={handleAddOption}
          />
        </div>
        {/* options */}
        <div className="flex flex-col gap-4">
          <OptionCard option={"Option 1"} onClick={handleRemoveOption} />
          <OptionCard option={"Option 2"} onClick={handleRemoveOption} />
          <OptionCard option={"Option 3"} onClick={handleRemoveOption} />
        </div>
      </div>
      {/* Permission per module */}
      <div className="flex flex-col gap-6">
        {/* header */}
        <div className="font-semibold text-4xl text-neutral-600">
          Permissions per Module
        </div>
        {/* content */}
        <div className="flex flex-col gap-6">
          {/* module name */}
          <div className="flex flex-col gap-6">
            {/* title */}
            <div className="font-medium text-2xl text-neutral-600">
              Module name
            </div>
            {/* permissions */}
            <div className="flex flex-col gap-3">
              Add here the checkbox comoponents
            </div>
          </div>
        </div>
      </div>
      {/* actions */}
      <div className="w-fill flex justify-end">
        <div className="">
          <Button
            state={"filled"}
            size={"M"}
            icon_position={"none"}
            text="Save Changes"
          />
        </div>
      </div>
    </div>
  );
}
