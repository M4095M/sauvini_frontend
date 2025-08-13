import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Button from "../ui/button";
import { OTPInputProps } from "@/types/otpInput";

export default function OTPInput({t, isRTL} : OTPInputProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4">
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <div className="font-work-sans font-medium text-sm self-end cursor-pointer text-primary-300">
          {t("register.verify-email.resend")}
        </div>
      </div>
      <Button state={"filled"} size={"M"} icon_position={"none"} text="Verify code" />
    </div>
  );
}
