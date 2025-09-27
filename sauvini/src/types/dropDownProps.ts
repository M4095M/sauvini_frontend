export type DropDownProps = {
  label?: string;
  placeholder?: string;
  options?: DropDownOptionProps[];
  max_width?: string;
  onChange?: (value: unknown) => void;

  // langauge specific:
  t?: unknown;
  isRTL?: boolean;
};

export type DropDownOptionProps = {
  id: string;
  text: unknown;
};
