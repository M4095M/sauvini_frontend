import { Language } from "@/lib/language";

export type AuthRoleCardProps = {
  user: "teacher" | "student";
  icon: React.ReactNode;
  t: unknown;
  isRTL: boolean;
  language: Language
  onClick: unknown
}
