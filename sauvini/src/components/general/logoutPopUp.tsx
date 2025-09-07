import Button from "../ui/button";

type LogoutPopUpProps = {
  onClose?: () => void;
}

export default function LogoutPopUp({ onClose }: LogoutPopUpProps) {
  return (
    <div className="max-w-4xl w-full rounded-[60px] bg-neutral-100 md:px-10 px-5 py-11 flex flex-col gap-16">
      {/* title */}
      <div className="flex flex-col gap-4">
        <div className="font-semibold text-neutral-600 md:text-5xl text-3xl">Log Out</div>
        <div className="md:text-2xl text-xl  text-neutral-400 font-medium">
          Are you sure you want to log out of your account?
        </div>
      </div>
      {/* actions */}
      <div className="flex gap-5">
        <Button
          state={"tonal"}
          size={"XS"}
          icon_position={"none"}
          text="Cancel"
          onClick={onClose}
        /> 
        <Button
          state={"filled"}
          size={"XS"}
          icon_position={"none"}
          text="Log out"
          optionalStyles="bg-error-400"
        />
      </div>
    </div>
  );
}
