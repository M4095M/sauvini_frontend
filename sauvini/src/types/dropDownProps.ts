export type DropDownProps = {
  label?: string;
  placeholder?: string;
  options?: DropDownOptionProps[];
  max_width?: string;

  // langauge specific:
  t?: any;
  isRTL?: boolean;
};

export type DropDownOptionProps = {
  id: string;
  text: string;
};
