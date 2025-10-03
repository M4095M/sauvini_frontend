"use client"

import UserHeader, { ThemeToggleButton } from '@/components/modules/UserHeader'
import MobileHeader from '@/components/modules/MobileHeader'
import Footer from '@/components/ui/footer'
import { useLanguage } from '@/hooks/useLanguage'
import { RTL_LANGUAGES } from '@/lib/language'
import { MOCK_USER_PROFILE } from '@/data/mockModules'
import Sidebar from '@/components/modules/SideBar'
import { SidebarProvider } from '@/context/SideBarContext'
import { ThemeSwitcher } from '@/components/ui/theme-switcher'
import { LanguageSwitcher } from '@/components/ui/language-switcher'

export default function LearningLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { language } = useLanguage()
  const isRTL = RTL_LANGUAGES.includes(language)
  const userProfile = MOCK_USER_PROFILE

  return (
    <SidebarProvider>
      {/* Desktop Layout - Two Column Fixed Sidebar Pattern */}
      <div className="hidden md:block min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800">
        {/* Fixed Sidebar - 240px (w-60) */}
        <Sidebar />

        {/* Main Content Area - Offset by sidebar width */}
        <div
          className={`min-h-screen ${isRTL ? 'pr-60' : 'pl-60'}`}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {/* Centered Content Container - Responsive with proper overflow control */}
          <div className="flex flex-col w-full max-w-[1200px] mx-auto px-3 md:px-4 lg:px-6 pt-5 pb-6 gap-6 overflow-x-hidden">
            <UserHeader userProfile={userProfile} />
            <div className="w-full min-w-0">
              {children}
            </div>
            <Footer isRTL={isRTL} />
          </div>
        </div>
      </div>

      {/* Mobile Layout - Full Width with Off-Canvas Drawer */}
      <div
        className="flex flex-col min-h-screen md:hidden bg-gradient-to-br from-purple-100 to-blue-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Mobile Header with Hamburger Menu - Fixed at top */}
        {/* <MobileHeader userProfile={userProfile} /> */}

        {/* Theme and Language Switcher: */}
        <div className="flex flex-col gap-4 bottom-0 right-0 m-4 z-100 fixed">
          <LanguageSwitcher />
          <ThemeToggleButton />
        </div>

        {/* Off-Canvas Sidebar Drawer (Controlled by SidebarContext) */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 flex flex-col w-full px-4 pt-14 pb-6 gap-6 overflow-x-hidden">
          {children}
        </main>

        {/* Footer */}
        <Footer isMobile isRTL={isRTL} />
      </div>
    </SidebarProvider>
  )
}