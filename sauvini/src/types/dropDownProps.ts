export type DropDownProps = {
  label?: string;
  placeholder?: string;
  options?: DropDownOptionProps[];
  max_width?: string;
  onChange?: (value: any) => void;

  // langauge specific:
  t?: any;
  isRTL?: boolean;
};

export type DropDownOptionProps = {
  id: string;
  text: any;
};
