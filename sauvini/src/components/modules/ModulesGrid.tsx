"use client";

import Image from "next/image";
import { Heart, Bell, Menu } from "lucide-react";
import { Module } from "@/types/modules";
import ModuleCard from "./ModuleCard";
import { useLanguage } from "@/hooks/useLanguage";
import { RTL_LANGUAGES } from "@/lib/language";
import { useSidebar } from "@/context/SideBarContext";

interface ModulesGridProps {
  modules: Module[];
  showPurchasedOnly: boolean;
  onToggleChange: (value: boolean) => void;
  isMobile?: boolean;
  userLevel?: number;
}

export default function ModulesGrid({
  modules,
  showPurchasedOnly,
  onToggleChange,
  isMobile = false,
  userLevel = 6,
}: ModulesGridProps) {
  const { t, language, isRTL } = useLanguage();
  const { toggle } = useSidebar();
  const noModules = modules.length === 0;

  return (
    <div
      className="flex flex-col items-start rounded-[52px] bg-[#F8F8F8] dark:bg-[#1A1A1A] w-full"
      style={{
        padding: isMobile ? "24px 0px" : "24px",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      {/* Mobile Header with Logo, Level, Notifications */}
      {isMobile && (
        <div
          className={`flex justify-between items-end w-full px-4 mb-4 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          {/* S Logo */}
          <div>
            <Image
              src="/S_logo.svg"
              alt="Sauvini S Logo"
              width={40}
              height={40}
              className="dark:brightness-150" // Slightly brighten logo in dark mode (same everywhere else tho)
            />
          </div>

          {/* Right Section: Level + Notifications */}
          <div
            className={`flex items-center gap-3 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            {/* Level Badge */}
            <div className="flex items-center gap-2 bg-[#DCE6F5] dark:bg-[#2B3E5A] px-3 py-2 rounded-full">
              <Heart className="w-4 h-4 text-[#324C72] dark:text-[#90B0E0] fill-current" />
              <span
                className={`text-sm font-medium text-gray-700 dark:text-gray-300 ${
                  isRTL ? "font-arabic" : "font-sans"
                }`}
              >
                {t("modules.level")} {userLevel}
              </span>
            </div>

            {/* Notifications Icon Only */}
            <button
              className="flex items-center justify-center w-10 h-10 bg-[#DCE6F5] dark:bg-[#2B3E5A] rounded-full"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-[#324C72] dark:text-[#90B0E0]" />
            </button>

            {/* Menu Button */}
            <button
              className="flex items-center justify-center w-10 h-10 bg-[#DCE6F5] dark:bg-[#2B3E5A] rounded-full"
              onClick={toggle}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-[#324C72] dark:text-[#90B0E0]" />
            </button>
          </div>
        </div>
      )}

      {/* Modules Title and Toggle */}
      <div
        className={`w-full mb-6 ${
          isMobile ? "px-4" : ""
        } flex flex-col gap-1 items-start ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        {/* title */}
        <h2
          className={`text-2xl font-bold text-gray-900 dark:text-white mb-4 ${
            isRTL ? "font-arabic" : "font-sans"
          }`}
        >
          {t("modules.modulesTitle")}
        </h2>

        {/* toggle */}
        <div className={`flex items-center gap-3 `} dir={isRTL ? "rtl" : "ltr"}>
          <span
            className={`text-sm text-gray-600 dark:text-gray-300 ${
              isRTL ? "font-arabic" : "font-sans"
            }`}
          >
            {t("modules.showPurchasedOnly")}
          </span>
          <button
            onClick={() => onToggleChange(!showPurchasedOnly)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              showPurchasedOnly
                ? "bg-[#324C72]"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
                showPurchasedOnly ? (isRTL ? "left-1" : "right-1") : isRTL ? "right-1" : "left-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Modules Grid */}
      <div className={`w-full ${isMobile ? "px-4" : ""}`}>
        {noModules ? (
          <div className="flex flex-col items-center justify-center w-full py-16">
            <p
              className={`text-lg text-gray-500 dark:text-gray-400 text-center ${
                isRTL ? "font-arabic" : "font-sans"
              }`}
            >
              {t("modules.noPurchasedModules")}
            </p>
          </div>
        ) : (
          <div
            className={`grid gap-6 w-full ${
              isMobile
                ? "grid-cols-1"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {modules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                isMobile={isMobile}
                isRTL={isRTL}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
