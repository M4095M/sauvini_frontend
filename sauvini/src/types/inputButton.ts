export type InputButtonProps = {
  label: string;
  type: "icon" | "plus-minus";
  icon?: React.ReactNode;
  icon_position?: "left" | "right";
  icon_filled?: boolean;
  max_width?: string;

  // refs for Form hook:
  ref?: unknown;
  name?: string;

  // actions:
  onClick?: () => void;

  // errors:
  errors?: string;
};
