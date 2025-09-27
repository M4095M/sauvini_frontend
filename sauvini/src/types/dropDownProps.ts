export type DropDownProps = {
  label?: string;
  placeholder?: string;
  options?: DropDownOptionProps[];
  max_width?: string;
  onChange?: (value: unknown) => void;

  // langauge specific:
  t?: unknown;
  isRTL?: boolean;

  // refs:
  name?: string;
  ref?: any;

  // errors:
  errors?: string;
};

export type DropDownOptionProps = {

  id: number;
  text: string;
};
