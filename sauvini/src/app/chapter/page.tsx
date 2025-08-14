"use client"

import { useState, useEffect } from 'react'
import ChaptersGrid from '@/components/modules/ChaptersGrid'
import ModuleHeader from '@/components/modules/ModuleHeader'
import Footer from '@/components/ui/footer'
import UserHeader from '@/components/modules/UserHeader'
import { useLanguage } from '@/hooks/useLanguage'
import { RTL_LANGUAGES } from '@/lib/language'
import { MOCK_MODULES_DATA, filterChaptersByStream } from '../../data/mockModules'
import { Chapter, UserProfile } from '@/types/modules'

export default function ChapterPage() {
  const { language, t } = useLanguage()
  const isRTL = RTL_LANGUAGES.includes(language)
  const [showPurchasedOnly, setShowPurchasedOnly] = useState(false)
  const [filteredChapters, setFilteredChapters] = useState<Chapter[]>([])
  
  const userProfile: UserProfile = MOCK_MODULES_DATA.userProfile;
  
  const currentModule = MOCK_MODULES_DATA.modules[0];
  
  useEffect(() => {
    const userStream = userProfile.academicStream
    const moduleChapters = currentModule.chapters
    
    // First filter by academic stream
    let chapters = filterChaptersByStream(moduleChapters, userStream)
    
    // Then filter by purchase status if toggle is on
    if (showPurchasedOnly) {
      chapters = chapters.filter(chapter => chapter.isPurchased)
    }
    
    setFilteredChapters(chapters)
  }, [showPurchasedOnly, currentModule, userProfile.academicStream])

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden md:flex min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 justify-center">
        {/* Sidebar */}
        <aside
          className="fixed left-0 top-0 z-10 h-screen"
          style={{
            width: 241,
            background: 'var(--Surface-Level-1, #FFFFFF)',
            borderRight: '1px solid var(--neutral-200, #E5E5E5)',
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
            {/* User Header */}
            <UserHeader userProfile={userProfile} />
            
            {/* Module Header */}
            <ModuleHeader module={currentModule} />
            
            {/* Chapters Grid */}
            <ChaptersGrid 
              chapters={filteredChapters}
              showPurchasedOnly={showPurchasedOnly}
              onToggleChange={setShowPurchasedOnly}
              userLevel={userProfile.level}
            />

            {/* Footer */}
            <Footer isRTL={isRTL} />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div
        className="flex flex-col min-h-screen w-full md:hidden bg-gradient-to-br from-purple-100 to-blue-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800"
        style={{
          paddingTop: 60,
          gap: 24,
          direction: isRTL ? 'rtl' : 'ltr',
        }}
      >
        {/* Module Header - Mobile */}
        <ModuleHeader module={currentModule} />
        
        {/* Chapters Grid - Mobile */}
        <ChaptersGrid 
          chapters={filteredChapters}
          showPurchasedOnly={showPurchasedOnly}
          onToggleChange={setShowPurchasedOnly}
          isMobile
          userLevel={userProfile.level}
        />

        {/* Footer - Mobile */}
        <div className="mt-auto w-full">
          <Footer isMobile isRTL={isRTL} />
        </div>
      </div>
    </>
  )
}