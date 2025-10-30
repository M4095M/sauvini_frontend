"use client"

import Image from "next/image"
import { Menu, Bell, Heart } from "lucide-react"
import { useSidebar } from "@/context/SideBarContext"
import { useLanguage } from "@/hooks/useLanguage"
import { UserProfile } from "@/types/modules"
import { ThemeSwitcher } from "../ui/theme-switcher"
import { LanguageSwitcher } from "../ui/language-switcher"

interface MobileHeaderProps {
  userProfile: UserProfile
}

export default function MobileHeader({ userProfile }: MobileHeaderProps) {
  const { toggle } = useSidebar()
  const { t, isRTL } = useLanguage()

  return (
    <header
      className="fixed top-0 left-0 right-0 z-30 bg-[#F8F8F8] dark:bg-[#1A1A1A] shadow-md"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section: Hamburger Menu */}
        <button
          onClick={toggle}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle navigation menu"
          type="button"
        >
          <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>

        {/* Center Section: Logo */}
        <div className="flex items-center justify-center">
          <Image
            src="/sauvini_logo.svg"
            alt="Sauvini"
            width={120}
            height={35}
            className="object-contain dark:brightness-150"
            priority
          />
        </div>

        {/* Right Section: Level Badge */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#CEDAE9] dark:bg-[#324C72]">
          <Heart
            className="w-4 h-4 text-[#324C72] dark:text-[#90B0E0] fill-current"
            aria-hidden="true"
          />
          <span className="text-xs font-medium text-[#324C72] dark:text-[#CEDAE9]">
            {t("modules.level")} {userProfile.level}
          </span>
        </div>
      </div>

      {/* Optional: User greeting bar (can be toggled on/off) */}
      <div className="px-4 pb-3 border-t border-gray-200 dark:border-gray-700 pt-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t("modules.keepGoing")}
        </p>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {userProfile.name} {userProfile.lastname}
        </h2>
      </div>
    </header>
  )
}
