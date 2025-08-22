import { Language } from "@/lib/language";

export type AuthRoleCardProps = {
  user: "teacher" | "student";
  icon: React.ReactNode;
  t: any;
  isRTL: boolean;
  language: Language
  onClick: any
}
