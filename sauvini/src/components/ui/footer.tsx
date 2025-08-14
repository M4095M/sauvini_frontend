"use client"

import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/hooks/useLanguage'
import { RTL_LANGUAGES } from '@/lib/language'

interface FooterProps {
  isRTL?: boolean
  isMobile?: boolean
  className?: string
}

export default function Footer({ isRTL: propIsRTL, isMobile: propIsMobile, className = '' }: FooterProps) {
  const [isMobile, setIsMobile] = useState(propIsMobile !== undefined ? propIsMobile : false)
  const { t, language } = useLanguage()
  const isRTL = propIsRTL !== undefined ? propIsRTL : RTL_LANGUAGES.includes(language)

  const FOOTER_LINKS = [
    { href: '/privacy-policy', text: t("footer.privacy") },
    { href: '/terms', text: t("footer.terms") },
    { href: '/help', text: t("footer.help") }
  ] as const

  useEffect(() => {
    if (propIsMobile !== undefined) return

    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [propIsMobile])

  return (
    <footer
      className={`
        flex flex-col self-stretch
        rounded-t-[52px]
        ${isMobile ? 'bg-white dark:bg-[#1A1A1A]' : 'bg-[#F8F8F8] dark:bg-[#1A1A1A]'}
        ${className}
      `}
      style={{
        padding: isMobile ? '40px 40px 20px 40px' : '24px 52px',
        gap: isMobile ? 108 : 4,
        alignItems: isMobile ? (isRTL ? 'flex-end' : 'flex-start') : 'center',
        direction: isRTL ? 'rtl' : 'ltr',
      }}
    >
      {/* Logo and Links Section */}
      <div
        className={`
          flex self-stretch
          ${isMobile ? 'flex-col' : 'flex-row justify-between items-center'}
          ${isRTL && !isMobile ? 'flex-row-reverse' : ''}
        `}
        style={{
          alignItems: isMobile ? (isRTL ? 'flex-end' : 'flex-start') : 'center',
          gap: isMobile ? 60 : 0,
        }}
      >
        {/* Logo */}
        <div className="flex-shrink-0">
          <Image
            src="/sauvini_logo.svg"
            alt="Sauvini - Your future starts here"
            width={230}
            height={67}
            priority={false}
            className="dark:brightness-150" // slightly brighten logo in dark mode for better visibility
          />
        </div>

        {/* Navigation Links */}
        <nav
          className={`
            flex
            ${isMobile ? 'flex-col' : 'flex-row items-center'}
            ${isRTL && !isMobile ? 'flex-row-reverse' : ''}
          `}
          style={{
            alignItems: isMobile ? (isRTL ? 'flex-end' : 'flex-start') : 'center',
            gap: isMobile ? 16 : 44,
          }}
          aria-label="Footer navigation"
        >
          {FOOTER_LINKS.map(({ href, text }) => (
            <Link 
              key={href} 
              href={href}
              className="transition-opacity hover:opacity-80"
            >
              <Button
                state="text"
                size="XS"
                text={text}
                icon_position="none"
              />
            </Link>
          ))}
        </nav>
      </div>

      {/* Copyright */}
      <div className="self-stretch">
        <p
          className={`
            text-center m-0 font-sans
            text-[#7C7C7C] dark:text-[#A0A0A0]
            text-base font-normal leading-normal tracking-[-0.32px]
          `}
        >
          &copy; 2025 Sauvini
        </p>
      </div>
    </footer>
  )
}