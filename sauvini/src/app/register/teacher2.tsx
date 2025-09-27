"use client";

import ErrorPage from "@/components/general/errorPage";
import InputButton from "@/components/input/InputButton";
import TwoOptionRadio from "@/components/input/twoOptionRadio";
import RadioButtonGroup from "@/components/quizes/radionButtonGroup";
import Button from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { RegisterCommonProps } from "@/types/registerCommonProps";
import { error } from "console";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useRef, useState } from "react";

type FileUploadState = "idle" | "loading" | "done" | "error";

export default function TeacherPart2({
  t,
  isRTL,
  language,
  NextStep,
  PreviousStep,
  errors,
  register,
  registerFile,
}: RegisterCommonProps) {
  // Create your own ref
  const cvFileRef = useRef<HTMLInputElement | null>(null);

  // File upload states
  const [uploadState, setUploadState] = useState<FileUploadState>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Get the registerFile object
  const cvRegister = registerFile?.("cv");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

    // reset errors:
    errors.cv = undefined;

    const file = e.target.files?.[0];

    if (!file) {
      setUploadState("idle");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setUploadState("loading");
    setUploadProgress(0);

    try {
      // Call the original onChange from registerFile
      cvRegister?.onChange?.(e);

      // Simulate file processing/upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setUploadState("done");
            return 100;
          }
          return prev + 10;
        });
      }, 100);

      // You can add actual file validation here
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate processing time
    } catch (error) {
      console.error("File upload error:", error);
      setUploadState("error");
      setUploadProgress(0);
    }
  };

  const handleUploadClick = () => {
    cvFileRef.current?.click();
  };

  const getUploadButtonContent = () => {
    switch (uploadState) {
      case "loading":
        return {
          text: t("common.uploading"),
          icon: <Loader2 className="animate-spin" />,
          state: "outlined" as const,
          disabled: true,
        };
      case "done":
        return {
          text: t("common.uploaded"),
          icon: <CheckCircle />,
          state: "text" as const,
          disabled: false,
        };
      case "error":
        return {
          text: t("common.retry"),
          icon: <Upload />,
          state: "outlined" as const,
          disabled: false,
        };
      default:
        return {
          text: t("common.upload"),
          icon: <Upload />,
          state: "outlined" as const,
          disabled: false,
        };
    }
  };

  const uploadButtonContent = getUploadButtonContent();

  return (
    <div className="w-fit h-full p-10 flex flex-col justify-center items-center gap-10 mt-15">
      {/* Header */}
      <div className="flex flex-col justify-center items-center gap-2">
        <span className="font-semibold lg:text-4xl text-neutral-600 text-center text-2xl">
          {t("register.professor.page_2.title")}
        </span>
        <span className="font-medium lg:text-xl text-neutral-400 text-center text-base">
          {t("register.professor.page_2.description")}
        </span>
      </div>
      {/* input fileds */}
      <div
        className="flex flex-col gap-6 w-full justify-start items-start"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="flex flex-col gap-2 w-full">
          <div className="px-4 text-neutral-600 font-normal">
            {t("register.professor.page_2.questions.q_1")}
          </div>
          {errors.highSchool_experience && (
            <div className="font-medium text-base text-red-500 px-4">
              {t("errors.radio.required")}
            </div>
          )}
          <RadioButtonGroup
            options={[t("register.common.no"), t("register.common.yes")]}
            isRTL={isRTL}
            {...register("highSchool_experience")}
          />
        </div>
        <InputButton
          label={t("register.professor.page_2.questions.q_2")}
          type={"plus-minus"}
          errors={errors?.highSchool_experience_num}
          {...register("highSchool_experience_num")}
        />
        <div className="flex flex-col gap-2 w-full">
          <div className="px-4 text-neutral-600 font-normal">
            {t("register.professor.page_2.questions.q_3")}
          </div>
          {errors.offSchool_experience && (
            <div className="font-medium text-base text-red-500 px-4">
              {t("errors.radio.required")}
            </div>
          )}
          <RadioButtonGroup
            options={[t("register.common.no"), t("register.common.yes")]}
            isRTL={isRTL}
            {...register("offSchool_experience")}
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <div className="px-4 text-neutral-600 font-normal">
            {t("register.professor.page_2.questions.q_4")}
          </div>
          {errors.onlineSchool_experience && (
            <div className="font-medium text-base text-red-500 px-4">
              {t("errors.radio.required")}
            </div>
          )}
          <RadioButtonGroup
            options={[t("register.common.no"), t("register.common.yes")]}
            isRTL={isRTL}
            {...register("onlineSchool_experience")}
          />
        </div>
        {/* Enhanced file upload section */}
        <div className="w-full flex flex-col gap-2">
          <div className="flex flex-row justify-center items-center">
            <span className="font-normal text-base text-neutral-600 grow">
              {t("register.professor.page_2.questions.q_5")}
            </span>
            <div className="grow-0">
              <Button
                state={uploadButtonContent.state}
                size={"M"}
                icon_position={"left"}
                text={uploadButtonContent.text}
                icon={uploadButtonContent.icon}
                onClick={handleUploadClick}
                disabled={uploadButtonContent.disabled}
              />
            </div>
          </div>

          {/* Progress bar for loading state */}
          {/* {uploadState === "loading" && (
            <div className="w-full px-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <div className="text-sm text-neutral-500 mt-1">
                {uploadProgress}% completed
              </div>
            </div>
          )} */}

          {/* File info display */}
          {selectedFile && uploadState === "done" && (
            <div className="px-4 text-sm text-green-600 flex items-center gap-2">
              <CheckCircle size={16} />
              <span>
                {selectedFile.name} (
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          )}

          {/* Error state */}
          {uploadState === "error" && (
            <div className="px-4 text-sm text-red-500">
              Upload failed. Please try again.
            </div>
          )}

          {/* Show file upload error from validation */}
          {errors.cv && (
            <div className="font-normal text-base text-red-500 px-4">
              {errors.cv}
            </div>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={(el) => {
          cvFileRef.current = el;
          cvRegister?.ref(el);
        }}
        onChange={handleFileChange}
        name={cvRegister?.name}
        className="hidden"
        accept=".pdf,.doc,.docx"
      />

      {/* buttons */}
      <div className="flex flex-row gap-4 " dir={isRTL ? "rtl" : "ltr"}>
        <Button
          state={"outlined"}
          size={"M"}
          icon_position={isRTL ? "left" : "left"}
          text={t("register.common.previous")}
          icon={!isRTL ? <ArrowLeft /> : <ArrowRight />}
          onClick={PreviousStep}
        />
        <Button
          state={"filled"}
          size={"M"}
          icon_position={isRTL ? "right" : "right"}
          text={t("register.common.next")}
          icon={isRTL ? <ArrowLeft /> : <ArrowRight />}
          onClick={NextStep}
          disabled={uploadState === "loading"}
        />
      </div>
    </div>
  );
}
