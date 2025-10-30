"use client"

import Image from "next/image";
import Illustration from "./pana.svg";
import { useLanguage } from "@/context/LanguageContext";

export default function ErrorPage() {
  const {t, isRTL} = useLanguage()
  return (
    <div className="w-full rounded-[60px] bg-neutral-100 flex  md:flex-row flex-col  md:gap-4 gap-6 justify-center items-center px-10 py-20">
      <Image src={Illustration} alt="error" />
      <div className={`flex flex-col gap-6 ${isRTL ? "text-right pl-10" : "text-left pr-10"}`}>
        <div className="font-semibold text-neutral-600 md:text-5xl text-3xl">
          Something Went Wrong
        </div>
        <div className="font-medium md:text-2xl text-xl text-neutral-400">
          We couldn’t complete your request. Please try again later.
        </div>
      </div>
    </div>
  );
}
