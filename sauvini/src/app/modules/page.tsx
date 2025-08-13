"use client"

import ModulesSection from '@/components/modules/ModulesSection'
import Footer from '@/components/ui/footer'
import { MOCK_MODULES_DATA } from '../../data/mockModules'
import UserHeader from '@/components/modules/UserHeader'
import { useLanguage } from '@/hooks/useLanguage'
import { RTL_LANGUAGES } from '@/lib/language'

export default function ModulesPage() {
  const { language } = useLanguage()
  const isRTL = RTL_LANGUAGES.includes(language)

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden md:flex min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 justify-center">
        {/* Sidebar */}
        <aside
          className="fixed left-0 top-0 z-10 h-screen"
          style={{
            width: 241,
            background: '#FFF',
          }}
        />

        {/* Main Content Area Frame */}
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
          {/* Internal Frame */}
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
            <UserHeader userProfile={MOCK_MODULES_DATA.userProfile} />

            <ModulesSection modules={MOCK_MODULES_DATA.modules} />

            <Footer />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div
        className="flex flex-col min-h-screen w-full md:hidden bg-gradient-to-br from-purple-100 to-blue-100"
        style={{
          paddingTop: 60,
          gap: 24,
          direction: isRTL ? 'rtl' : 'ltr',
        }}
      >
        <ModulesSection
          modules={MOCK_MODULES_DATA.modules}
          isMobile
          userLevel={MOCK_MODULES_DATA.userProfile.level}
        />

        <div className="mt-auto w-full">
          <Footer />
        </div>
      </div>
    </>
  )
}