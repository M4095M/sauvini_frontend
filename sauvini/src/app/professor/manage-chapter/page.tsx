import DropDown from "@/components/input/dropDown";
import InputButton from "@/components/input/InputButton";
import FileAttachement from "@/components/lesson/fileAttachment";
import BigTag from "@/components/professor/BigTags";
import Button from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ProfessorManageChapter() {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* manage chapter */}
      <div className="w-full flex flex-col gap-12 py-11 px-3 rounded-[52px] bg-neutral-100">
        {/* header */}
        <div className="flex justify-between gap-3">
          {/* info */}
          <div className="flex flex-col px-6 gap-1">
            <span className="font-semibold text-5xl text-neutral-600">
              Chapter title
            </span>
            <span className="font-medium text-2xl text-neutral-400">
              Module name
            </span>
          </div>
          {/* action button */}
          <div>
            <Button
              state={"filled"}
              size={"M"}
              icon_position={"right"}
              text="Save changes"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="24"
                  viewBox="0 0 25 24"
                  fill="none"
                >
                  <path
                    d="M9.69961 12.0001L11.5663 13.8668L15.2996 10.1334M20.8996 12.0001C20.8996 16.6393 17.1388 20.4001 12.4996 20.4001C7.86042 20.4001 4.09961 16.6393 4.09961 12.0001C4.09961 7.36091 7.86042 3.6001 12.4996 3.6001C17.1388 3.6001 20.8996 7.36091 20.8996 12.0001Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
          </div>
        </div>
        {/* input fields */}
        <div className="flex flex-col gap-12">
          {/* academic stream */}
          <div className="flex flex-col gap-5">
            <div className="px-8 text-2xl font-medium text-neutral-600">
              Supported academic streams
            </div>
            <div className="px-8 flex flex-col gap-4">
              <DropDown
                label="Add a stream"
                placeholder=""
                options={[
                  {
                    id: "1",
                    text: "Science",
                  },
                ]}
                max_width=""
              />
              {/* selected steams */}
              <div className="flex flex-row gap-3">
                <BigTag icon={undefined} text={"Mathematics"} />
                <BigTag icon={undefined} text={"Experimental Sciences"} />
              </div>
            </div>
          </div>
          {/* Chapter dependencies */}
          <div className="px-8 flex flex-row justify-between items-center gap-3">
            {/* info */}
            <div className="flex flex-col gap-5">
              <div className="text-2xl font-medium text-neutral-600">
                Chapter dependencies
              </div>
              <div className="flex flex-row gap-3">
                <BigTag icon={undefined} text={"Functions"} />
                <BigTag icon={undefined} text={"Arithmetic Sequences"} />
              </div>
            </div>
            {/* action buttons */}
            <div className="">
              <Button
                state={"outlined"}
                size={"M"}
                text="Add a dependecy"
                icon_position={"left"}
                icon={<Plus />}
              />
            </div>
          </div>
          {/* Chapter exam */}
          <div className="flex flex-col gap-5 px-8">
            {/* title */}
            <div className="text-2xl font-medium text-neutral-600">
              Chapter Exam
            </div>
            {/* input fields */}
            <div className="flex flex-col gap-6">
              {/* upload pdf exam */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-row justify-between items-center">
                  <div className="text-neutral-600 font-normal text-base px-4">
                    Upload Exam PDF
                  </div>
                  <div className="">
                    <Button
                      state={"outlined"}
                      size={"M"}
                      icon_position={"none"}
                      text="Upload"
                    />
                  </div>
                </div>
                <FileAttachement isRTL={false} downloadable={false} />
              </div>
              {/* total score */}
              <InputButton label={"Exam Total Mark"} type={"plus-minus"} max_width="" />
              {/* min score */}
              <InputButton label={"Exam Minimum Score"} type={"plus-minus"} max_width="" />
              {/* total xp */}
              <InputButton label={"Exam Total XP"} type={"plus-minus"} max_width="" />
            </div>
          </div>
        </div>
      </div>
      {/* lessons section */}
      <div className="w-full py-6 px-4 rounded-[52px] bg-neutral-100"></div>
    </div>
  );
}
