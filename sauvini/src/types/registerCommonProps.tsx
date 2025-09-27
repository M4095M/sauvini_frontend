import { RegisterRequest } from "@/app/register/page";
import { Language } from "@/lib/language";
import { FormErrors } from "./api";

export type RegisterCommonProps = {
  t: any;
  isRTL: boolean;
  language: Language;
  NextStep: any;
  PreviousStep: any;

  // used to register input fields
  register: (name: keyof RegisterRequest) => {
    ref: (el: HTMLInputElement | null) => void;
    name: string;
  };

  // registerFile:
  registerFile?: (name: keyof RegisterRequest) => {
    ref: (el: HTMLInputElement | null) => void;
    name: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };

  // validations:
  errors: FormErrors<RegisterRequest>;
};
