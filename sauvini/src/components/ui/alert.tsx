import { AlertProps } from "@/types/alert";
import { CircleAlert } from "lucide-react";

export default function Alert({ title, description, type }: AlertProps) {
  return (
    <div
      className={`w-96 h-24 ${getAlertColor(
        type
      )} flex justify-start items-center pl-5  ${
        description ? "rounded-[18px]" : "rounded-3xl"
      } `}
    >
      <div className="flex flex-row justify-start items-start gap-2">
        <span className={`${getAlertTextColor(type)} pt-1`}>{<CircleAlert />}</span>
        <div className="">
          <div
            className={`font-work-sans font-medium text-xl ${getAlertTextColor(
              type
            )} `}
          >
            {title}
          </div>
          <div
            className={`font-work-sans font-normal text-base ${getAlertTextColor(
              type
            )}`}
          >
            {description}
          </div>
        </div>
      </div>
    </div>
  );
}

function getAlertColor(type: string) {
  switch (type) {
    case "success":
      return "bg-success-100";
    case "error":
      return "bg-error-100";

    case "warning":
      return "bg-warning-100";

    case "default":
      return "bg-neutral-100";

    default:
      return "bg-neutral-100";
  }
}

function getAlertTextColor(type: string) {
  switch (type) {
    case "success":
      return "text-success-400";
    case "error":
      return "text-error-400";

    case "warning":
      return "text-warning-400";

    case "default":
      return "text-neutral-400";

    default:
      return "text-neutral-400";
  }
}
