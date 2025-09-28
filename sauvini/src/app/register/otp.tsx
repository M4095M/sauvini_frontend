"use client";

import OTPInput from "@/components/auth/otpInput";
import { useLanguage } from "@/context/LanguageContext";
import { RegisterCommonProps } from "@/types/registerCommonProps";
import { useEffect, useState } from "react";

export default function OTP({
  t,
  isRTL,
  language,
  NextStep,
  PreviousStep,
  register,
  errors,
  completeRegistration
}: RegisterCommonProps) {
  const [otpResent, setOtpResent] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  const handleCompleteRegistration = async () => {
    if (completeRegistration) {
      await completeRegistration();
    }
  }


  useEffect(() => {
    // register
    setRegisterLoading(true);
    handleCompleteRegistration();
    setRegisterLoading(false);

    // if succuss request OTP:
  }, [])

  const handleResendeOTP = () => {
    setOtpResent(true);
    console.log("Resend OTP clicked");
    // call here function to ressent OTP
    // ...
  }

  if (registerLoading) {
    return (
      <div className="w-full justify-center items-center text-neutral-600 font-medium">Loading...</div>
    )
  }

  return (
    <div className="w-fit h-full p-10 flex flex-col justify-center items-center gap-10 mt-15">
      {/* header */}
      <div className="flex flex-col justify-center items-center gap-2">
        {otpResent && <div className="text-neutral-600 font-medium text-base">{t("otp.resent")}</div>}
        <span className="font-semibold lg:text-4xl text-neutral-600 text-center text-2xl">
          {t("register.verify-email.title")}
        </span>
        <span className="font-medium lg:text-xl text-neutral-500 text-center text-base">
          {t("register.verify-email.description")}
        </span>
        <span className="font-normal text-neutral-400 text-cente text-sm">
          {t("register.verify-email.not_received")}
        </span>
        <span className="font-semibold text-neutral-600 text-base">
          name@email.com
        </span>
      </div>
      <OTPInput t={t} isRTL={isRTL} onClick={NextStep} resendOTP={handleResendeOTP} />
    </div>
  );
}
