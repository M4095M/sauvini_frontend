"use client"

import { useState, useEffect } from 'react'
import UserHeader from '@/components/modules/UserHeader'
import Footer from '@/components/ui/footer'
import { useLanguage } from '@/hooks/useLanguage'
import { RTL_LANGUAGES } from '@/lib/language'
import { MOCK_USER_PROFILE } from '@/data/mockModules'
import Image from 'next/image'
import Link from 'next/link'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { ThemeSwitcher } from '@/components/ui/theme-switcher'

export default function LearningLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { language } = useLanguage()
  const isRTL = RTL_LANGUAGES.includes(language)
  const [isMobile, setIsMobile] = useState(false)
  const userProfile = MOCK_USER_PROFILE

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return (
    <>
      {/* Desktop */}

      <div className="hidden md:flex min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 justify-center">
        {/* Sidebar EXAMPLE */}
        <aside
          className="fixed left-0 top-0 z-10 h-screen bg-white dark:bg-[#1A1A1A]"
          style={{
            width: 241,
          }}
        >
          <div className="flex flex-col h-full p-4">
            {/* Logo */}
            <div className="mb-8 p-4">
              <Image
                src="/sauvini_logo.svg"
                alt="Sauvini"
                width={150}
                height={43}
                className="dark:brightness-150"
              />
            </div>
            
            {/* Navigation */}
            <nav className="flex-1">
              <Link 
                href="/learning/modules" 
                className={`flex items-center p-3 mb-2 rounded-lg ${isRTL ? 'flex-row-reverse text-right' : ''} 
                  hover:bg-gray-100 dark:hover:bg-gray-800
                  bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300`}
              >
                <span className={isRTL ? 'font-arabic' : 'font-sans'}>
                  Modules
                </span>
              </Link>
              
              <Link 
                href="/learning/chapters" 
                className={`flex items-center p-3 mb-2 rounded-lg ${isRTL ? 'flex-row-reverse text-right' : ''} 
                  hover:bg-gray-100 dark:hover:bg-gray-800`}
              >
                <span className={isRTL ? 'font-arabic' : 'font-sans'}>
                  Chapters
                </span>
              </Link>
              
              <Link 
                href="/learning/lessons" 
                className={`flex items-center p-3 mb-2 rounded-lg ${isRTL ? 'flex-row-reverse text-right' : ''} 
                  hover:bg-gray-100 dark:hover:bg-gray-800`}
              >
                <span className={isRTL ? 'font-arabic' : 'font-sans'}>
                  Lessons
                </span>
              </Link>
            </nav>
            
            {/* Theme switcher */}
            <div className="mt-auto p-4">
              <ThemeSwitcher />
            </div>
          </div>
        </aside>

        {/* Main */}
        <div
          style={{
            display: 'flex',
            width: 1200,
            padding: '20px 12px 0 12px',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 10,
            flexShrink: 0,
            marginLeft: 241,
            direction: isRTL ? 'rtl' : 'ltr',
          }}
        >
          {/* Internal */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 24,
              alignSelf: 'stretch',
              width: '100%',
            }}
          >
            <UserHeader userProfile={userProfile} />
            
            {/* Page Content */}
            {children}

            <Footer isRTL={isRTL} />
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div
        className="flex flex-col min-h-screen w-full md:hidden bg-gradient-to-br from-purple-100 to-blue-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800"
        style={{
          paddingTop: 60,
          gap: 24,
          direction: isRTL ? 'rtl' : 'ltr',
        }}
      >
        {/* Page Content */}
        {children}

        {/* Footer */}
        <div className="mt-auto w-full">
          <Footer isMobile isRTL={isRTL} />
        </div>
      </div>
    </>
  )
}