"use client"

import { useState, useEffect } from 'react'
import LessonsGrid from '@/components/modules/LessonsGrid'
import ModuleHeader from '@/components/modules/ModuleHeader'
import Footer from '@/components/ui/footer'
import UserHeader from '@/components/modules/UserHeader'
import { useLanguage } from '@/hooks/useLanguage'
import { RTL_LANGUAGES } from '@/lib/language'
import { MOCK_MODULES_DATA, filterLessonsByStream } from '../../data/mockModules'
import { Lesson, UserProfile } from '@/types/modules'
import Image from 'next/image'
import { Heart, Bell } from 'lucide-react'
import LessonCard from '@/components/modules/LessonCard'

export default function LessonsPage() {
  const { language, t } = useLanguage()
  const isRTL = RTL_LANGUAGES.includes(language)
  const [filteredLessons, setFilteredLessons] = useState<Lesson[]>([])
  
  const userProfile: UserProfile = MOCK_MODULES_DATA.userProfile;
  
  const currentModule = MOCK_MODULES_DATA.modules[0];
  const currentChapter = currentModule.chapters && currentModule.chapters[0];
  
  useEffect(() => {
    if (currentChapter) {
      // Filter lessons based on user's academic stream
      const userStream = userProfile.academicStream;
      const lessons = filterLessonsByStream(currentChapter.lessons, userStream);
      setFilteredLessons(lessons);
    }
  }, [currentChapter, userProfile.academicStream]);

  const handleStartLearning = (lessonId: string) => {
    console.log(`Starting lesson: ${lessonId}`);
    // Navigation logic would go here
  };

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
            
            {/* Lessons Grid */}
            <LessonsGrid lessons={filteredLessons} />

            {/* Footer */}
            <Footer isRTL={isRTL} />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div
        className="flex flex-col min-h-screen w-full md:hidden"
        style={{
          direction: isRTL ? 'rtl' : 'ltr',
          background: 'var(--neutral-100)',
        }}
      >
        {/* Top Section - Chapter Summary */}
        <div className="rounded-b-[32px] bg-white p-4 pb-6">
          {/* Top Bar with Logo and Actions */}
          <div className={`flex justify-between items-center mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* S Logo */}
            <div>
              <Image
                src="/S_logo.svg"
                alt="Sauvini S Logo"
                width={40}
                height={40}
              />
            </div>
            
            {/* Right Section: Level + Notifications */}
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {/* Level Badge */}
              <div className="flex items-center gap-2 bg-[#CEDAE9] px-3 py-2 rounded-full">
                <Heart className="w-4 h-4 text-[#324C72] fill-current" />
                <span className={`text-sm font-medium text-[#324C72] ${isRTL ? "font-arabic" : "font-sans"}`}>
                  {userProfile.level}
                </span>
              </div>

              {/* Notifications Icon Only */}
              <div className="flex items-center justify-center w-10 h-10 bg-[#324C72] rounded-full">
                <Bell className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          
          {/* Chapter Title & Description */}
          {currentChapter && (
            <div className={`mb-6 ${isRTL ? "text-right" : "text-left"}`}>
              <h1 className={`text-2xl font-bold text-gray-900 mb-2 ${isRTL ? "font-arabic" : "font-sans"}`}>
                {currentChapter.title}
              </h1>
              <p className={`text-gray-600 text-sm mb-5 ${isRTL ? "font-arabic" : "font-sans"}`}>
                {currentChapter.description}
              </p>
              
              {/* Progress Bar */}
              <div className="relative w-full h-2 bg-gray-200 rounded-full mb-1">
                <div 
                  className="absolute top-0 h-full bg-yellow-400 rounded-full"
                  style={{ 
                    width: `${(currentChapter.completedLessons / currentChapter.totalLessons) * 100}%`,
                    [isRTL ? 'right' : 'left']: 0 
                  }}
                ></div>
              </div>
              
              {/* Progress Text */}
              <div className={`flex ${isRTL ? "justify-start" : "justify-end"}`}>
                <span className={`text-xs text-gray-500 ${isRTL ? "font-arabic" : "font-sans"}`}>
                  {currentChapter.completedLessons}/{currentChapter.totalLessons} {t("modules.lessons")}
                </span>
              </div>
            </div>
          )}
        </div>
        
        {/* Lessons Section - Mobile */}
        <div className="flex-1 px-4 -mt-4">
          {/* Lessons Title */}
          <div className={`mt-8 mb-4 ${isRTL ? "text-right" : "text-left"}`}>
            <h2 className={`text-xl font-bold text-gray-900 ${isRTL ? "font-arabic" : "font-sans"}`}>
              {t("lesson.lessonsTitle")}
            </h2>
          </div>
          
          {/* Lessons Cards using LessonCard component */}
          <div className="flex flex-col gap-4">
            {filteredLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                onStartLearning={() => handleStartLearning(lesson.id)}
              />
            ))}
          </div>
        </div>

        {/* Footer - Mobile */}
        <div className="mt-auto w-full">
          <Footer isMobile isRTL={isRTL} />
        </div>
      </div>
    </>
  )
}