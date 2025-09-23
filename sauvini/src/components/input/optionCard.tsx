import { optgroup } from "motion/react-client";
import Button from "../ui/button";
import { X } from "lucide-react";

type OptionCardProps = {
  option: string;
  onClick?: (modules_name: string) => void;
};

export default function OptionCard({
  option,
  onClick = () => {},
}: OptionCardProps) {
  return (
    <div className="px-9 py-5 flex justify-between items-center bg-white  rounded-2xl">
      {/* content */}
      <div className="text-neutral-600 text-base font-normal">{option}</div>
      {/* button */}
      <div className="">
        <Button
          state={"text"}
          size={"XS"}
          icon_position={"icon-only"}
          icon={<X />}
          onClick={() => {
            onClick(option);
          }}
        />
      </div>
    </div>
  );
}
