"use client"

import Link from 'next/link'
import { ChevronLeft, Home, Search } from 'lucide-react'
import Button from '@/components/ui/button'
import { useLanguage } from '@/hooks/useLanguage'

export default function NotFound() {
  const { t, isRTL } = useLanguage()

  return (
    <div
      className="self-stretch flex items-center justify-center"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div
        className="flex items-center justify-center w-full rounded-[52px] bg-[#F8F8F8] dark:bg-[#1A1A1A]"
        style={{ minHeight: '60vh', padding: '32px 24px' }}
      >
        <div className="w-full max-w-xl text-center">
          {/* Icon */}
          <div
            className="mx-auto mb-6 flex items-center justify-center rounded-full bg-primary-50 dark:bg-primary-100/10"
            style={{ width: 88, height: 88 }}
          >
            <Search className="w-10 h-10 text-primary-300 dark:text-primary-400" />
          </div>

          {/* Title */}
          <h1
            className={`${isRTL ? 'font-arabic' : 'font-sans'} text-4xl md:text-5xl font-semibold text-gray-900 dark:text-white mb-3 tracking-tight`}
          >
            {t?.('notFound.title') || 'Content Not Found'}
          </h1>

          {/* Description */}
          <p
            className={`${isRTL ? 'font-arabic' : 'font-sans'} text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-prose mx-auto mb-8`}
          >
            {t?.('notFound.description') ||
              "The module, chapter, or lesson you're looking for doesn't exist or has been moved."}
          </p>

          {/* Actions */}
          <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <Link href="/modules" className="inline-block">
              <Button
                state="filled"
                size="M"
                icon_position={isRTL ? 'right' : 'left'}
                icon={<Home className="w-5 h-5" />}
                text={t?.('notFound.backToModules') || 'Back to Modules'}
              />
            </Link>

            <Link href="/" className="inline-block">
              <Button
                state="outlined"
                size="M"
                icon_position={isRTL ? 'right' : 'left'}
                icon={<ChevronLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />}
                text={t?.('notFound.goHome') || 'Go Home'}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}