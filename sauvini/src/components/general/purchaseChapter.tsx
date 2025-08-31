import AttachementField from "../input/attachementField";
import SimpleInput from "../input/simpleInput";
import FileAttachement from "../lesson/fileAttachment";
import Button from "../ui/button";

export default function PurchaseChapter() {
  return (
    <div className="rounded-[60px] px-10 py-11 bg-neutral-100 max-w-4xl w-full flex flex-col gap-20">
      {/* title */}
      <div className="flex flex-col gap-4">
        <div className="font-semibold text-neutral-600 text-5xl">
          Purchase Chapter X
        </div>
        <div className="font-medium text-neutral-400 text-2xl">
          To purchase this chapter, please pay the required amount to the CCP
          account mentioned below, then upload the payment receipt. Your request
          will be validated by the admin before you can access the content{" "}
        </div>
      </div>
      {/* RIB */}
      <div className="flex flex-col gap-2">
        <div className="text-neutral-500 font-normal text-base">RIB</div>
        <SimpleInput label={""} value={""} type={"text"} />
      </div>
      {/* attach file */}
      <AttachementField
        label={"Upload receipt"}
        max_size={0}
        name={""}
        acceptedTypes={"image/*,.pdf,.doc,.docx"}
        mandatory={false}
      />

      {/* SHOW THIS WHEN FILE IS UPLOADED */}
      {/* <FileAttachement isRTL={false} downloadable /> */}

      {/* actions */}
      <div className="flex flex-row gap-5">
        <Button
          state={"tonal"}
          size={"M"}
          icon_position={"none"}
          text="Cancel"
        />
        <Button
          state={"filled"}
          size={"M"}
          icon_position={"left"}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
            >
              <path
                d="M9.20156 12.4996L11.0682 14.3663L14.8016 10.6329M20.4016 12.4996C20.4016 17.1388 16.6408 20.8996 12.0016 20.8996C7.36237 20.8996 3.60156 17.1388 3.60156 12.4996C3.60156 7.86042 7.36237 4.09961 12.0016 4.09961C16.6408 4.09961 20.4016 7.86042 20.4016 12.4996Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
          text="Purchase"
        />
      </div>
    </div>
  );
}
