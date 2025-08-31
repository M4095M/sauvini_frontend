import AddOption from "@/components/input/addOption";
import OptionCard from "@/components/input/optionCard";
import Button from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ProfessorPermission() {
  const handleAddOption = () => {};
  const handleRemoveOption = () => {};
  return (
    <div className="w-full bg-neutral-100 rounded-[52px] pt-20 pb-11 px-10 flex flex-col gap-12">
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
