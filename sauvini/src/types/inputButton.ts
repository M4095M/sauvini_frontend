export type InputButtonProps = {
  label: string
  type: "icon" | "plus-minus";
  icon?: React.ReactNode;
  icon_position?: "left" | "right"
  icon_filled?: boolean
  max_width?: string;
}