import Button from "../ui/button";

export default function LogoutPopUp() {
  return (
    <div className="max-w-4xl w-full rounded-[60px] bg-neutral-100 px-10 py-11 flex flex-col gap-16">
      {/* title */}
      <div className="flex flex-col gap-4">
        <div className="font-semibold text-neutral-600 text-5xl">Log Out</div>
        <div className="text-2xl text-neutral-400 font-medium">
          Are you sure you want to log out of your account?
        </div>
      </div>
      {/* actions */}
      <div className="flex gap-5">
        <Button
          state={"tonal"}
          size={"M"}
          icon_position={"none"}
          text="Cancel"
        /> 
        <Button
          state={"filled"}
          size={"M"}
          icon_position={"none"}
          text="Log out"
          optionalStyles="bg-error-400"
        />
      </div>
    </div>
  );
}
