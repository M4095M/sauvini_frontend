import Button from "@/components/ui/button";
import { Plus, X } from "lucide-react";

type ChoiceBoxProps = {
  choice: string;
  handleRemove: () => void;
  onChange?: (text: string) => void;
};

export default function ChoiceBox({
  choice,
  handleRemove,
  onChange,
}: ChoiceBoxProps) {
  return (
    <div className="py-3 px-6 flex justify-between items-center text-base font-normal text-neutral-600 w-full rounded-2xl bg-white">
      <input
        type="text"
        value={choice}
        onChange={(e) => onChange?.(e.target.value)}
        className="flex-1 bg-transparent border-none outline-none text-neutral-600"
        placeholder="Enter choice"
      />
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
