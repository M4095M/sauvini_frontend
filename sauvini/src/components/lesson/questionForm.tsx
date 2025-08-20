import SimpleInput from "../input/simpleInput";
import Button from "../ui/button";

export default function QuestionForm() {
  return (
    <div className="flex flex-col gap-4 h-full w-full ">
      <div className="flex lg:flex-col md:flex-row flex-col gap-2">
        <SimpleInput label={"Question title"} value={""} type={"text"} />
        <div className="grow">
          <SimpleInput
            label={"Question Details"}
            value={""}
            type={"text"}
            long={true}
          />
        </div>
      </div>
      <div className="flex items-center justify-center lg:flex-col flex-row w-full lg-w-full gap-4">
        <div className="max-w-3xs w-full">
          <Button
            state={"outlined"}
            size={"M"}
            text="Upload"
            icon_position={"none"}
          />
        </div>
        <div className="max-w-3xs w-full">
          <Button
            state={"filled"}
            size={"M"}
            text="Submit"
            icon_position={"right"}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
              >
                <path
                  d="M6.49654 12.0005L3.76562 3.125C10.3808 5.04665 16.5244 8.07649 21.9823 12.0002C16.5244 15.924 10.3808 18.9539 3.76572 20.8757L6.49654 12.0005ZM6.49654 12.0005L13.9968 12.0005"
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
    </div>
  );
}
