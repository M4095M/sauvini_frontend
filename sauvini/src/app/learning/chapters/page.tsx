"use client"

import { useState, useEffect } from 'react'
import ChaptersSection from '@/components/modules/ChaptersSection'
import ContentHeader from '@/components/modules/ContentHeader'
import { useLanguage } from '@/hooks/useLanguage'
import { RTL_LANGUAGES } from '@/lib/language'
import { MOCK_MODULES_DATA } from '@/data/mockModules'

export default function ChaptersPage() {
  const { language } = useLanguage()
  const isRTL = RTL_LANGUAGES.includes(language)
  const [isMobile, setIsMobile] = useState(false)
  
  // Get the first module as example (in real app, this would come from route params)
  const currentModule = MOCK_MODULES_DATA.modules[0];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!currentModule) {
    return <div>Module not found</div>;
  }

  return (
    <>
      {!isMobile && (
        <ContentHeader 
          content={currentModule} 
          contentType="module" 
        />
      )}
      
      {/* Chapters Section */}
      <ChaptersSection
        chapters={currentModule.chapters}
        isMobile={isMobile}
        userLevel={MOCK_MODULES_DATA.userProfile?.level || 1}
      />
    </>
  )
}