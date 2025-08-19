"use client";

import { Download } from "lucide-react";
import Button from "../ui/button";

interface FileAttachmentProps {
  lessonId?: string;
}

export default function FileAttachement({ lessonId }: FileAttachmentProps) {
  return (
    <div
      className="rounded-[12px] border border-neutral-200 p-2
    flex justify-between items-center"
    >
      {/* file name and icon*/}
      <div className="flex items-center gap-3">
        {/* icon */}
        <div className="p-2 aspect-square rounded-full bg-primary-100 text-primary-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="16"
            viewBox="0 0 15 16"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.856 2.78688C11.3068 2.23771 10.4164 2.23771 9.86726 2.78688L3.03022 9.62396C2.11493 10.5393 2.11493 12.0232 3.03022 12.9385C3.94551 13.8538 5.42949 13.8538 6.34478 12.9385L11.1529 8.13041C11.336 7.94735 11.6328 7.94735 11.8158 8.13041C11.9989 8.31347 11.9989 8.61026 11.8158 8.79332L7.00769 13.6014C5.72629 14.8828 3.64871 14.8828 2.36731 13.6014C1.0859 12.32 1.0859 10.2425 2.3673 8.96105L9.20434 2.12397C10.1196 1.20868 11.6036 1.20868 12.5189 2.12397C13.4342 3.03926 13.4342 4.52324 12.5189 5.43853L5.68584 12.2716C5.68408 12.2734 5.68229 12.2752 5.68049 12.277L5.6762 12.2812L5.67482 12.2826L5.67342 12.284C5.12353 12.8248 4.23949 12.822 3.69313 12.2756C3.14396 11.7264 3.14396 10.8361 3.69313 10.2869L8.57469 5.4052C8.75775 5.22214 9.05454 5.22214 9.2376 5.4052C9.42066 5.58825 9.42067 5.88505 9.23761 6.06811L4.35605 10.9498C4.17299 11.1328 4.17299 11.4296 4.35604 11.6127C4.53776 11.7944 4.8316 11.7957 5.01489 11.6167L11.856 4.77562C12.4052 4.22644 12.4052 3.33606 11.856 2.78688Z"
            />
          </svg>
        </div>
        {/* file name */}
        <div className="text-xs text-primary-600 font-normal">File.pdf</div>
      </div>

      {/* action button */}
      <div className="flex justify-center items-center">
        <Button
          state={"tonal"}
          size={"XS"}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M3 13.5L3 14.375C3 15.8247 4.17525 17 5.625 17L14.375 17C15.8247 17 17 15.8247 17 14.375L17 13.5M13.5 10L10 13.5M10 13.5L6.5 10M10 13.5L10 3"
                stroke="#7C7C7C"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
          icon_position={"icon-only"}
        />
      </div>
    </div>
  );
}
