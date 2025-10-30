import DropDown from "@/components/input/dropDown";
import PasswordInputField from "@/components/input/passwordInput";
import SimpleInput from "@/components/input/simpleInput";
import Button from "@/components/ui/button";
import { RegisterCommonProps } from "@/types/registerCommonProps";
import { ArrowLeft, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import {
  AcademicStreamsApi,
  FrontendAcademicStream,
} from "@/api/academicStreams";

export default function RegisterPart2({
  t,
  isRTL,
  language,
  NextStep,
  PreviousStep,
  register,
  errors,
}: RegisterCommonProps) {
  // State for loading and real-time errors
  const [isLoading, setIsLoading] = useState(false);
  const [realTimeErrors, setRealTimeErrors] = useState<
    Partial<Record<string, string>>
  >({});

  // State for academic streams
  const [academicStreams, setAcademicStreams] = useState<
    FrontendAcademicStream[]
  >([]);
  const [isStreamsLoading, setIsStreamsLoading] = useState(true);
  const [streamsError, setStreamsError] = useState<string | null>(null);

  // Load academic streams from database
  useEffect(() => {
    const fetchAcademicStreams = async () => {
      try {
        setIsStreamsLoading(true);
        setStreamsError(null);
        const response =
          await AcademicStreamsApi.getAcademicStreamsForFrontend();

        if (response.success && response.data) {
          setAcademicStreams(response.data);
          console.log("Loaded academic streams:", response.data);
        } else {
          const errorMsg =
            response.message || "Failed to fetch academic streams";
          setStreamsError(errorMsg);
          console.warn("Failed to fetch academic streams:", errorMsg);
        }
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error";
        setStreamsError(errorMsg);
        console.error("Error fetching academic streams:", error);
      } finally {
        setIsStreamsLoading(false);
      }
    };

    fetchAcademicStreams();
  }, []);

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
          {t("register.student.page_2.title")}
        </span>
        <span className="font-medium lg:text-xl text-neutral-400 text-center text-base">
          {t("register.student.page_2.description")}
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

      {/* Academic streams loading error */}
      {streamsError && (
        <div className="w-full max-w-md bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3 animate-in fade-in-0 slide-in-from-top-1 duration-200">
          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
          <div className="text-yellow-700 text-sm font-medium">
            {streamsError}
          </div>
        </div>
      )}
      {/* input fields */}
      <div className="flex flex-col gap-6" dir={isRTL ? "rtl" : "ltr"}>
        <DropDown
          label={t("register.common.Academic_stream")}
          t={t}
          isRTL={isRTL}
          placeholder={
            isStreamsLoading
              ? "Loading streams..."
              : "Select your academic stream"
          }
          options={academicStreams.map((stream) => ({
            id: stream.id,
            text: language === "ar" ? stream.name_ar : stream.name, // Use Arabic name for Arabic language, English for others
          }))}
          {...register("academic_stream")}
          errors={errors?.academic_stream || realTimeErrors.academic_stream}
          searchable={true}
          onChange={(value) => {
            const selectedStream = academicStreams.find((s) => s.id === value);
            const streamName = selectedStream
              ? language === "ar"
                ? selectedStream.name_ar
                : selectedStream.name
              : "";
            handleFieldChange("academic_stream", streamName);
          }}
          disabled={isStreamsLoading}
        />
        <SimpleInput
          label={t("register.common.email")}
          type="text"
          {...register("email")}
          errors={errors?.email || realTimeErrors.email}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => {
            handleFieldChange("email", e.target.value);
          }}
        />
        <div className="flex flex-row flex-wrap gap-4">
          <PasswordInputField
            label={t("register.common.password")}
            {...register("password")}
            errors={errors?.password || realTimeErrors.password}
            isRTL={isRTL}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleFieldChange("password", e.target.value);
            }}
          />
          <PasswordInputField
            label={t("register.common.confirm_password")}
            {...register("password_confirm")}
            errors={errors?.password_confirm || realTimeErrors.password_confirm}
            isRTL={isRTL}
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
          disabled={isLoading || isStreamsLoading}
        />
      </div>
    </div>
  );
}
