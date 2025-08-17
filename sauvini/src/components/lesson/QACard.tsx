import { QACardProps } from "@/types/QACardProps";
import { CircleQuestionMark } from "lucide-react";
import FileAttachement from "./fileAttachment";
import Button from "../ui/button";

export default function QACard({
  title,
  description,
  icon_type,
  icon,
  attachment,
}: QACardProps) {
  return (
    <div
      className="border-2 border-neutral-200 px-3 py-4 bg-white rounded-xl
    flex flex-col gap-1"
    >
      {/* header */}
      <div className="flex justify-start gap-2">
        {/* icon */}
        {icon_type === "button" ? (
          <div className="flex justify-center items-center">
            <Button
              state={"text"}
              size={"XS"}
              icon_position={"icon-only"}
              icon={icon}
            />
          </div>
        ) : (
          <div className="w-7 h-7 flex justify-center items-center bg-primary-100 aspect-square text-primary-400 rounded-full">
            {icon}
          </div>
        )}

        <span className="text-xl font-medium text-primary-600">{title}</span>
      </div>
      {/* description */}
      <div className="text-sm font-normal text-neutral-300">{description}</div>

      {/* attachement */}
      {attachment && (
        <div className="pt-6">
          <FileAttachement />
        </div>
      )}
    </div>
  );
}
