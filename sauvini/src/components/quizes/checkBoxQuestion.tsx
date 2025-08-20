import CheckBox from "./checkBox";

type checkBoxQuestion = {
  option: string;
  isRTL: boolean;
};

export default function CheckBoxQuestion({ option, isRTL }: checkBoxQuestion) {
  return (
    <div
      className="px-9 py-5 flex items-center gap-3 bg-white w-full max-w-3xl hover:border-r-2 rounded-2xl hover:border-primary-100"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* <CheckBox isChecked={false} /> */}
      <CheckBox isChecked={false} />
      <span className="font-normal text-base text-primary-600">{option}</span>
    </div>
  );
}
