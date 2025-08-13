import Button from "@/components/ui/button";
import DoneIcon from "../submit/DoneIcon";

export default function ResetPassworCompleted() {
  return (
    <div className="w-fit h-full p-10 flex flex-col justify-center items-center gap-7 mt-15 ">
      <DoneIcon color="text-success-400" width="186" height="186" />
      <span className="font-work-sans font-semibold md:text-4xl text-3xl text-success-400">
        Your email has been verified!
      </span>
      <span className="font-work-sans font-medium md:text-xl text-lg max-w-3xl text-neutral-400 text-center">
        You're all set to continue.
      </span>
      <div className="max-w-80 ">
        <Button
          state={"filled"}
          size={"M"}
          icon_position={"none"}
          text="Start learning"
        />
      </div>
    </div>
  );
}
