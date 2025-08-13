"use client"

import Image from 'next/image'
import { ChevronRight, ChevronLeft, Lock } from 'lucide-react'
import { Module } from '@/types/modules'
import Button from '@/components/ui/button'
import { useLanguage } from '@/hooks/useLanguage'
import { RTL_LANGUAGES } from '@/lib/language'

interface ModuleCardProps {
  module: Module
  isRTL?: boolean
  isMobile?: boolean
  className?: string
}

const COLOR_MAP: Record<string, string> = {
  yellow: '#FFD427',
  blue: '#27364D',
  purple: '#9663FE'
} as const

const CARD_STYLES = {
  desktop: {
    width: 373,
    height: 220,
    padding: '20px 24px 44px 24px',
  },
  mobile: {
    height: 220,
    padding: '20px 20px 44px 24px',
  }
} as const

const ILLUSTRATION_SIZE = {
  width: 114,
  height: 120,
} as const

export default function ModuleCard({ 
  module, 
  isRTL: propIsRTL, 
  isMobile = false,
  className = '' 
}: ModuleCardProps) {
  const { t, language } = useLanguage()
  const isRTL = propIsRTL !== undefined ? propIsRTL : RTL_LANGUAGES.includes(language)
  
  const progressColor = COLOR_MAP[module.color] || '#BDBDBD'
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight
  const progressPercentage = Math.round((module.completedLessons / module.totalLessons) * 100)
  
  const truncateDescription = (text: string, maxLength: number = 90): string => {
    return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text
  }

  const cardStyles = isMobile ? CARD_STYLES.mobile : CARD_STYLES.desktop

  return (
    <div
      className={`
        relative flex items-center justify-center
        rounded-[28px] border border-gray-300 bg-white
        ${isMobile ? 'self-stretch' : ''}
        ${className}
      `}
      style={cardStyles}
    >
      {/* Internal frame */}
      <div 
        className="flex flex-col items-start gap-2"
        style={{ width: 325, flexShrink: 0, height: '100%' }}
      >
        {/* Top Row: illustration + info */}
        <div className={`flex w-full items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Illustration */}
          <div 
            className="relative flex-shrink-0 flex items-center justify-center"
            style={{
              width: ILLUSTRATION_SIZE.width,
              height: ILLUSTRATION_SIZE.height,
              padding: '3px 0 3.458px 0',
            }}
          >
            <Image
              src={module.illustration}
              alt={`${module.name} illustration`}
              fill
              className="object-contain"
              sizes="114px"
            />
          </div>

          {/* Module info */}
          <div className="flex-1 min-w-0 flex flex-col justify-between" style={{ height: ILLUSTRATION_SIZE.height }}>
            <div>
              <div className={`flex items-start justify-between gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {/* Module title */}
                <h3 className={`
                  text-xl font-semibold text-gray-900 leading-tight
                  ${isRTL ? 'text-right' : 'text-left'}
                `}>
                  {module.name}
                </h3>
                {/* Action icon */}
                <div className="flex-shrink-0 mt-1">
                  {module.isUnlocked ? (
                    <ChevronIcon 
                      className="w-5 h-5 text-gray-400 transition-colors hover:text-gray-600" 
                      aria-hidden="true"
                    />
                  ) : (
                    <div
                      className="flex items-center justify-center rounded-full bg-gray-100"
                      style={{ width: 30, height: 30 }}
                      aria-label="Module locked"
                    >
                      <Lock 
                        className="w-4 h-4" 
                        style={{ color: progressColor }} 
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </div>
              </div>
              {/* Description */}
              <p className={`
                text-sm text-gray-600 mt-1 leading-relaxed
                ${isRTL ? 'text-right' : 'text-left'}
              `}>
                {truncateDescription(module.description)}
              </p>
            </div>
            {/* spacer to keep layout consistent */}
            {!module.isUnlocked && (
              <div style={{ height: 24 }} />
            )}
          </div>
        </div>

        {/* Progress Bar (only if unlocked) */}
        {module.isUnlocked && (
          <div className="w-full mt-2">
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div 
                className="flex-1 bg-gray-200 rounded-full h-2 relative overflow-hidden"
                role="progressbar"
                aria-valuenow={progressPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${module.completedLessons} of ${module.totalLessons} lessons completed`}
              >
                <div
                  className="absolute top-0 h-full rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: `${progressPercentage}%`,
                    backgroundColor: progressColor,
                    [isRTL ? 'right' : 'left']: 0,
                  }}
                />
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap font-medium">
                {module.completedLessons}/{module.totalLessons} {module.totalLessons !== 1 ? t("modules.lessons") : t("modules.lesson")}
              </span>
            </div>
          </div>
        )}

        {/* Locked actions */}
        {!module.isUnlocked && (
          <div className={`flex w-full gap-2 mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button
              state="filled"
              size="XS"
              icon_position={isRTL ? "right" : "left"}
              icon={<Lock className="w-4 h-4" aria-hidden="true" />}
              text={t("modules.unlock")}
            />
            <Button
              state="text"
              size="XS"
              icon_position={isRTL ? "left" : "right"}
              icon={
                <ChevronIcon 
                  className="w-4 h-4" 
                  style={{ color: 'var(--primary-300)' }}
                  aria-hidden="true"
                />
              }
              text={t("modules.viewChapters")}
            />
          </div>
        )}
      </div>
    </div>
  )
}