import { RadioButtonProps } from "@/types/radio-button";

export default function RadioButton({ state, color }: RadioButtonProps) {
  return (
    <div className="relative flex justify-end items-center pt-3 px-3 ">
      <label className="cursor-pointer">
        <input
          type="radio"
          name="role"
          value={state}
          className="peer sr-only"
          checked={state === "clicked"}
          readOnly
        />
        <div
          className={`rounded-[50%] w-5 h-5 border-2 transition-all duration-200 flex justify-center items-center
            ${circleColor(state, color)}
            peer-checked:border-${color} peer-checked:bg-primary-100
            peer-hover:border-primary-200 peer-hover:bg-neutral-100
            peer-focus:ring-2 peer-focus:ring-primary-200 peer-focus:ring-offset-1
          `}
        >
          {/* Inner dot for checked state */}
          <div
            className={`rounded-[50%] w-2 h-2 transition-all duration-200
              ${state === "clicked" ? `bg-${color}` : `bg-transparent`}
            `}
          />
        </div>
      </label>
    </div>
  );
}

function circleColor(state: string, color: string) {
  switch (state) {
    case "hover":
      return `border-${color}`;
    case "clicked":
      return `border-${color}`;
    default:
      return `border-neutral-300 bg-white`;
  }
}
