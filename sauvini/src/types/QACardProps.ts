export type QACardProps = {
  title: string;
  description: string;
  icon_type: "icon" | "button"
  icon: any;
  attachment?: any;
  onClick: () => void;
  isRTL: boolean
}