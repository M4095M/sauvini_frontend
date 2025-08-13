"use client"

import { useState } from 'react'
import { Module } from '@/types/modules'
import ModulesGrid from './ModulesGrid'
import { useLanguage } from '@/hooks/useLanguage'
import { RTL_LANGUAGES } from '@/lib/language'

interface ModulesSectionProps {
  modules: Module[]
  isMobile?: boolean
  userLevel?: number
}

export default function ModulesSection({ modules, isMobile = false, userLevel }: ModulesSectionProps) {
  const [showPurchasedOnly, setShowPurchasedOnly] = useState(false)
  const { language } = useLanguage()
  const isRTL = RTL_LANGUAGES.includes(language)

  const filteredModules = showPurchasedOnly 
    ? modules.filter(module => module.hasPurchasedChapters)
    : modules

  return (
    <section style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <ModulesGrid 
        modules={filteredModules}
        showPurchasedOnly={showPurchasedOnly}
        onToggleChange={setShowPurchasedOnly}
        isMobile={isMobile}
        userLevel={userLevel}
      />
    </section>
  )
}