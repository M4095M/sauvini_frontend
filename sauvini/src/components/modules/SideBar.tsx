"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";
import { useSidebar } from "@/context/SideBarContext";
import {
  BookOpen,
  FileQuestion,
  Dumbbell,
  HelpCircle,
  Award,
  Bell,
  User,
  LogOut,
  X,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const navigationItems: NavItem[] = [
  { href: "/modules", label: "modules", icon: BookOpen },
  { href: "/exams", label: "exams", icon: FileQuestion },
  { href: "/exercises", label: "exercises", icon: Dumbbell },
  { href: "/questions", label: "questions", icon: HelpCircle },
  { href: "/badges", label: "badges", icon: Award },
  { href: "/notifications", label: "notifications", icon: Bell },
];

function DesktopSidebar() {
  const pathname = usePathname();
  const { isRTL, t } = useLanguage();

  // Check if user is on any learning page (modules, chapters, lessons)
  const isOnLearningPages =
    pathname.startsWith("/modules") ||
    pathname.startsWith("/chapters") ||
    pathname.startsWith("/lessons");

  // Check if user is on profile page
  const isOnProfilePage = pathname === "/profile" || pathname.startsWith("/profile/");

  return (
    <aside
      className={`fixed top-0 z-20 h-screen ${isRTL ? "right-0" : "left-0"}`}
      style={{ width: 240 }}
    >
      <div
        className={`h-full bg-[#F8F8F8] dark:bg-[#1A1A1A] flex flex-col py-6 ${
          isRTL ? "rounded-l-[44px]" : "rounded-r-[44px]"
        }`}
        style={{ alignSelf: "stretch" }}
      >
        {/* Top Section with Logo and Links */}
        <div className="flex flex-col items-center flex-1">
          {/* Logo Frame */}
          <div
            className="flex items-center justify-center mb-8"
            style={{
              width: 192,
              height: 56,
              aspectRatio: "24/7",
            }}
          >
            <Image
              src="/sauvini_logo.svg"
              alt="Sauvini"
              width={192}
              height={56}
              className="object-contain dark:brightness-150"
              priority
            />
          </div>

          {/* Links Frame */}
          <nav
            className="flex flex-col items-start"
            style={{
              width: 192,
              gap: 24,
            }}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {navigationItems.map(({ href, label, icon: Icon }) => {
              // For modules link, check if on any learning page
              const isActive =
                href === "/modules"
                  ? isOnLearningPages
                  : pathname === href || pathname.startsWith(`${href}/`);

              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center transition-all duration-200  ${
                    isActive
                      ? "bg-[#324C72] text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                  style={{
                    display: "flex",
                    padding: "12px 20px",
                    alignItems: "center",
                    gap: 12,
                    alignSelf: "stretch",
                    borderRadius: 26,
                    direction: isRTL ? "rtl" : "ltr",
                  }}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span
                    className={`text-sm font-medium ${
                      isRTL ? "font-arabic text-right" : "font-sans text-left"
                    }`}
                  >
                    {t(`navigation.${label}`) || label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Frame */}
        <div
          className="flex flex-col items-start"
          style={{
            width: 192,
            gap: 24,
            alignSelf: "center",
          }}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <Link
            href="/profile"
            className={`flex items-center transition-all duration-200 ${
              isOnProfilePage
                ? "bg-[#324C72] text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            style={{
              display: "flex",
              padding: "12px 20px",
              alignItems: "center",
              gap: 12,
              alignSelf: "stretch",
              borderRadius: 26,
              direction: isRTL ? "rtl" : "ltr",
            }}
          >
            <User className="w-5 h-5 flex-shrink-0" />
            <span
              className={`text-sm font-medium ${
                isRTL ? "font-arabic text-right" : "font-sans text-left"
              }`}
            >
              {t("navigation.profile") || "Profile"}
            </span>
          </Link>

          <button
            type="button"
            className={`flex items-center text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 `}
            style={{
              display: "flex",
              padding: "12px 20px",
              alignItems: "center",
              gap: 12,
              alignSelf: "stretch",
              borderRadius: 26,
              direction: isRTL ? "rtl" : "ltr",
            }}
            onClick={() => {
              // Handle logout logic here
              console.log("Logout clicked");
            }}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span
              className={`text-sm font-medium ${
                isRTL ? "font-arabic text-right" : "font-sans text-left"
              }`}
            >
              {t("navigation.logout") || "Log out"}
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}

function MobileDrawer() {
  const { isOpen, close } = useSidebar();
  const pathname = usePathname();
  const { isRTL, t } = useLanguage();

  // Check if user is on any learning page (modules, chapters, lessons)
  const isOnLearningPages =
    pathname.startsWith("/modules") ||
    pathname.startsWith("/chapters") ||
    pathname.startsWith("/lessons");

  // Check if user is on profile page
  const isOnProfilePage = pathname === "/profile" || pathname.startsWith("/profile/");

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 z-50 h-full w-80 max-w-[85vw] bg-[#F8F8F8] dark:bg-[#1A1A1A] shadow-2xl transform transition-all duration-300 ease-out ${
          isRTL ? "right-0" : "left-0"
        } ${
          isOpen
            ? "translate-x-0 scale-100"
            : isRTL
            ? "translate-x-full scale-95"
            : "-translate-x-full scale-95"
        }`}
        style={{
          borderRadius: isRTL ? "24px 0 0 24px" : "0 24px 24px 0",
        }}
      >
        <div className="flex flex-col h-full p-6">
          {/* Header */}
          <div
            className={`flex items-center justify-between mb-8 transform transition-all duration-500 ease-out ${
              isRTL ? "flex-row-reverse" : ""
            } ${
              isOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: isOpen ? "100ms" : "0ms" }}
          >
            <Image
              src="/sauvini_logo.svg"
              alt="Sauvini"
              width={140}
              height={40}
              className="object-contain dark:brightness-150"
            />
            <button
              onClick={close}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto" dir={isRTL ? "rtl" : "ltr"}>
            <div className="flex flex-col" style={{ gap: 16 }}>
              {navigationItems.map(({ href, label, icon: Icon }, index) => {
                // For modules link, check if on any learning page
                const isActive =
                  href === "/modules"
                    ? isOnLearningPages
                    : pathname === href || pathname.startsWith(`${href}/`);

                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={close}
                    className={`flex items-center transition-all duration-200 transform ${
                      isRTL ? "flex-row-reverse text-right" : "text-left"
                    } ${
                      isActive
                        ? "bg-[#324C72] text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    } ${
                      isOpen
                        ? "translate-x-0 opacity-100"
                        : isRTL
                        ? "translate-x-8 opacity-0"
                        : "-translate-x-8 opacity-0"
                    }`}
                    style={{
                      padding: "12px 20px",
                      gap: 12,
                      borderRadius: 26,
                      transitionDelay: isOpen ? `${200 + index * 50}ms` : "0ms",
                      direction: isRTL ? "rtl" : "ltr",
                    }}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span
                      className={`text-sm font-medium ${
                        isRTL ? "font-arabic text-right" : "font-sans text-left"
                      }`}
                    >
                      {t(`navigation.${label}`) || label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Bottom Section */}
          <div
            className={`border-t border-gray-200 dark:border-gray-700 pt-6 transform transition-all duration-500 ease-out ${
              isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            dir={isRTL ? "rtl" : "ltr"}
            style={{ transitionDelay: isOpen ? "400ms" : "0ms" }}
          >
            <div className="flex flex-col" style={{ gap: 16 }}>
              <Link
                href="/profile"
                onClick={close}
                className={`flex items-center transition-all duration-200 ${
                  isRTL ? "flex-row-reverse text-right" : "text-left"
                } ${
                  isOnProfilePage
                    ? "bg-[#324C72] text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                style={{
                  padding: "12px 20px",
                  gap: 12,
                  borderRadius: 26,
                  direction: isRTL ? "rtl" : "ltr",
                }}
              >
                <User className="w-5 h-5 flex-shrink-0" />
                <span
                  className={`text-sm font-medium ${
                    isRTL ? "font-arabic text-right" : "font-sans text-left"
                  }`}
                >
                  {t("navigation.profile") || "Profile"}
                </span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  console.log("Logout clicked");
                  close();
                }}
                className={`flex items-center text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 ${
                  isRTL ? "flex-row-reverse text-right" : "text-left"
                }`}
                style={{
                  padding: "12px 20px",
                  gap: 12,
                  borderRadius: 26,
                  direction: isRTL ? "rtl" : "ltr",
                }}
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                <span
                  className={`text-sm font-medium ${
                    isRTL ? "font-arabic text-right" : "font-sans text-left"
                  }`}
                >
                  {t("navigation.logout") || "Log out"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Sidebar() {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block ">
        <DesktopSidebar />
      </div>

      {/* Mobile Drawer */}
      <div className="md:hidden">
        <MobileDrawer />
      </div>
    </>
  );
}
