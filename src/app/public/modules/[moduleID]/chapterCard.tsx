import Tag from "@/components/questions/tag";
import LockIcon from "../lockIcon"
import Button from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import DummyImage from "@/app/public/assets/Math.svg";
import Image from "next/image";

type ModuleCardProps = {
  t: any;
  isRTL: boolean;
};

export default function ModuleCard({ t, isRTL }: ModuleCardProps) {
  return (
    <div
      className="px-3 py-3 rounded-3xl bg-white border border-neutral-300 flex flex-col gap-4 max-w-[350px] w-full"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* upper part */}
      <div className="flex flex-row gap-3" dir={isRTL ? "rtl" : "ltr"}>
        {/* image */}
        <div className="max-w-28 h-32 grow bg-neutral-200 w-full ">
          <Image src={DummyImage} alt={""} />
        </div>
        {/* title and lock icon */}
        <div className="flex w-fit shrink">
          {/* title */}
          <div className="flex flex-col gap-1">
            <div className="text-neutral-600 font-medium text-xl">
             Chapter title
            </div>
            <div className="text-neutral-400 font-normal text-xs">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              nec odio. Praesent libero.
            </div>
          </div>
          {/* lock */}
          <div className="">
            <LockIcon className="bg-warning-100 text-warning-400" />
          </div>
        </div>
      </div>
      {/* tags */}
      <div className="flex gap-1 items-center justify-start flex-wrap">
        <Tag
          icon={undefined}
          text={"Mathematics"}
          className={"bg-warning-100 text-warning-400"}
        />
        <Tag
          icon={undefined}
          text={"Mathematics"}
          className={"bg-warning-100 text-warning-400"}
        />
      </div>
      {/* actions */}
      <div className="flex gap-3">
        <Button
          state={"filled"}
          size={"XS"}
          icon_position={isRTL ? "left" : "right"}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
            >
              <path
                d="M10.25 3C7.83375 3 5.875 4.95875 5.875 7.375V9.125C4.9085 9.125 4.125 9.9085 4.125 10.875V15.25C4.125 16.2165 4.9085 17 5.875 17H14.625C15.5915 17 16.375 16.2165 16.375 15.25V10.875C16.375 9.9085 15.5915 9.125 14.625 9.125H7.625V7.375C7.625 5.92525 8.80025 4.75 10.25 4.75C11.4719 4.75 12.5009 5.58573 12.7924 6.7181C12.9128 7.1861 13.3898 7.46784 13.8578 7.34738C14.3258 7.22693 14.6076 6.7499 14.4871 6.2819C14.0015 4.39512 12.2898 3 10.25 3Z"
                fill="currentColor"
              />
            </svg>
          }
          text={t("public.unlock")}
        />
        <Button
          state={"text"}
          size={"XS"}
          icon_position={isRTL ? "right" : "left"}
          icon={isRTL ? <ChevronLeft /> : <ChevronRight />}
          text={t("public.viewChapters")}
        />
      </div>
    </div>
  );
}
