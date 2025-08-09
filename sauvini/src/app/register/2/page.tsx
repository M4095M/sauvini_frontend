import OTPInput from "@/components/auth/otpInput";

export default function Registration2() {
  return (
    <div className="w-fit h-full p-10 flex flex-col justify-center items-center gap-10 mt-15">
      {/* header */}
      <div className="flex flex-col justify-center items-center gap-2">
        <span className="font-work-sans font-semibold lg:text-4xl text-neutral-600 text-center text-2xl">
          Verify Your Email
        </span>
        <span className="font-work-sans font-medium lg:text-xl text-neutral-500 text-center text-base">
          To begin, we’ll need a bit of info about you.
        </span>
        <span className="font-work-sans font-normal text-neutral-400 text-cente text-sm">
          Didn’t receive it? Check your spam folder or request a new code
        </span>
        <span className="font-work-sans font-semibold text-neutral-600 text-base">
          name@email.com
        </span>
      </div>
      <OTPInput />
    </div>
  );
}
