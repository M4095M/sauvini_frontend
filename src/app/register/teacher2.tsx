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
  AlertCircle,
  FileText,
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

  // Get the registerFile object
  const cvRegister = registerFile?.("cv");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear real-time errors
    handleFieldChange("cv", null);

    const file = e.target.files?.[0];

    if (!file) {
      setUploadState("idle");
      setSelectedFile(null);
      return;
    }

    // File validation
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (file.size > maxSize) {
      setRealTimeErrors((prev) => ({
        ...prev,
        cv: "File size must be less than 10MB",
      }));
      setUploadState("error");
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setRealTimeErrors((prev) => ({
        ...prev,
        cv: "Please upload a PDF or Word document (.pdf, .doc, .docx)",
      }));
      setUploadState("error");
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

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (error) {
      console.error("File upload error:", error);
      setUploadState("error");
      setUploadProgress(0);
      setRealTimeErrors((prev) => ({
        ...prev,
        cv: "File upload failed. Please try again.",
      }));
    }
  };

  const handleUploadClick = () => {
    cvFileRef.current?.click();
  };

  const handleNextStep = async () => {
    setIsLoading(true);
    try {
      await NextStep();
    } finally {
      setIsLoading(false);
    }
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

      {/* General error display */}
      {(errors as any)?.general && (
        <div className="w-full max-w-2xl bg-red-50 border border-red-200 rounded-lg p-4 animate-in fade-in-0 slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700 font-medium text-sm">
              {(errors as any).general}
            </span>
          </div>
        </div>
      )}
      {/* input fileds */}
      <div
        className="flex flex-col gap-6 w-full justify-start items-start"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="flex flex-col gap-2 w-full">
          <div className="px-4 text-neutral-600 font-normal">
            {t("register.professor.page_2.questions.q_1")}
          </div>
          <RadioButtonGroup
            options={[t("register.common.no"), t("register.common.yes")]}
            isRTL={isRTL}
            errors={
              errors?.highSchool_experience ||
              realTimeErrors.highSchool_experience
            }
            {...register("highSchool_experience")}
            onChange={(value) => {
              handleFieldChange("highSchool_experience", value);
            }}
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <InputButton
            label={t("register.professor.page_2.questions.q_2")}
            type={"number-input"}
            errors={
              errors?.highSchool_experience_num ||
              realTimeErrors.highSchool_experience_num
            }
            {...register("highSchool_experience_num")}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleFieldChange("highSchool_experience_num", e.target.value);
            }}
          />
          <div className="px-4 text-xs text-neutral-500">
            Only required if you have high school teaching experience
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <div className="px-4 text-neutral-600 font-normal">
            {t("register.professor.page_2.questions.q_3")}
          </div>
          <RadioButtonGroup
            options={[t("register.common.no"), t("register.common.yes")]}
            isRTL={isRTL}
            errors={
              errors?.offSchool_experience ||
              realTimeErrors.offSchool_experience
            }
            {...register("offSchool_experience")}
            onChange={(value) => {
              handleFieldChange("offSchool_experience", value);
            }}
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <div className="px-4 text-neutral-600 font-normal">
            {t("register.professor.page_2.questions.q_4")}
          </div>
          <RadioButtonGroup
            options={[t("register.common.no"), t("register.common.yes")]}
            isRTL={isRTL}
            errors={
              errors?.onlineSchool_experience ||
              realTimeErrors.onlineSchool_experience
            }
            {...register("onlineSchool_experience")}
            onChange={(value) => {
              handleFieldChange("onlineSchool_experience", value);
            }}
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

          {/* File upload hint */}
          <div className="px-4 text-xs text-neutral-500 flex items-center gap-1">
            <FileText size={12} />
            <span>Accepted formats: PDF, DOC, DOCX (max 10MB)</span>
          </div>

          {/* Progress bar for loading state */}
          {uploadState === "loading" && (
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
          )}

          {/* File info display */}
          {selectedFile && uploadState === "done" && (
            <div className="px-4 text-sm text-green-600 flex items-center gap-2 animate-in fade-in-0 slide-in-from-top-1 duration-200">
              <CheckCircle size={16} />
              <span>
                {selectedFile.name} (
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          )}

          {/* Error state */}
          {uploadState === "error" && (
            <div className="px-4 text-sm text-red-500 flex items-center gap-2 animate-in fade-in-0 slide-in-from-top-1 duration-200">
              <AlertCircle size={16} />
              <span>Upload failed. Please try again.</span>
            </div>
          )}

          {/* Show file upload error from validation */}
          {(errors?.cv || realTimeErrors.cv) && (
            <div className="px-4 text-sm text-red-500 flex items-center gap-2 animate-in fade-in-0 slide-in-from-top-1 duration-200">
              <AlertCircle size={16} />
              <span>{errors?.cv || realTimeErrors.cv}</span>
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
          text={isLoading ? "Validating..." : t("register.common.next")}
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
          disabled={uploadState === "loading" || isLoading}
        />
      </div>
    </div>
  );
}
