export type AlertProps = {
  title: string;
  description?: string;
  type: "success" | "error" | "default" | "warning";
}