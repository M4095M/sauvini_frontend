export interface Module {
  id: string
  name: string
  description: string
  illustration: string // URL to module illustration
  totalLessons: number
  completedLessons: number
  isUnlocked: boolean
  hasPurchasedChapters: boolean
  color: 'yellow' | 'blue' | 'purple' 
  academicStreams: string[]
}

export interface UserProfile {
  name: string
  avatar: string
  level: number
  notificationCount: number
}

export interface ModulesPageData {
  userProfile: UserProfile
  modules: Module[]
}