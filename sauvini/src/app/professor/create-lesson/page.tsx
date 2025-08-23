import AttachementField from "@/components/input/attachementField";
import DropDown from "@/components/input/dropDown";
import InputButton from "@/components/input/InputButton";
import SimpleInput from "@/components/input/simpleInput";
import FileAttachement from "@/components/lesson/fileAttachment";
import BigTag from "@/components/professor/BigTags";
import Button from "@/components/ui/button";

export default function ProfessorCreateLesson() {
  return (
    <div className="w-full rounded-[52px] bg-neutral-100 py-11 px-10 flex flex-col justify-center gap-14">
      {/* header */}
      <div className="flex flex-col gap-4">
        <div className="font-semibold text-4xl text-neutral-600">
          Create Course
        </div>
        <div className="text-neutral-400 text-xl font-medium">
          Fill in the details below to create a new lesson.
        </div>
      </div>
      {/* input fields */}
      <div className="flex flex-col gap-10">
        {/* lesson name */}
        <SimpleInput
          label={"Lesson name"}
          value={""}
          type={"text"}
          max_width=""
        />
        {/* lesson description */}
        <SimpleInput
          label={"Lesson description"}
          value={""}
          type={"text"}
          long
          max_width=""
          max_hight="h-32"
        />
        {/* Lesson video */}
        <AttachementField
          label="Lesson video"
          max_size={0}
          name={""}
          acceptedTypes={"image/*,.pdf,.doc,.docx"}
          mandatory={false}
        />
        {/* attachements */}
        <div className="flex flex-col gap-5">
          {/* attach compo */}
          <AttachementField
            label="Atttachements"
            max_size={0}
            name={""}
            acceptedTypes={"image/*,.pdf,.doc,.docx"}
            mandatory={false}
          />
          {/* attached files */}
          <div className="flex flex-col gap-3">
            <FileAttachement isRTL={false} downloadable />
            <FileAttachement isRTL={false} downloadable />
            <FileAttachement isRTL={false} downloadable />
          </div>
        </div>
        {/* Exercise PDF */}
        <AttachementField
          label="Exercise PDF"
          max_size={0}
          name={""}
          acceptedTypes={"image/*,.pdf,.doc,.docx"}
          mandatory={false}
        />
        {/* Exercises Total Marks */}
        <InputButton
          label={"Exercises Total Marks"}
          type={"plus-minus"}
          max_width=""
        />
        {/* Exercises Total XP */}
        <InputButton
          label={"Exercises Total XP"}
          type={"plus-minus"}
          max_width=""
        />
        {/* Supported Academic Streams */}
        <div className="flex flex-col gap-4">
          <DropDown
            label={"Supported Academic Streams"}
            placeholder=""
            options={[
              {
                id: "1",
                text: "Option 1",
              },
            ]}
            max_width=""
          />
          {/* tags */}
          <div className="flex gap-3">
            <BigTag icon={undefined} text={"Mathematics"} />
            <BigTag icon={undefined} text={"Experimental Sciences"} />
          </div>
        </div>
      </div>
      {/* buttons */}
      <div className="flex gap-5">
        <Button
          state={"tonal"}
          size={"M"}
          icon_position={"none"}
          text="Cancel"
        />
        <Button
          state={"filled"}
          size={"M"}
          icon_position={"none"}
          text="Create lesson"
        />
      </div>
    </div>
  );
}
