"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Sun, Moon, Home, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "@/hooks/useTheme";
import { useRouter } from "next/navigation";
import { LanguageSwitcher } from "../ui/language-switcher";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

interface NavBarAuthedProps {
  userProfile: {
    id: string;
    name: string;
    lastname: string;
    avatar: string;
    userType: "student" | "professor" | "admin";
    title?: string; // For professors: "Mathematics Professor", for students: "Level 6" (just example)
  };
  className?: string;
}

interface NavLink {
  href: string;
  label: string;
  sectionId: string;
}

const NAVBAR_STYLES = {
  container: {
    padding: 12,
    borderRadius: 56,
  },
  profileSection: {
    gap: 16,
  },
  avatar: {
    width: 81,
    height: 81,
  },
  actionsSection: {
    gap: 16,
  },
} as const;

const ThemeToggleButton = React.memo(function ThemeToggleButton({
  className = "",
}: {
  className?: string;
}) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const { isRTL } = useLanguage();
  const isDarkFromContext = resolvedTheme === "dark";

  const [isDarkLocal, setIsDarkLocal] = useState(isDarkFromContext);

  useEffect(() => {
    setIsDarkLocal(isDarkFromContext);
  }, [isDarkFromContext]);

  const handleClick = useCallback(() => {
    setIsDarkLocal((prev) => !prev);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => toggleTheme(), 30);
      });
    });
  }, [toggleTheme]);

  const indicatorLeft = !isRTL
    ? isDarkLocal
      ? "calc(100% - 16px - 40px)"
      : "16px"
    : isDarkLocal
    ? "16px"
    : "calc(100% - 16px - 40px)";

  return (
    <button
      onClick={handleClick}
      aria-pressed={isDarkLocal}
      aria-label={
        isDarkLocal ? "Switch to light theme" : "Switch to dark theme"
      }
      className={`flex items-center justify-center ${className}`}
      style={{
        width: 104,
        height: 80,
        padding: 0,
        background: "transparent",
        border: "none",
      }}
      type="button"
    >
      <div
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
          {/* Active indicator */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              left: indicatorLeft,
              width: 40,
              height: 40,
              borderRadius: 40,
              background: "var(--primary-300)",
              zIndex: 1,
              pointerEvents: "none",
              transition: "left 200ms ease-in-out",
            }}
          />

          {/* Sun icon */}
          <div
            aria-hidden
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 40,
              color: isDarkLocal ? "var(--primary-300)" : "#fff",
              zIndex: 3,
            }}
          >
            <Sun className="w-5 h-5" />
          </div>

          {/* Moon icon */}
          <div
            aria-hidden
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 40,
              color: isDarkLocal ? "#fff" : "var(--primary-300)",
              zIndex: 3,
            }}
          >
            <Moon className="w-5 h-5" />
          </div>
        </div>
      </div>
    </button>
  );
});
ThemeToggleButton.displayName = "ThemeToggleButton";

export default function NavBarAuthed({
  userProfile,
  className = "",
}: NavBarAuthedProps) {
  const { t, isRTL } = useLanguage();
  const router = useRouter();
  const { getUserRole } = useAuth();
  const [activeSection, setActiveSection] = useState("hero");

  // Get the actual user role from the auth system
  const userRole = getUserRole();

  const navLinks: NavLink[] = [
    { href: "/", label: t("landing.nav.home") || "Home", sectionId: "hero" },
    {
      href: "/",
      label: t("landing.nav.whyUs") || "Why Us",
      sectionId: "why-sauvini",
    },
    {
      href: "/",
      label: t("landing.nav.whatWeOffer") || "What We Offer",
      sectionId: "about-sauvini",
    },
    {
      href: "/public/modules",
      label: t("landing.nav.exploreModules") || "Explore Modules",
      sectionId: "modules",
    },
  ];

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    if (sectionId === "modules") {
      router.push("/public/modules");
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Account for navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks
        .map((link) => link.sectionId)
        .filter((id) => id !== "modules");
      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section) {
          const sectionTop = section.offsetTop;
          if (scrollPosition >= sectionTop) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, [navLinks]);

  return (
    <header className={`w-full ${className}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="w-full">
        <nav
          className="flex justify-between items-center w-full bg-[#F8F8F8] dark:bg-[#1A1A1A]"
          style={{
            padding: NAVBAR_STYLES.container.padding,
            borderRadius: NAVBAR_STYLES.container.borderRadius,
          }}
          role="navigation"
          aria-label="Main navigation"
        >
          {/* User Profile Section */}
          <div
            className="flex items-end"
            style={{ gap: NAVBAR_STYLES.profileSection.gap }}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {/* Profile Picture */}
            <div
              className="flex justify-center items-center flex-shrink-0 relative overflow-hidden rounded-full"
              style={{
                width: NAVBAR_STYLES.avatar.width,
                height: NAVBAR_STYLES.avatar.height,
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

            {/* User Info */}
            <div className="flex flex-col items-start">
              {/* User Name */}
              <h1 className="text-gray-900 dark:text-white text-[36px] font-semibold -tracking-[0.72px] m-0 whitespace-nowrap">
                {userProfile.userType === "professor" &&
                  (t("professor.dr") || "Dr.")}{" "}
                {userProfile.name} {userProfile.lastname}
              </h1>

              {/* Title/Level */}
              <p className="text-[#7C7C7C] dark:text-[#A0A0A0] text-[20px] font-medium leading-[30px] -tracking-[0.4px]">
                {userProfile.title}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav
            className="flex items-center"
            style={{
              gap: "12px",
            }}
            role="menubar"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.sectionId;
              const isModules = link.sectionId === "modules";

              return isModules ? (
                <Link
                  key={link.href}
                  href={link.href}
                  role="menuitem"
                  className="flex justify-center items-center text-neutral-500 dark:text-neutral-400 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-all duration-300 no-underline group px-5 py-3 rounded-[26px] relative overflow-hidden navbar-link-hover navbar-bounce-hover navbar-focus"
                >
                  {/* Hover background effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-500/10 dark:to-primary-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[26px]" />

                  {/* Hover scale effect */}
                  <div className="absolute inset-0 scale-95 group-hover:scale-100 transition-transform duration-300 rounded-[26px] border border-primary-200 dark:border-primary-400/30 opacity-0 group-hover:opacity-100" />

                  <span
                    className={`text-sm font-medium whitespace-nowrap transition-all duration-300 relative z-10 group-hover:scale-105 ${
                      isRTL ? "font-arabic" : "font-sans"
                    }`}
                  >
                    {link.label}
                  </span>

                  {/* Hover underline effect */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-primary-500 dark:bg-primary-400 group-hover:w-3/4 transition-all duration-300 rounded-full" />
                </Link>
              ) : (
                <button
                  key={link.sectionId}
                  onClick={() => scrollToSection(link.sectionId)}
                  role="menuitem"
                  className={`flex justify-center items-center transition-all duration-300 group px-5 py-3 rounded-[26px] relative overflow-hidden navbar-link-hover navbar-bounce-hover navbar-focus ${
                    isActive
                      ? "text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10 shadow-lg shadow-primary-100/50 dark:shadow-primary-500/20 navbar-active-pulse"
                      : "text-neutral-500 dark:text-neutral-400 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 hover:shadow-md hover:shadow-primary-100/30 dark:hover:shadow-primary-500/10"
                  }`}
                >
                  {/* Hover background effect */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-500/10 dark:to-primary-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[26px]" />
                  )}

                  {/* Hover scale effect */}
                  {!isActive && (
                    <div className="absolute inset-0 scale-95 group-hover:scale-100 transition-transform duration-300 rounded-[26px] border border-primary-200 dark:border-primary-400/30 opacity-0 group-hover:opacity-100" />
                  )}

                  <span
                    className={`text-sm font-medium whitespace-nowrap transition-all duration-300 relative z-10 group-hover:scale-105 ${
                      isRTL ? "font-arabic" : "font-sans"
                    } ${isActive ? "font-semibold navbar-gradient-text" : ""}`}
                  >
                    {link.label}
                  </span>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-500 dark:bg-primary-400 rounded-full transition-all duration-300 shadow-sm" />
                  )}

                  {/* Hover underline effect for non-active items */}
                  {!isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-primary-500 dark:bg-primary-400 group-hover:w-3/4 transition-all duration-300 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Language & Theme Switcher Section */}
          <div
            className="flex items-center"
            style={{ gap: NAVBAR_STYLES.actionsSection.gap }}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {/* Admin: Validate Professors */}
            {userRole === "admin" && (
              <button
                onClick={() => router.push("/professor/professor-management")}
                className="hidden md:flex items-center justify-center h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white px-4 transition-colors duration-200"
                title="Validate Professors"
                aria-label="Validate Professors"
              >
                <ShieldCheck className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Validate Professors</span>
              </button>
            )}

            {/* Home Button */}
            <button
              onClick={() => router.push("/modules")}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              title="Go to Modules"
              aria-label="Go to Modules"
            >
              <Home className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Theme Toggle */}
            <ThemeToggleButton />
          </div>
        </nav>
      </div>
    </header>
  );
}
