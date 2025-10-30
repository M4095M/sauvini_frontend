"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/hooks/useLanguage";
import { RTL_LANGUAGES } from "@/lib/language";
import Button from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        className="flex justify-between items-center w-full bg-[#F8F8F8] dark:bg-[#1A1A1A] px-4 sm:px-6 md:px-8 lg:px-[120px] py-3 sm:py-4 md:py-5 rounded-2xl md:rounded-[36px] lg:rounded-[56px]"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo and Navigation Links */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/sauvini_logo.svg"
              alt="Sauvini"
              width={187}
              height={55}
              className="object-contain dark:brightness-150 transition-all duration-200 w-24 sm:w-32 md:w-40 lg:w-[187px] h-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-3" role="menubar">
            {navLinks.map((link) => {
              const isActive = activeSection === link.sectionId;
              const isModules = link.sectionId === "modules";

              return isModules ? (
                <Link
                  key={link.href}
                  href={link.href}
                  role="menuitem"
                  className="flex justify-center items-center px-5 py-3 text-neutral-500 dark:text-neutral-400 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-all duration-300 no-underline group relative overflow-hidden rounded-[26px]"
                >
                  <span
                    className={`text-sm font-medium whitespace-nowrap transition-all duration-300 relative z-10 ${
                      isRTL ? "font-arabic" : "font-sans"
                    }`}
                  >
                    {link.label}
                  </span>
                </Link>
              ) : (
                <button
                  key={link.sectionId}
                  onClick={() => scrollToSection(link.sectionId)}
                  role="menuitem"
                  className={`flex justify-center items-center px-5 py-3 transition-all duration-300 group relative overflow-hidden rounded-[26px] ${
                    isActive
                      ? "text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10 shadow-lg shadow-primary-100/50 dark:shadow-primary-500/20"
                      : "text-neutral-500 dark:text-neutral-400 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10"
                  }`}
                >
                  <span
                    className={`text-sm font-medium whitespace-nowrap transition-all duration-300 relative z-10 ${
                      isRTL ? "font-arabic" : "font-sans"
                    } ${isActive ? "font-semibold" : ""}`}
                  >
                    {link.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Desktop Authentication Buttons Section */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4">
          <Button
            state="outlined"
            size="M"
            icon_position="none"
            text={t("landing.nav.login") || "Log In"}
            onClick={handleLogin}
          />
          <Button
            state="filled"
            size="M"
            icon_position="none"
            text={t("landing.nav.signUp") || "Sign Up"}
            onClick={handleSignUp}
          />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-neutral-700 dark:text-neutral-300" />
          ) : (
            <Menu className="w-6 h-6 text-neutral-700 dark:text-neutral-300" />
          )}
        </button>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 ${
            isRTL ? "left-0" : "right-0"
          } h-full w-80 max-w-[85vw] bg-[#F8F8F8] dark:bg-[#1A1A1A] z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen
              ? "translate-x-0"
              : isRTL
              ? "-translate-x-full"
              : "translate-x-full"
          }`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className="flex flex-col h-full p-6">
            {/* Close Button */}
            <div className="flex justify-between items-center mb-8">
              <Image
                src="/sauvini_logo.svg"
                alt="Sauvini"
                width={120}
                height={35}
                className="object-contain dark:brightness-150"
              />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6 text-neutral-700 dark:text-neutral-300" />
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col gap-2 mb-6">
              {navLinks.map((link) => {
                const isActive = activeSection === link.sectionId;
                const isModules = link.sectionId === "modules";

                return isModules ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10"
                        : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    }`}
                  >
                    <span
                      className={`text-base font-medium ${
                        isRTL ? "font-arabic" : "font-sans"
                      }`}
                    >
                      {link.label}
                    </span>
                  </Link>
                ) : (
                  <button
                    key={link.sectionId}
                    onClick={() => {
                      scrollToSection(link.sectionId);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-300 text-left ${
                      isActive
                        ? "text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10"
                        : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    }`}
                  >
                    <span
                      className={`text-base font-medium ${
                        isRTL ? "font-arabic" : "font-sans"
                      } ${isActive ? "font-semibold" : ""}`}
                    >
                      {link.label}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Mobile Authentication Buttons */}
            <div className="flex flex-col gap-3 mt-auto">
              <Button
                state="outlined"
                size="M"
                icon_position="none"
                text={t("landing.nav.login") || "Log In"}
                onClick={() => {
                  handleLogin();
                  setIsMobileMenuOpen(false);
                }}
                optionalStyles="w-full"
              />
              <Button
                state="filled"
                size="M"
                icon_position="none"
                text={t("landing.nav.signUp") || "Sign Up"}
                onClick={() => {
                  handleSignUp();
                  setIsMobileMenuOpen(false);
                }}
                optionalStyles="w-full"
              />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
