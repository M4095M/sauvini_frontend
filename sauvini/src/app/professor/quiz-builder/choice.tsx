import Button from "@/components/ui/button";
import { Plus, X } from "lucide-react";

type ChoiceBoxProps = {
  choice: string;
  handleRemove: () => void;
};

export default function ChoiceBox({ choice, handleRemove }: ChoiceBoxProps) {
  return (
    <div className="py-3 px-6 flex justify-between items-center text-base font-normal text-neutral-600 w-full rounded-2xl bg-white">
      <div className="">{choice}</div>
      <div className="">
        <Button
          state={"text"}
          size={"XS"}
          icon_position={"icon-only"}
          icon={<X />}
          onClick={handleRemove}
        />
      </div>
    </div>
  );
}
