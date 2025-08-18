import React from "react";

export type ButtonProps = {
  state: "filled" | "outlined" | "text" | "tonal" | "elevated";
  size: "XL" | "L" | "M" | "S" | "XS";
  icon_position: "icon-only" | "left" | "right" | "none";
  text?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void | Promise<void>;
};
