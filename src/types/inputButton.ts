export type InputButtonProps = {
  label: string;
  type: "icon" | "plus-minus" | "number-input";
  icon?: React.ReactNode;
  icon_position?: "left" | "right";
  icon_filled?: boolean;
  max_width?: string;

  // refs for Form hook:
  ref?: React.RefObject<HTMLInputElement>;
  name?: string;

  // actions:
  onClick?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

  // errors:
  errors?: string;
};
