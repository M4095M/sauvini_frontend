"use client";

import PasswordInputField from "@/components/input/passwordInput";
import SimpleInput from "@/components/input/simpleInput";
import Button from "@/components/ui/button";
import { RegisterCommonProps } from "@/types/registerCommonProps";
import { ArrowLeft, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function TeacherPart3({
  t,
  isRTL,
  language,
  NextStep,
  PreviousStep,
  errors,
  register,
}: RegisterCommonProps) {
  console.log("rendering teacher part 3");

  // State for loading and real-time errors
  const [isLoading, setIsLoading] = useState(false);
  const [realTimeErrors, setRealTimeErrors] = useState<
    Partial<Record<string, string>>
  >({});

  // Real-time validation for better UX
  const handleFieldChange = (fieldName: string, value: any) => {
    // Clear real-time error when user starts interacting
    if (realTimeErrors[fieldName]) {
      setRealTimeErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  // Handle next step with loading state
  const handleNextStep = async () => {
    setIsLoading(true);
    try {
      await NextStep();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-fit h-full p-10 flex flex-col justify-center items-center gap-10 mt-15">
      {/* Header */}
      <div className="flex flex-col justify-center items-center gap-2">
        <span className="font-semibold lg:text-4xl text-neutral-600 text-center text-2xl">
          {t("register.professor.page_3.title")}
        </span>
        <span className="font-medium lg:text-xl text-neutral-400 text-center text-base">
          {t("register.professor.page_3.description")}
        </span>
      </div>

      {/* General error display */}
      {(errors as any)?.general && (
        <div className="w-full max-w-md bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 animate-in fade-in-0 slide-in-from-top-1 duration-200">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div className="text-red-700 text-sm font-medium">
            {(errors as any).general}
          </div>
        </div>
      )}
      {/* input fields */}
      <div className="flex flex-col gap-6" dir={isRTL ? "rtl" : "ltr"}>
        <SimpleInput
          label={t("register.common.email")}
          type={"text"}
          errors={errors?.email || realTimeErrors.email}
          {...register("email")}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => {
            handleFieldChange("email", e.target.value);
          }}
        />
        <div className=" flex flex-row flex-wrap gap-4">
          <PasswordInputField
            label={t("register.common.password")}
            isRTL={isRTL}
            errors={errors?.password || realTimeErrors.password}
            {...register("password")}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleFieldChange("password", e.target.value);
            }}
          />
          <PasswordInputField
            label={t("register.common.confirm_password")}
            isRTL={isRTL}
            errors={errors?.password_confirm || realTimeErrors.password_confirm}
            {...register("password_confirm")}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleFieldChange("password_confirm", e.target.value);
            }}
          />
        </div>
      </div>
      {/* buttons */}
      <div className="flex flex-row gap-4 " dir={isRTL ? "rtl" : "ltr"}>
        <Button
          state={"outlined"}
          size={"M"}
          icon_position={isRTL ? "left" : "left"}
          text={t("register.common.previous")}
          icon={!isRTL ? <ArrowLeft /> : <ArrowRight />}
          onClick={PreviousStep}
          disabled={isLoading}
        />
        <Button
          state={"filled"}
          size={"M"}
          icon_position={isRTL ? "right" : "right"}
          text={isLoading ? "Creating Account..." : t("register.common.next")}
          icon={
            isLoading ? (
              <Loader2 className="animate-spin" />
            ) : isRTL ? (
              <ArrowLeft />
            ) : (
              <ArrowRight />
            )
          }
          onClick={handleNextStep}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
