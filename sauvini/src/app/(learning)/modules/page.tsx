"use client"

import { useState, useEffect } from 'react'
import ModulesSection from '@/components/modules/ModulesSection'
import { MOCK_MODULES_DATA, filterModulesByStream } from '@/data/mockModules'

export default function ModulesPage() {
  const [isMobile, setIsMobile] = useState(false)
  
  const userProfile = MOCK_MODULES_DATA.userProfile;

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

  // Get user's modules based on academic stream
  const userModules = userProfile 
    ? filterModulesByStream(MOCK_MODULES_DATA.modules, userProfile.academicStream)
    : MOCK_MODULES_DATA.modules;

  return (
    <ModulesSection
      modules={userModules}
      isMobile={isMobile}
      userLevel={userProfile?.level || 1}
    />
  )
}