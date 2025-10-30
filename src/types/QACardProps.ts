export type QACardProps = {
  title: string;
  description: string;
  icon_type: "icon" | "button"
  icon: unknown;
  attachment?: unknown;
  onClick: () => void;
  isRTL: boolean
}