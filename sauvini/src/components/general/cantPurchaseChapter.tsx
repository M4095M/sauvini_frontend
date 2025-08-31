import { ChevronLeft } from "lucide-react";
import Button from "../ui/button";

type CantPurchaseChapterPrpos = {
  required: string[];
};

export default function CantPurchaseChapter({
  required,
}: CantPurchaseChapterPrpos) {
  return (
    <div className="w-full max-w-4xl rounded-[60px] px-10 py-16 flex flex-col gap-20 bg-neutral-100">
      {/* header */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-4">
            <div className="text-error-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="52"
                height="52"
                viewBox="0 0 52 52"
                fill="none"
              >
                <path
                  d="M38.8662 38.8691C45.9738 31.7616 45.9738 20.238 38.8662 13.1305C31.7587 6.02292 20.2351 6.02292 13.1275 13.1305M38.8662 38.8691C31.7587 45.9767 20.2351 45.9767 13.1275 38.8691C6.01999 31.7616 6.01999 20.238 13.1275 13.1305M38.8662 38.8691L13.1275 13.1305"
                  stroke="#DD3030"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="font-semibold text-neutral-600 text-5xl">
              Can’t Purchase Chapter
            </div>
          </div>
          <div className="font-medium text-2xl text-neutral-400">
            You cannot purchase this chapter yet. Some prerequisite chapters
            must be completed first:
          </div>
        </div>
        <div className="flex flex-col gap-5">
          {required.map((req, index) => {
            return (
              <div className="font-medium text-xl text-neutral-600">{`Chapter ${
                index + 1
              } : ${req}`}</div>
            );
          })}
        </div>
      </div>
      {/* actions: */}
      <div className="flex flex-col justify-center items-center gap-6">
        <Button
          state={"tonal"}
          size={"M"}
          icon_position={"left"}
          icon={<ChevronLeft />}
          text="Back to My Chapters"
        />
        <div className="font-normal text-base text-neutral-400">
          Complete the required chapters before unlocking this one.
        </div>
      </div>
    </div>
  );
}
