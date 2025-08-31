"use client";

import Image from "next/image";
import { Heart, Bell, Sun, Moon } from "lucide-react";
import Button from "@/components/ui/button";
import { UserProfile } from "@/types/modules";
import { LanguageSwitcher } from "../ui/language-switcher";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "@/hooks/useTheme";
import React, { useCallback, useEffect, useMemo, useState } from "react";

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

const ThemeToggleButton = React.memo(function ThemeToggleButton({ className = "" }: { className?: string }) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDarkFromContext = resolvedTheme === "dark";

  const [isDarkLocal, setIsDarkLocal] = useState(isDarkFromContext);

  useEffect(() => setIsDarkLocal(isDarkFromContext), [isDarkFromContext]);

  const handleClick = useCallback(() => {
    setIsDarkLocal((v) => !v);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => toggleTheme(), 30);
      });
    });
  }, [toggleTheme]);

  const knobTranslate = useMemo(() => (isDarkLocal ? 1 : 0), [isDarkLocal]);

  return (
    <button
      onClick={handleClick}
      aria-pressed={isDarkLocal}
      aria-label={isDarkLocal ? "Switch to light theme" : "Switch to dark theme"}
      className={`flex items-center justify-center ${className}`}
      style={{ width: 104, height: 80, padding: 0, background: "transparent", border: "none" }}
      type="button"
    >
      <div
        role="presentation"
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="relative flex items-center"
          style={{
            flex: "1 0 0",
            borderRadius: 100,
            border: "2px solid var(--Button-Outline-Default-Blue, #324C72)",
            height: 56,
            paddingLeft: 16,
            paddingRight: 16,
            justifyContent: "space-between",
            alignItems: "center",
            boxSizing: "border-box",
            background: "transparent",
            willChange: "transform, background-color",
          }}
        >
          {/* Sun */}
          <div
            aria-hidden
            className="flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200"
            style={{
              background: isDarkLocal ? "transparent" : "var(--primary-300)",
              color: isDarkLocal ? "var(--primary-300)" : "#fff",
              flexShrink: 0,
            }}
          >
            <Sun className="w-4 h-4" />
          </div>

          {/* Moon */}
          <div
            aria-hidden
            className="flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200"
            style={{
              background: isDarkLocal ? "var(--primary-300)" : "transparent",
              color: isDarkLocal ? "#fff" : "var(--primary-300)",
              flexShrink: 0,
            }}
          >
            <Moon className="w-4 h-4" />
          </div>

          <div
            aria-hidden
            style={{
              position: "absolute",
              top: "50%",
              transform: `translateY(-50%) translateX(${knobTranslate === 1 ? "40px" : "0px"})`,
              transition: "transform 240ms cubic-bezier(.2,.9,.2,1)",
              width: 28,
              height: 28,
              borderRadius: 28,
              background: "transparent",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </button>
  );
});
ThemeToggleButton.displayName = "ThemeToggleButton";

export default function UserHeader({
  userProfile,
  isMobile = false,
  className = "",
}: UserHeaderProps) {
  const { t, isRTL } = useLanguage();

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
          <p className={`text-[#7C7C7C] dark:text-[#A0A0A0] text-[20px] font-medium leading-[30px] -tracking-[0.4px]`}>
            {t("modules.keepGoing")}
          </p>

          {/* User Name */}
          <h1 className={`text-gray-900 dark:text-white text-[36px] font-semibold -tracking-[0.72px] m-0`}>
            {userProfile.name} {userProfile.lastname}
          </h1>
        </div>
      </div>

      {/* Actions Section: Level, Notifications, Language Switcher, Theme Toggle */}
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

        {/* Theme Toggle */}
        <ThemeToggleButton className="ml-3" />
      </div>
    </header>
  );
}
