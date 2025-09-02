import RadioCircle from "./radioCircle";

type radioQuestionProps = {
  id: number;
  option: string;
  isRTL: boolean;
  state: boolean;
  max_width?: string;
  onCheck: (index: number) => void;
};

export default function RadioQuestion({
  id,
  option,
  isRTL,
  state,
  onCheck,
  max_width = "max-w-3xl",
}: radioQuestionProps) {
  return (
    <div
      className={`px-9 py-5 flex items-center gap-3 bg-white w-full ${max_width} ${
        isRTL ? "hover:border-r-2" : "hover:border-l-2"
      } rounded-2xl hover:border-[var(--primary-300)]`}
      dir={isRTL ? "rtl" : "ltr"}
      onClick={() => {
        onCheck(id);
      }}
    >
      {/* <CheckBox isChecked={false} /> */}
      <RadioCircle checked={state} />
      <span className="font-normal text-base text-primary-600">{option}</span>
    </div>
  );
}
