export type SimpleInputProps = {
  label: string;
  value: string;
  type: string;
  long?: boolean;
  max_width?: string;
  max_hight?: string; // for textarea

  // refs:
  name?: string;

  // errors:
  errors?: string;

  ref?: unknown;
};
