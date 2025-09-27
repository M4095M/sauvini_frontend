export type SimpleInputProps = {
  label: string
  value: string
  type: string
  long?: boolean
  max_width?: string
  max_hight?: string; // for textarea

  // refs:
  name?: string;
  ref?: any;

  // errors:
  errors?: string;
}