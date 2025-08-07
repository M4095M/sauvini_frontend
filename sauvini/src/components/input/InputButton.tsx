import { InputButtonProps } from "@/types/inputButton";

export default function InputButton({ label, type, icon }: InputButtonProps) {
  const returnButton = (type: string) => {
    switch (type) {
      case "icon":
        return <div className="">{icon}</div>;
      case "plus-minus":
        return (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <span className="font-work-sans text-primary-300 text-xl border-b-2 border-neutral-200 w-full text-center cursor-pointer select-none">+</span>
            <span className="font-work-sans text-primary-300 text-xl  w-full text-center cursor-pointer select-none">-</span>
          </div>
        );

      default:
        break;
    }
  };

  return (
    <div className="h-12 max-w-[37rem] w-full ">
      {/* label */}
      <div className="font-normal text-base font-work-sans px-3 pb-1">{label}</div>
      <div className="h-full flex justify-start items-center">
        <input
          type="text"
          className="w-full max-w-128 h-full rounded-tl-full rounded-bl-full border border-neutral-200 px-4 peer
         focus:outline-none focus:border-2 focus:border-neutral-300 font-work-sans "
        />
        <div className="h-full w-20  rounded-tr-full rounded-br-full bg-primary-100 peer-focus:bg-primary-300 overflow-hidden">
          {returnButton(type)}
        </div>
      </div>
    </div>
  );
}
