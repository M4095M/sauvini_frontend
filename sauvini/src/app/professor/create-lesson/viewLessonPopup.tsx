import FileAttachement from "@/components/lesson/fileAttachment";
import BigTag from "@/components/professor/BigTags";
import { IconMissingQuiz } from "@/components/professor/tagIcons";
import Tag from "@/components/questions/tag";
import Button from "@/components/ui/button";

export default function ViewLessonPopup() {
  return (
    <div className="w-full pt-20 pb-11 px-10 bg-neutral-100 rounded-[60px] flex flex-col gap-12">
      {/* header */}
      <div className="font-semibold text-4xl text-neutral-600">
        Chapter title
      </div>
      {/* content */}
      <div className="flex flex-col gap-10">
        {/* lesson name */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-2xl text-neutral-600">
            Lesson Name
          </div>
          <div className="text-base font-normal text-neutral-600">Name</div>
        </div>
        {/* lesson desc */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-2xl text-neutral-600">
            Lesson Description
          </div>
          <div className="text-base font-normal text-neutral-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
            odio. Praesent libero. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Integer nec odio. Praesent libero. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Integer nec odio.
            Praesent libero.
          </div>
        </div>
        {/* Lesson video */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-2xl text-neutral-600">
            Lesson video
          </div>
          <FileAttachement isRTL={false} downloadable={false} />
        </div>
        {/* attachement */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-2xl text-neutral-600">
            Attachments
          </div>
          <div className="flex flex-col gap-3">
            <FileAttachement isRTL={false} downloadable />
            <FileAttachement isRTL={false} downloadable />
            <FileAttachement isRTL={false} downloadable />
          </div>
        </div>
        {/* Exercices pdf */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-2xl text-neutral-600">
            Exercices pdf
          </div>
          <FileAttachement isRTL={false} downloadable={false} />
        </div>
        {/* total marks */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-2xl text-neutral-600">
            Exercises Total Marks
          </div>
          <div className="text-base font-normal text-neutral-600">20</div>
        </div>
        {/* total xp */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-2xl text-neutral-600">
            Exercises Total XP
          </div>
          <div className="text-base font-normal text-neutral-600">64</div>
        </div>
        {/* acadmic dependencties */}
        <div className="flex flex-col gap-3">
          <div className="font-medium text-2xl text-neutral-600">
            Supported Academic Streams
          </div>
          <div className="flex gap-3">
            <BigTag icon={undefined} text={"Mathematics"} />
            <BigTag icon={undefined} text={"Experimental Sciences"} />
          </div>
        </div>
        {/* SHOW IF MISSING QUIZES */}
        <div className="flex flex-row justify-between items-center ">
          {/* left part */}
          <div className="flex flex-row gap-3">
            <div className="font-normal text-neutral-600 text-base">Quiz</div>
            <Tag
              icon={
                <IconMissingQuiz
                  className={"text-warning-400"}
                  width={"12"}
                  height={"12"}
                />
              }
              text={"missing quiz"}
              className={"bg-warning-100 text-warning-400"}
            />
          </div>
          {/* right part */}
          <div className="">
            <Button
              state={"filled"}
              size={"M"}
              icon_position={"none"}
              text="Add Quiz"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
