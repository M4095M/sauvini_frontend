"use client"

import OTPInput from "@/components/auth/otpInput";
import { useLanguage } from "@/context/LanguageContext";

export default function Registration2() {
  const { t, isRTL } = useLanguage();
  return (
    <div className="w-fit h-full p-10 flex flex-col justify-center items-center gap-10 mt-15">
      {/* header */}
      <div className="flex flex-col justify-center items-center gap-2">
        <span className="font-work-sans font-semibold lg:text-4xl text-neutral-600 text-center text-2xl">
          {t("register.verify-email.title")}
        </span>
        <span className="font-work-sans font-medium lg:text-xl text-neutral-500 text-center text-base">
          {t("register.verify-email.description")}
        </span>
        <span className="font-work-sans font-normal text-neutral-400 text-cente text-sm">
          {t("register.verify-email.not_received")}
        </span>
        <span className="font-work-sans font-semibold text-neutral-600 text-base">
          name@email.com
        </span>
      </div>
      <OTPInput t={t} isRTL={isRTL} />
    </div>
  );
}
