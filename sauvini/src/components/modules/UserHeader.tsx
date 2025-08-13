"use client"

import Image from 'next/image'
import { Heart, Bell } from 'lucide-react'
import Button from '@/components/ui/button'
import { UserProfile } from '@/types/modules'
import { LanguageSwitcher } from '../ui/language-switcher'
import { useLanguage } from '@/hooks/useLanguage'
import { RTL_LANGUAGES } from '@/lib/language'

interface UserHeaderProps {
  userProfile: UserProfile
  isMobile?: boolean
  className?: string
}

const USER_HEADER_STYLES = {
  container: {
    padding: 12,
    borderRadius: 56,
    background: 'var(--Surface-Level-2, #F8F8F8)',
  },
  profileCard: {
    width: 373,
    gap: 16,
  },
  avatar: {
    width: 81,
    height: 81,
  },
  actionsContainer: {
    gap: 16,
  },
  notificationsButton: {
    width: 179,
  }
} as const

export default function UserHeader({ 
  userProfile, 
  isMobile = false, 
  className = '' 
}: UserHeaderProps) {
  const { t, language } = useLanguage()
  const isRTL = RTL_LANGUAGES.includes(language)

  if (isMobile) {
    return null
  }

  return (
    <header
      className={`
        flex justify-between items-center self-stretch
        ${className}
      `}
      style={USER_HEADER_STYLES.container}
    >
      {/* Student Profile Card */}
      <div 
        className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}
        style={{
          width: USER_HEADER_STYLES.profileCard.width,
          gap: USER_HEADER_STYLES.profileCard.gap,
        }}
      >
        {/* Profile Picture */}
        <div 
          className="flex justify-center items-center flex-shrink-0 relative overflow-hidden rounded-full"
          style={{
            width: USER_HEADER_STYLES.avatar.width,
            height: USER_HEADER_STYLES.avatar.height,
            aspectRatio: '1/1',
          }}
        >
          <Image
            src={userProfile.avatar || "/placeholder.svg"}
            alt={`${userProfile.name} ${userProfile.lastname} profile picture`}
            fill
            className="object-cover"
            sizes="81px"
            priority
          />
        </div>

        {/* Text Frame */}
        <div className={`flex flex-col items-start flex-1 ${isRTL ? 'items-end' : 'items-start'}`}>
          <p
            className={isRTL ? 'text-right' : 'text-left'}
            style={{
              color: 'var(--Content-Secondary, #7C7C7C)',
              fontSize: 20,
              fontStyle: 'normal',
              fontWeight: 500,
              lineHeight: '30px',
              letterSpacing: -0.4
            }}
          >
            {t("modules.keepGoing")}
          </p>

          {/* User Name */}
          <h1
            className={`text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}
            style={{
              fontSize: 36,
              fontStyle: 'normal',
              fontWeight: 600,
              lineHeight: 'normal',
              letterSpacing: -0.72,
              margin: 0,
            }}
          >
            {userProfile.name} {userProfile.lastname}
          </h1>
        </div>
      </div>

      {/* Actions Section: Level, Notifications, Language Switcher */}
      <div 
        className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}
        style={{ gap: USER_HEADER_STYLES.actionsContainer.gap }}
      >
        {/* Level Badge */}
        <div className="flex items-center gap-2 px-6 py-4 rounded-full shadow-sm"
          style={{ background: '#CEDAE9' }}
        >
          <Heart 
            className="w-5 h-5 text-[#324C72] fill-current" 
            aria-hidden="true"
          />
          <span className="text-sm font-medium" style={{ color: '#324C72' }}>
            {t("modules.level")} {userProfile.level}
          </span>
        </div>

        {/* Notifications Button */}
        <div 
          className="flex items-center"
          style={{ width: USER_HEADER_STYLES.notificationsButton.width }}
        >
          <Button
            state="filled"
            size="M"
            icon_position="left"
            icon={<Bell className="w-5 h-5" style={{ color: '#CEDAE9' }} aria-hidden="true" />}
            text={t("modules.notifications")}
          />
        </div>

        {/* Language Switcher */}
        <LanguageSwitcher />
      </div>
    </header>
  )
}