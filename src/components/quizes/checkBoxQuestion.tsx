import CheckBox from "./checkBox";

type checkBoxQuestion = {
  option: string;
  isRTL: boolean;
  max_width?: string;
  state: boolean;
  onChange: (isChecked: boolean) => void;
};

export default function CheckBoxQuestion({
  option,
  isRTL,
  max_width = "max-w-3xl",
  state,
  onChange,
}: checkBoxQuestion) {
  return (
    <div
      className={`px-9 py-5 flex items-center gap-3 bg-white w-full ${max_width} ${
        isRTL ? "hover:border-r-2" : "hover:border-l-2"
      }  rounded-2xl hover:border-[var(--primary-300)]`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* <CheckBox isChecked={false} /> */}
      <CheckBox isChecked={state} onChange={onChange} />
      <span className="font-normal text-base text-primary-600">{option}</span>
    </div>
  );
}
