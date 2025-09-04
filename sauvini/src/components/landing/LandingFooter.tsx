"use client"

import Image from "next/image"
import Link from "next/link"
import { Mail, Phone } from "lucide-react"
import { useLanguage } from "@/hooks/useLanguage"
import { RTL_LANGUAGES, Language } from "@/lib/language"

export default function LandingFooter() {
  const { t, language, setLanguage } = useLanguage()
  const isRTL = RTL_LANGUAGES.includes(language)
  const currentYear = new Date().getFullYear()

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
  }

  const footerSections = {
    explore: {
      title: t("landing.footer.explore") || "Explore",
      links: [
        { text: t("landing.footer.home") || "Home", href: "/" },
        { text: t("landing.footer.whyUs") || "Why Us", href: "/about" },
        { text: t("landing.footer.whatWeOffer") || "What We Offer", href: "/services" },
        { text: t("landing.footer.exploreModules") || "Explore Modules", href: "/modules" },
      ]
    },
    contact: {
      title: t("landing.footer.contact") || "Contact",
      links: [
        { text: t("landing.footer.emailUs") || "Email Us", href: "mailto:contact@sauvini.com" },
        { text: t("landing.footer.instagram") || "Instagram", href: "https://instagram.com/sauvini" },
        { text: t("landing.footer.facebook") || "Facebook", href: "https://facebook.com/sauvini" },
      ]
    },
    language: {
      title: t("landing.footer.language") || "Language",
      links: [
        { text: t("landing.footer.english") || "English", action: () => handleLanguageChange('en') },
        { text: t("landing.footer.arabic") || "Arabic", action: () => handleLanguageChange('ar') },
        { text: t("landing.footer.french") || "Français", action: () => handleLanguageChange('fr') },
      ]
    },
    access: {
      title: t("landing.footer.access") || "Access",
      links: [
        { text: t("landing.footer.signUpStudent") || "Sign Up As a Student", href: "/register" },
        { text: t("landing.footer.applyTeacher") || "Apply For a Teacher Position", href: "/register" },
        { text: t("landing.footer.logIn") || "Log In", href: "/auth/login" },
      ]
    }
  }

  return (
    <footer
      className="w-full flex-shrink-0 bg-neutral-100 dark:bg-neutral-700 mt-20"
      style={{
        height: "440px",
        borderRadius: "80px 80px 0 0",
      }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full h-full flex flex-col justify-between px-16 py-12">
        {/* Top Section */}
        <div className="flex justify-between items-start w-full">
          {/* Logo and Contact Info */}
          <div className="flex flex-col gap-8 flex-shrink-0" style={{ minWidth: "280px" }}>
            {/* Logo */}
            <div>
              <Image
                src="/sauvini_logo.svg"
                alt="Sauvini"
                width={187}
                height={55}
                className="object-contain dark:brightness-150"
                priority
              />
            </div>

            {/* Contact Information */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-300 dark:text-neutral-400" />
                <span className="text-sm text-primary-300 dark:text-neutral-400">
                  sauvini@gmail.com
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-300 dark:text-neutral-400" />
                <span className="text-sm text-primary-300 dark:text-neutral-400">
                  + 213 545 78 90 43
                </span>
              </div>
            </div>
          </div>

          {/* Footer Links Sections */}
          <div className="flex justify-between flex-1 max-w-4xl">
            {/* Explore Section */}
            <div className="flex flex-col gap-6 flex-1">
              <h3 className="text-lg font-semibold text-neutral-600 dark:text-neutral-100">
                {footerSections.explore.title}
              </h3>
              <div className="flex flex-col gap-4">
                {footerSections.explore.links.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="text-sm text-primary-300 dark:text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-100 transition-colors"
                  >
                    {link.text}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact Section */}
            <div className="flex flex-col gap-6 flex-1">
              <h3 className="text-lg font-semibold text-neutral-600 dark:text-neutral-100">
                {footerSections.contact.title}
              </h3>
              <div className="flex flex-col gap-4">
                {footerSections.contact.links.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="text-sm text-primary-300 dark:text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-100 transition-colors"
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    {link.text}
                  </Link>
                ))}
              </div>
            </div>

            {/* Language Section */}
            <div className="flex flex-col gap-6 flex-1">
              <h3 className="text-lg font-semibold text-neutral-600 dark:text-neutral-100">
                {footerSections.language.title}
              </h3>
              <div className="flex flex-col gap-4">
                {footerSections.language.links.map((link, index) => (
                    <button
                    key={index}
                    onClick={link.action}
                    className={`text-sm text-primary-300 dark:text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-100 transition-colors ${isRTL ? "text-right" : "text-left"}`}
                    >
                    {link.text}
                    </button>
                ))}
              </div>
            </div>

            {/* Access Section */}
            <div className="flex flex-col gap-6 flex-1">
              <h3 className="text-lg font-semibold text-neutral-600 dark:text-neutral-100">
                {footerSections.access.title}
              </h3>
              <div className="flex flex-col gap-4">
                {footerSections.access.links.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="text-sm text-primary-300 dark:text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-100 transition-colors"
                  >
                    {link.text}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="w-full pt-8 border-t border-primary-300/20 dark:border-neutral-400/20">
          <div className="flex justify-center">
            <p className="text-sm text-primary-300 dark:text-neutral-400 text-center">
              © Sauvini {currentYear}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}