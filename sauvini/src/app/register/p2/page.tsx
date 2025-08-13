import InputButton from "@/components/input/InputButton";
import TwoOptionRadio from "@/components/input/twoOptionRadio";
import Button from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Register4() {
  return (
    <div className="w-fit h-full p-10 flex flex-col justify-center items-center gap-10 mt-15">
      {/* Header */}
      <div className="flex flex-col justify-center items-center gap-2">
        <span className="font-work-sans font-semibold lg:text-4xl text-neutral-600 text-center text-2xl">
          Tell Us About Your Experience
        </span>
        <span className="font-work-sans font-medium lg:text-xl text-neutral-400 text-center text-base">
          This will help us understand your teaching background.
        </span>
      </div>
      {/* input fileds */}
      <div className="flex flex-col gap-6 w-full justify-start items-start">
        <TwoOptionRadio
          label={"Do you have experience teaching in a high school?"}
          required={false}
          firstOption={"Yes"}
          secondOption={"No"}
        />
        <TwoOptionRadio
          label={"Do you have experience with off-school courses?"}
          required={false}
          firstOption={"Yes"}
          secondOption={"No"}
        />
        <InputButton
          label={"How many years of experience?"}
          type={"plus-minus"}
        />
        <TwoOptionRadio
          label={"Do you have experience with online off-school courses?"}
          required={false}
          firstOption={"Yes"}
          secondOption={"No"}
        />
        <div className="w-full flex flex-row justify-center items-center ">
          <span className="font-work-sans font-normal text-base text-neutral-600 grow">
            Upload your CV document
          </span>
          <div className="grow-0">
            <Button
              state={"outlined"}
              size={"M"}
              icon_position={"none"}
              text="Upload"
            />
          </div>
        </div>
      </div>
      {/* buttons */}
      <div className="flex flex-row gap-4 ">
        <Button
          state={"outlined"}
          size={"M"}
          icon_position={"left"}
          text="Previous"
          icon={<ArrowLeft />}
        />
        <Button
          state={"filled"}
          size={"M"}
          icon_position={"right"}
          text="Next"
          icon={<ArrowRight />}
        />
      </div>
    </div>
  );
}
