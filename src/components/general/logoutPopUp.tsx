import Button from "../ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";

type LogoutPopUpProps = {
  onClose?: () => void;
};

export default function LogoutPopUp({ onClose }: LogoutPopUpProps) {
  const { logout } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      onClose?.();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="max-w-4xl w-full rounded-[60px] bg-neutral-100 md:px-10 px-5 py-11 flex flex-col gap-16">
      {/* title */}
      <div className="flex flex-col gap-4">
        <div className="font-semibold text-neutral-600 md:text-5xl text-3xl">
          Log Out
        </div>
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
          disabled={isLoggingOut}
        />
        <Button
          state={"filled"}
          size={"XS"}
          icon_position={"none"}
          text={isLoggingOut ? "Logging out..." : "Log out"}
          optionalStyles="bg-error-400"
          onClick={handleLogout}
          disabled={isLoggingOut}
        />
      </div>
    </div>
  );
}
