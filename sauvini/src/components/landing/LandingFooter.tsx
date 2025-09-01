"use client"

import Image from "next/image"
import Link from "next/link"
import { Mail, Phone } from "lucide-react"
import { useLanguage } from "@/hooks/useLanguage"
import { RTL_LANGUAGES } from "@/lib/language"

export default function LandingFooter() {
  const { t, language } = useLanguage()
  const isRTL = RTL_LANGUAGES.includes(language)

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
        { text: t("landing.footer.english") || "English", href: "/lang/en" },
        { text: t("landing.footer.arabic") || "Arabic", href: "/lang/ar" },
        { text: t("landing.footer.french") || "Français", href: "/lang/fr" },
      ]
    },
    access: {
      title: t("landing.footer.access") || "Access",
      links: [
        { text: t("landing.footer.signUpStudent") || "Sign Up As a Student", href: "/register/student" },
        { text: t("landing.footer.applyTeacher") || "Apply For a Teacher Position", href: "/register/teacher" },
        { text: t("landing.footer.logIn") || "Log In", href: "/login" },
      ]
    }
  }

  return (
    <footer
      className="w-full flex-shrink-0 bg-[var(--Surface-Level-2,#F8F8F8)] dark:bg-[#1A1A1A]"
      style={{
        height: "549px",
        borderRadius: "80px 80px 0 0",
      }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full h-full flex flex-col justify-between px-16 py-12">
        {/* Top Section */}
        <div className="flex justify-between items-start">
          {/* Logo and Contact Info */}
          <div className="flex flex-col gap-8">
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
                <Mail className="w-5 h-5 text-[var(--Content-Secondary,#7C7C7C)] dark:text-[#A0A0A0]" />
                <span className="text-sm text-[var(--Content-Secondary,#7C7C7C)] dark:text-[#A0A0A0]">
                  Email@gmail.com
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[var(--Content-Secondary,#7C7C7C)] dark:text-[#A0A0A0]" />
                <span className="text-sm text-[var(--Content-Secondary,#7C7C7C)] dark:text-[#A0A0A0]">
                  + 213 545 78 90 43
                </span>
              </div>
            </div>
          </div>

          {/* Footer Links Sections */}
          <div className="flex gap-24">
            {/* Explore Section */}
            <div className="flex flex-col gap-6">
              <h3 className="text-lg font-semibold text-[var(--Content-Primary,#1A1A1A)] dark:text-white">
                {footerSections.explore.title}
              </h3>
              <div className="flex flex-col gap-4">
                {footerSections.explore.links.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="text-sm text-[var(--Content-Secondary,#7C7C7C)] dark:text-[#A0A0A0] hover:text-[var(--Content-Primary,#1A1A1A)] dark:hover:text-white transition-colors"
                  >
                    {link.text}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact Section */}
            <div className="flex flex-col gap-6">
              <h3 className="text-lg font-semibold text-[var(--Content-Primary,#1A1A1A)] dark:text-white">
                {footerSections.contact.title}
              </h3>
              <div className="flex flex-col gap-4">
                {footerSections.contact.links.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="text-sm text-[var(--Content-Secondary,#7C7C7C)] dark:text-[#A0A0A0] hover:text-[var(--Content-Primary,#1A1A1A)] dark:hover:text-white transition-colors"
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    {link.text}
                  </Link>
                ))}
              </div>
            </div>

            {/* Language Section */}
            <div className="flex flex-col gap-6">
              <h3 className="text-lg font-semibold text-[var(--Content-Primary,#1A1A1A)] dark:text-white">
                {footerSections.language.title}
              </h3>
              <div className="flex flex-col gap-4">
                {footerSections.language.links.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="text-sm text-[var(--Content-Secondary,#7C7C7C)] dark:text-[#A0A0A0] hover:text-[var(--Content-Primary,#1A1A1A)] dark:hover:text-white transition-colors"
                  >
                    {link.text}
                  </Link>
                ))}
              </div>
            </div>

            {/* Access Section */}
            <div className="flex flex-col gap-6">
              <h3 className="text-lg font-semibold text-[var(--Content-Primary,#1A1A1A)] dark:text-white">
                {footerSections.access.title}
              </h3>
              <div className="flex flex-col gap-4">
                {footerSections.access.links.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="text-sm text-[var(--Content-Secondary,#7C7C7C)] dark:text-[#A0A0A0] hover:text-[var(--Content-Primary,#1A1A1A)] dark:hover:text-white transition-colors"
                  >
                    {link.text}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="w-full pt-8 border-t border-[var(--Content-Secondary,#7C7C7C)]/20 dark:border-[#A0A0A0]/20">
          <div className="flex justify-center">
            <p className="text-sm text-[var(--Content-Secondary,#7C7C7C)] dark:text-[#A0A0A0] text-center">
              © Sauvini 2025. All rights reserved.<br />
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}