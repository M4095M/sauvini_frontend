export type DropDownProps = {
  label?: string;
  placeholder?: string;
  options?: DropDownOptionProps[];

  // langauge specific:
  t?: any;
  isRTL?: boolean;
};


export type DropDownOptionProps = {
  id: string;
  text: string
}
