import DropDown from "@/components/input/dropDown";
import SimpleInput from "@/components/input/simpleInput";
import Tag from "@/components/questions/tag";
import Button from "@/components/ui/button";

type AddModulePopupProps = {
  onClose?: () => void;
}

export default function AddModulePopup({ onClose }: AddModulePopupProps) {
  return (
    <div className="w-full max-w-4xl px-10 py-11 rounded-2xl bg-neutral-100 flex flex-col gap-12">
      {/* header */}
      <div className="flex flex-col gap-4">
        {/* header */}
        <div className="text-neutral-600 text-4xl font-semibold">
          Add Module
        </div>
        {/* descriptions */}
        <div className="text-neutral-400 font-normal text-xl">
          Update the details of the module
        </div>
      </div>
      {/* input fields */}
      <div className="flex flex-col gap-5">
        {/* name and desc */}
        <div className="flex flex-col gap-10">
          {/* name */}
          <SimpleInput
            label={"Module Name"}
            value={""}
            type={"text"}
            max_width=""
          />
          {/* desc */}
          <SimpleInput
            label={"Module Description"}
            value={""}
            type={"text"}
            long
            max_hight="h-[192px]"
            max_width=""
          />
        </div>
        {/* academic stream */}
        <div className="flex flex-col gap-4">
          {/* drop down */}
          <DropDown label="Supported Academic streams" placeholder="" />
          {/* tags */}
          <div className="flex gap-3">
            <Tag
              icon={undefined}
              text={"Mathematics"}
              className={"bg-primary-50 text-primary-300"}
            />
            <Tag
              icon={undefined}
              text={"Experimental Sciences"}
              className={"bg-primary-50 text-primary-300"}
            />
          </div>
        </div>
      </div>
      {/* actions */}
      <div className="flex gap-5 items-center">
        <Button
          state={"tonal"}
          size={"S"}
          icon_position={"none"}
          text="Cancel"
          onClick={onClose}
        />
        <Button
          state={"filled"}
          size={"S"}
          icon_position={"none"}
          text="Save changes"
        />
      </div>
    </div>
  );
}
