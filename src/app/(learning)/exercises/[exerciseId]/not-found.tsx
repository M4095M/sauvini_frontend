"use client"

import Link from 'next/link'
import { ChevronLeft, Home, Search } from 'lucide-react'
import Button from '@/components/ui/button'
import { useLanguage } from '@/hooks/useLanguage'

export default function ExerciseNotFound() {
  const { t, isRTL } = useLanguage()

  return (
    <div className="flex items-center justify-center min-h-[60vh] w-full">
      <div className="text-center py-16 max-w-md">
        {/* Icon */}
        <div
          className="mx-auto mb-6 flex items-center justify-center rounded-full bg-primary-50 dark:bg-primary-100/10"
          style={{ width: 88, height: 88 }}
        >
          <Search className="w-10 h-10 text-primary-300 dark:text-primary-400" />
        </div>

        {/* Title */}
        <h1
          className={`${isRTL ? 'font-arabic' : 'font-sans'} text-4xl font-semibold text-gray-900 dark:text-white mb-3 tracking-tight`}
        >
          {t?.('notFound.exerciseTitle') || 'Exercise Not Found'}
        </h1>

        {/* Description */}
        <p
          className={`${isRTL ? 'font-arabic' : 'font-sans'} text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-prose mx-auto mb-8`}
        >
          {t?.('notFound.exerciseDescription') ||
            "The exercise you're looking for doesn't exist or has been moved."}
        </p>

        {/* Actions */}
        <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <Link href="/exercises" className="inline-block">
            <Button
              state="filled"
              size="M"
              icon_position={isRTL ? 'right' : 'left'}
              icon={<Home className="w-5 h-5" />}
              text={t?.('notFound.backToExercises') || 'Back to Exercises'}
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
  )
}