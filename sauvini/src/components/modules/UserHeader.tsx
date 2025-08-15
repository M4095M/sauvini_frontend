"use client";

import Image from "next/image";
import { Heart, Bell } from "lucide-react";
import Button from "@/components/ui/button";
import { UserProfile } from "@/types/modules";
import { LanguageSwitcher } from "../ui/language-switcher";
import { useLanguage } from "@/hooks/useLanguage";
import { RTL_LANGUAGES } from "@/lib/language";

interface UserHeaderProps {
  userProfile: UserProfile;
  isMobile?: boolean;
  className?: string;
}

const USER_HEADER_STYLES = {
  container: {
    padding: 12,
    borderRadius: 56,
  },
  profileCard: {
    width: 373,
    gap: 16,
  },
  avatar: {
    width: 81,
    height: 81,
  },
  actionsContainer: {
    gap: 16,
  },
  notificationsButton: {
    width: 179,
  },
} as const;

export default function UserHeader({
  userProfile,
  isMobile = false,
  className = "",
}: UserHeaderProps) {
  const { t, language, isRTL } = useLanguage();

  if (isMobile) {
    return null;
  }

  return (
    <header
      className={`
        flex justify-between items-center self-stretch
        bg-[#F8F8F8] dark:bg-[#1A1A1A]
        ${className}
      `}
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        padding: USER_HEADER_STYLES.container.padding,
        borderRadius: USER_HEADER_STYLES.container.borderRadius,
      }}
    >
      {/* Student Profile Card */}
      <div
        className={`flex items-center`}
        style={{
          width: USER_HEADER_STYLES.profileCard.width,
          gap: USER_HEADER_STYLES.profileCard.gap,
        }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Profile Picture */}
        <div
          className="flex justify-center items-center flex-shrink-0 relative overflow-hidden rounded-full"
          style={{
            width: USER_HEADER_STYLES.avatar.width,
            height: USER_HEADER_STYLES.avatar.height,
            aspectRatio: "1/1",
          }}
        >
          <Image
            src={userProfile.avatar || "/placeholder.svg"}
            alt={`${userProfile.name} ${userProfile.lastname} profile picture`}
            fill
            className="object-cover"
            sizes="81px"
            priority
          />
        </div>

        {/* Text Frame */}
        <div className={`flex flex-col items-start flex-1`}>
          <p
            className={`text-[#7C7C7C] dark:text-[#A0A0A0] text-[20px] font-medium leading-[30px] -tracking-[0.4px]
              `}
          >
            {t("modules.keepGoing")}
          </p>

          {/* User Name */}
          <h1
            className={`text-gray-900 dark:text-white text-[36px] font-semibold -tracking-[0.72px] m-0
              `}
          >
            {userProfile.name} {userProfile.lastname}
          </h1>
        </div>
      </div>

      {/* Actions Section: Level, Notifications, Language Switcher */}
      <div
        className={`flex items-center`}
        style={{ gap: USER_HEADER_STYLES.actionsContainer.gap }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Level Badge */}
        <div className="flex items-center gap-2 px-6 py-4 rounded-full shadow-sm bg-[#CEDAE9] dark:bg-[#324C72]">
          <Heart
            className="w-5 h-5 text-[#324C72] dark:text-[#90B0E0] fill-current"
            aria-hidden="true"
          />
          <span
            className={`text-sm font-medium text-[#324C72] dark:text-[#CEDAE9] `}
          >
            {t("modules.level")} {userProfile.level}
          </span>
        </div>

        {/* Notifications Button */}
        <div
          className="flex items-center"
          style={{ width: USER_HEADER_STYLES.notificationsButton.width }}
        >
          <Button
            state="filled"
            size="M"
            icon_position="left"
            icon={
              <Bell
                className="w-5 h-5"
                style={{ color: "#CEDAE9" }}
                aria-hidden="true"
              />
            }
            text={t("modules.notifications")}
          />
        </div>

        {/* Language Switcher */}
        <LanguageSwitcher />
      </div>
    </header>
  );
}
