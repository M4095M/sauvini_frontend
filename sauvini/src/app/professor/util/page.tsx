import AttachementField from "@/components/input/attachementField";
import DropDown from "@/components/input/dropDown";
import SimpleInput from "@/components/input/simpleInput";
import LessonCard from "@/components/professor/lessonCard";
import Tag from "@/components/questions/tag";

export default function ProfessorChapterPage() {
  return (
    <div className="w-full bg-neutral-100 rounded-[52px] py-6 px-3 flex flex-col justify-start gap-10">
      {/* drop down */}
      <div className="">
        <DropDown
          label=""
          placeholder="Academic stream"
          options={[
            {
              id: "1",
              text: "Science",
            },
            {
              id: "2",
              text: "Math",
            },
            {
              id: "3",
              text: "EG",
            },
          ]}
        />
      </div>
      {/* tags: */}
      <div className="flex flex-row gap-4">
        <Tag
          icon={undefined}
          text={"All"}
          className={"bg-second01-100 text-second01-200"}
        />
        <Tag
          icon={undefined}
          text={"Experimental Sciences"}
          className={"bg-primary-50 text-primary-600"}
        />
      </div>
      {/* Text input field and text area */}
      <div className="flex flex-col gap-3">
        <SimpleInput
          label={"Chapter name"}
          value={""}
          type={"text"}
          long={false}
        />
        <SimpleInput
          label={"Chapter Description"}
          value={""}
          type={"text"}
          long={true}
        />
        <AttachementField
          label={"Lesson video"}
          max_size={50}
          name={""}
          acceptedTypes={"image/*,.pdf,.doc,.docx"}
          mandatory={false}
        />
        <LessonCard
          id={"1"}
          title={"Complex number"}
          description={
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero."
          }
          created_date={new Date(2025, 7, 22, 10, 0, 0)}
          isQuizAvailable={false}
          number={1}
          isUploading={true}
          uploadProgress={50}
          isDisabled={true}
        />
      </div>
    </div>
  );
}
