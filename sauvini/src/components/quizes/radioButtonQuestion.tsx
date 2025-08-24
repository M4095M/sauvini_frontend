import RadioCircle from "./radioCircle";

type radioQuestionProps = {
  option: string;
  isRTL: boolean;
  max_width?: string;
};

export default function RadioQuestion({
  option,
  isRTL,
  max_width = "max-w-3xl",
}: radioQuestionProps) {
  return (
    <div
      className={`px-9 py-5 flex items-center gap-3 bg-white w-full ${max_width} hover:border-r-2 rounded-2xl hover:border-primary-100`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* <CheckBox isChecked={false} /> */}
      <RadioCircle checked={false} />
      <span className="font-normal text-base text-primary-600">{option}</span>
    </div>
  );
}
