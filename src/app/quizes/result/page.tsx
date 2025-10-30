import Button from "@/components/ui/button";

type QuizeResultProps = {
  pass: boolean;
  score: string;
};

type IconProp = {
  Color: string;
};

const SuccessIcon = ({ Color }: IconProp) => {
  return (
    <div
      className={`${Color} flex justify-center items-center w-fit rounded-full`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="148"
        height="148"
        viewBox="0 0 148 148"
        fill="none"
      >
        <path
          d="M56.7335 74.0002L68.2446 85.5113L91.2669 62.4891M125.8 74.0002C125.8 102.609 102.609 125.8 74.0002 125.8C45.3918 125.8 22.2002 102.609 22.2002 74.0002C22.2002 45.3918 45.3918 22.2002 74.0002 22.2002C102.609 22.2002 125.8 45.3918 125.8 74.0002Z"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

const FailIcon = ({ Color }: IconProp) => {
  return (
    <div
      className={`${Color} flex justify-center items-center w-fit rounded-full`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="148"
        height="148"
        viewBox="0 0 148 148"
        fill="none"
      >
        <path
          d="M54.8758 101.126C60.2701 95.7319 67.3327 93.0227 74.4027 92.9986C81.5363 92.9742 88.6775 95.6834 94.1202 101.126M19 74.499C19 105.151 43.8482 129.999 74.5 129.999C105.152 129.999 130 105.151 130 74.499C130 43.8472 105.152 18.999 74.5 18.999C43.8482 18.999 19 43.8472 19 74.499ZM88.375 60.624C88.375 63.1783 89.4103 65.249 90.6875 65.249C91.9647 65.249 93 63.1783 93 60.624C93 58.0697 91.9647 55.999 90.6875 55.999C89.4103 55.999 88.375 58.0697 88.375 60.624ZM90.6875 60.624H90.6412V60.7165H90.6875V60.624ZM56 60.624C56 63.1783 57.0353 65.249 58.3125 65.249C59.5897 65.249 60.625 63.1783 60.625 60.624C60.625 58.0697 59.5897 55.999 58.3125 55.999C57.0353 55.999 56 58.0697 56 60.624ZM58.3125 60.624H58.2662V60.7165H58.3125V60.624Z"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default function QuizeResult({
  pass = true,
  score = "14/16",
}: QuizeResultProps) {
  return (
    <div className="py-20 px-5 flex justify-center items-center bg-neutral-100 rounded-[60px]">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col items-center justify-center gap-5">
          {pass ? (
            <SuccessIcon Color={"text-success-400 bg-success-100"} />
          ) : (
            <FailIcon Color="bg-primary-50 text-primary-400" />
          )}
          <div className="text-6xl text-primary-600 font-semibold">
            Congratulations!
          </div>
          <div className="text-6xl text-primary-600 font-semibold">
            You Passed the Quiz
          </div>
        </div>
        {/* score */}
        <div className="flex flex-col justify-center items-center">
          <span className="text-2xl text-neutral-400 font-medium text-center">
            Your score is: {score}
          </span>
          <span className="text-base text-neutral-400 font-normal text-center">
            Additional exercises for this lesson are now available in My
            Exercises.
          </span>
        </div>
        {/* action button */}
        <div className="w-full flex gap-5">
          <Button
            state={"tonal"}
            size={"M"}
            icon_position={"none"}
            text="Back to lessons"
          />
          <Button
            state={"filled"}
            size={"M"}
            icon_position={"none"}
            text="Next lesson"
          />
        </div>
      </div>
    </div>
  );
}
