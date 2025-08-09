import SimpleInput from "@/components/input/simpleInput";
import Button from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function registerPart1() {
  return (
    <div className="w-fit h-full p-10 flex flex-col justify-center items-center gap-10 mt-15 ">
      {/* Header */}
      <div className="flex flex-col justify-center items-center gap-2">
        <span className="font-work-sans font-semibold lg:text-4xl text-neutral-600 text-center text-2xl">
          Tell Us a Bit About Yourself
        </span>
        <span className="font-work-sans font-medium lg:text-xl text-neutral-400 text-center text-base">
          To begin, we’ll need a bit of info about you.
        </span>
      </div>
      {/* input fields */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-row flex-wrap gap-4">
          <SimpleInput label={"Firstname"} value={"firstname"} />
          <SimpleInput label={"Lastname"} value={"lastname"} />
        </div>
        <SimpleInput label={"Wilaya"} value={"Wilaya"} />
        <SimpleInput label={"Phone number"} value={"phonenumber"} />
      </div>
      {/* buttons */}
      <div className="flex flex-row gap-4 ">
        <Button state={"outlined"} size={"M"} icon_position={"left"} text="Previous" icon={<ArrowLeft />} />
        <Button state={"filled"} size={"M"} icon_position={"right"} text="Next" icon={<ArrowRight />} />
      </div>
    </div>
  );
}
