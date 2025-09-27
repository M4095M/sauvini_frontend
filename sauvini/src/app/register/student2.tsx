import DropDown from "@/components/input/dropDown";
import PasswordInputField from "@/components/input/passwordInput";
import SimpleInput from "@/components/input/simpleInput";
import Button from "@/components/ui/button";
import { RegisterCommonProps } from "@/types/registerCommonProps";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function RegisterPart2({
  t,
  isRTL,
  language,
  NextStep,
  PreviousStep,
  register,
  errors,
}: RegisterCommonProps) {
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
      {/* input fields */}
      <div className="flex flex-col gap-6" dir={isRTL ? "rtl" : "ltr"}>
        <DropDown
          label={t("register.common.Academic_stream")}
          placeholder="الشعبة"
          options={[
            { id: 1, text: "علوم تجريبية" },
            { id: 2, text: " رياضيات" },
            { id: 3, text: "تقني رياضي" },
            { id: 4, text: "تسيير و اقتصاد" },
            { id: 5, text: "اداب و فلسفة" },
          ]}
          {...register("academic_stream")}
          errors={errors?.academic_stream}
        />
        <SimpleInput
          label={t("register.common.email")}
          value={""}
          type="text"
          {...register("email")}
          errors={errors?.email}
        />
        <div className="flex flex-row flex-wrap gap-4">
          {/* <SimpleInput label={"Password"} value={""} type="password" /> */}
          {/* <SimpleInput label={"Confirm password"} value={""} type="password" /> */}
          <PasswordInputField
            label={t("register.common.password")}
            {...register("password")}
            errors={errors?.password}
            isRTL={isRTL}
          />
          <PasswordInputField
            label={t("register.common.confirm_password")}
            {...register("confirmPassword")}
            errors={errors?.confirmPassword}
            isRTL={isRTL}
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
        />
        <Button
          state={"filled"}
          size={"M"}
          icon_position={isRTL ? "right" : "right"}
          text={t("register.common.next")}
          icon={isRTL ? <ArrowLeft /> : <ArrowRight />}
          onClick={NextStep}
        />
      </div>
    </div>
  );
}
