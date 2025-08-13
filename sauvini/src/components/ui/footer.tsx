"use client"

import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/hooks/useLanguage'
import { RTL_LANGUAGES } from '@/lib/language'

interface FooterProps {
  isRTL?: boolean
  className?: string
}

const FOOTER_STYLES = {
  desktop: {
    padding: '24px 52px',
    gap: 4,
    background: 'var(--Surface-Level-2, #F8F8F8)',
  },
  mobile: {
    padding: '40px 40px 20px 40px',
    gap: 108,
    background: 'var(--Card-Bg-Default, #FFF)',
  }
} as const

export default function Footer({ isRTL: propIsRTL, className = '' }: FooterProps) {
  const [isMobile, setIsMobile] = useState(false)
  const { t, language } = useLanguage()
  const isRTL = propIsRTL !== undefined ? propIsRTL : RTL_LANGUAGES.includes(language)

  const FOOTER_LINKS = [
    { href: '/privacy-policy', text: t("footer.privacy") },
    { href: '/terms', text: t("footer.terms") },
    { href: '/help', text: t("footer.help") }
  ] as const

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const footerStyles = isMobile ? FOOTER_STYLES.mobile : FOOTER_STYLES.desktop

  return (
    <footer
      className={`
        flex flex-col self-stretch
        rounded-t-[52px]
        ${className}
      `}
      style={{
        alignItems: isMobile ? (isRTL ? 'flex-end' : 'flex-start') : 'center',
        direction: isRTL ? 'rtl' : 'ltr',
        ...footerStyles,
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
          className="text-center m-0"
          style={{
            color: 'var(--Content-Secondary, #7C7C7C)',
            fontFamily: '"Work Sans", sans-serif',
            fontSize: 16,
            fontWeight: 400,
            lineHeight: 'normal',
            letterSpacing: '-0.32px',
          }}
        >
          &copy; 2025 Sauvini
        </p>
      </div>
    </footer>
  )
}