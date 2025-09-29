export type DropDownProps = {
  label?: string;
  placeholder?: string;
  options?: DropDownOptionProps[];
  max_width?: string;
  onChange?: (value: any) => void;

  // langauge specific:
  t?: any;
  isRTL?: boolean;

  // refs:
  name?: string;
  ref?: any;

  // errors:
  errors?: string;
};

export type DropDownOptionProps = {

  id: number | string;
  text: string;
};
