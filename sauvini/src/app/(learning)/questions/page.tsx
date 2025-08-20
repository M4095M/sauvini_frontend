import DropDown from "@/components/input/dropDown";
import QuestionCard from "@/components/questions/questionCard";

export default function QuestionsPage() {
  return (
    <div className="bg-neutral-100 w-full py-6 px-3 flex flex-col gap-6 rounded-[52px]">
      {/* header */}
      <div className="flex flex-col gap-3">
        {/* title */}
        <div className="px-3  text-2xl font-medium text-primary-600">
          Questions
        </div>
        {/* filters container */}
        <div className="flex gap-4">
          <div className="w-fit">
            <DropDown
              placeholder="Question Visibility "
              options={[
                { id: "1", text: "Public" },
                { id: "2", text: "Private" },
              ]}
            />
          </div>
          <div className="w-fit">
            <DropDown placeholder="Teacher Response " />
          </div>
          <div className="w-fit">
            <DropDown placeholder="Module " />
          </div>
        </div>
      </div>
      {/* question section */}
      <div className="flex flex-col gap-7">
        <QuestionCard
          title={"Question Title"}
          isAnwsered={false}
          isPublic={false}
          icon={undefined}
          question={
            "Question: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation? Student notes: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation?"
          }
          path={"Module / Chapter / Lesson"}
        />
        <QuestionCard
          title={"Question Title"}
          isAnwsered={true}
          isPublic={true}
          icon={undefined}
          question={
            "Question: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation? Student notes: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation?"
          }
          detailed_anwser="Question: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation? Student notes: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation?"
          path={"Module / Chapter / Lesson"}
        />
      </div>
    </div>
  );
}
