"use client"

import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/hooks/useLanguage"
import { RTL_LANGUAGES } from "@/lib/language"
import Button from "@/components/ui/button"

interface NavLink {
  href: string
  label: string
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
} as const

export default function NavBarGuest() {
  const { t, language } = useLanguage()
  const isRTL = RTL_LANGUAGES.includes(language)

  const navLinks: NavLink[] = [
    { href: "/", label: t("landing.nav.home") || "Home" },
    { href: "/why-us", label: t("landing.nav.whyUs") || "Why Us" },
    { href: "/what-we-offer", label: t("landing.nav.whatWeOffer") || "What We Offer" },
    { href: "/modules", label: t("landing.nav.exploreModules") || "Explore Modules" },
  ]

  const handleLogin = () => {
    window.location.href = "/auth/login"
  }

  const handleSignUp = () => {
    window.location.href = "/register"
  }

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
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                role="menuitem"
                className="flex justify-center items-center flex-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 no-underline"
                style={{
                  padding: NAVBAR_STYLES.navLinks.item.padding,
                  gap: NAVBAR_STYLES.navLinks.item.gap,
                  borderRadius: NAVBAR_STYLES.navLinks.item.borderRadius,
                }}
              >
                <span 
                  className={`text-sm font-medium whitespace-nowrap ${
                    isRTL ? "font-arabic" : "font-sans"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
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
  )
}