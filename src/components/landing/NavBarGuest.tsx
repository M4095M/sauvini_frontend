"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/hooks/useLanguage";
import { RTL_LANGUAGES } from "@/lib/language";
import Button from "@/components/ui/button";
import { useState, useEffect } from "react";

interface NavLink {
  href: string;
  label: string;
  sectionId: string;
}

const NAVBAR_STYLES = {
  container: {
    padding: "20px 120px",
    borderRadius: "56px",
  },
  logoSection: {
    gap: "16px",
  },
  logo: {
    width: "187px",
    height: "54.712px",
    aspectRatio: "187.00/54.71",
  },
  navLinks: {
    container: {
      width: "693px",
      gap: "12px",
    },
    item: {
      padding: "12px 20px",
      gap: "12px",
      borderRadius: "26px",
    },
  },
  buttonsSection: {
    gap: "16px",
  },
} as const;

export default function NavBarGuest() {
  const { t, language } = useLanguage();
  const isRTL = RTL_LANGUAGES.includes(language);
  const [activeSection, setActiveSection] = useState("hero");

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

  const handleLogin = () => {
    window.location.href = "/auth/login";
  };

  const handleSignUp = () => {
    window.location.href = "/register";
  };

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    if (sectionId === "modules") {
      window.location.href = "/public/modules";
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
    <header className="w-full" dir={isRTL ? "rtl" : "ltr"}>
      <nav
        className="flex justify-between items-center w-full bg-[#F8F8F8] dark:bg-[#1A1A1A]"
        style={{
          padding: NAVBAR_STYLES.container.padding,
          borderRadius: NAVBAR_STYLES.container.borderRadius,
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo and Navigation Links */}
        <div
          className="flex items-center"
          style={{ gap: NAVBAR_STYLES.logoSection.gap }}
        >
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/sauvini_logo.svg"
              alt="Sauvini"
              width={187}
              height={55}
              style={NAVBAR_STYLES.logo}
              className="object-contain dark:brightness-150 transition-all duration-200"
              priority
            />
          </Link>

          {/* Navigation Links */}
          <nav
            className="flex items-center"
            style={{
              width: NAVBAR_STYLES.navLinks.container.width,
              gap: NAVBAR_STYLES.navLinks.container.gap,
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
                  className="flex justify-center items-center flex-1 text-neutral-500 dark:text-neutral-400 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-all duration-300 no-underline group relative overflow-hidden navbar-link-hover navbar-bounce-hover navbar-focus"
                  style={{
                    padding: NAVBAR_STYLES.navLinks.item.padding,
                    gap: NAVBAR_STYLES.navLinks.item.gap,
                    borderRadius: NAVBAR_STYLES.navLinks.item.borderRadius,
                  }}
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
                  className={`flex justify-center items-center flex-1 transition-all duration-300 group relative overflow-hidden navbar-link-hover navbar-bounce-hover navbar-focus ${
                    isActive
                      ? "text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10 shadow-lg shadow-primary-100/50 dark:shadow-primary-500/20 navbar-active-pulse"
                      : "text-neutral-500 dark:text-neutral-400 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 hover:shadow-md hover:shadow-primary-100/30 dark:hover:shadow-primary-500/10"
                  }`}
                  style={{
                    padding: NAVBAR_STYLES.navLinks.item.padding,
                    gap: NAVBAR_STYLES.navLinks.item.gap,
                    borderRadius: NAVBAR_STYLES.navLinks.item.borderRadius,
                  }}
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
        </div>

        {/* Authentication Buttons Section */}
        <div
          className="flex items-center"
          style={{ gap: NAVBAR_STYLES.buttonsSection.gap }}
        >
          <div className="flex justify-center items-center">
            <Button
              state="outlined"
              size="M"
              icon_position="none"
              text={t("landing.nav.login") || "Log In"}
              onClick={handleLogin}
            />
          </div>
          <div className="flex justify-center items-center">
            <Button
              state="filled"
              size="M"
              icon_position="none"
              text={t("landing.nav.signUp") || "Sign Up"}
              onClick={handleSignUp}
            />
          </div>
        </div>
      </nav>
    </header>
  );
}
