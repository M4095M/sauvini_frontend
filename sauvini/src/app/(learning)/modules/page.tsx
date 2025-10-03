"use client"

import { useState, useEffect } from 'react'
import ModulesSection from '@/components/modules/ModulesSection'
import Loader from '@/components/ui/Loader'
import { MOCK_MODULES_DATA, filterModulesByStream } from '@/data/mockModules'
import { ModulesApi } from '@/api'
import {Module} from '@/api/modules'

export default function ModulesPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const [isLoadingModules, setIsLoadingModules] = useState(true)
  
  const userProfile = MOCK_MODULES_DATA.userProfile

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize()
    setIsLoaded(true)
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const [modules, setModules] = useState<Module[]>([])
  // this is used to handle fetching modules from backend

  const fetchMdodules = async () => {
    const modules = await ModulesApi.getModules()
    if (modules.data) {
      setModules(modules.data)
    }
  }

  useEffect(() => {
    // get all modules paginated:
      fetchMdodules()
      setIsLoadingModules(false)
  }, [])

  if (!isLoaded) {
    return (
      <div className="self-stretch w-full">
        <Loader label="Loading modules..." />
      </div>
    )
  }

  // Get user's modules based on academic stream
  const userModules = userProfile 
    ? filterModulesByStream(MOCK_MODULES_DATA.modules, userProfile.academicStream)
    : MOCK_MODULES_DATA.modules;

  return (
    <ModulesSection
      modules={modules}
      isMobile={isMobile}
      userLevel={userProfile?.level || 1}
    />
  )
}