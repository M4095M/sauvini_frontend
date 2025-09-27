import { RegisterRequest } from "@/app/register/page";
import { Language } from "@/lib/language";
import { FormErrors } from "./api";

export type RegisterCommonProps = {
  t: (key: string) => string;
  isRTL: boolean;
  language: Language;


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

  NextStep: any;
  PreviousStep: any;

};
