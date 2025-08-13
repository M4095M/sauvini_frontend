import { Module, UserProfile, ModulesPageData } from '@/types/modules'

export const MOCK_USER_PROFILE: UserProfile = {
  name: "Lina Bensalah",
  avatar: "/profile.png",
  level: 6,
  notificationCount: 3
}

export const MOCK_MODULES: Module[] = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    illustration: '/Math.svg',
    totalLessons: 75,
    completedLessons: 60,
    isUnlocked: true,
    hasPurchasedChapters: true,
    color: 'yellow',
    academicStreams: ['Mathematics', 'Experimental Sciences']
  },
  {
    id: 'natural-sciences',
    name: 'Natural Sciences',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    illustration: '/illustrations/science-lab.svg',
    totalLessons: 65,
    completedLessons: 60,
    isUnlocked: true,
    hasPurchasedChapters: true,
    color: 'blue',
    academicStreams: ['Experimental Sciences']
  },
  {
    id: 'physics',
    name: 'Physics',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    illustration: '/illustrations/physics-atom.svg',
    totalLessons: 80,
    completedLessons: 50,
    isUnlocked: true,
    hasPurchasedChapters: true,
    color: 'purple',
    academicStreams: ['Experimental Sciences', 'Math-Technique']
  },
  {
    id: 'english',
    name: 'English',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    illustration: '/Math.svg',
    totalLessons: 60,
    completedLessons: 45,
    isUnlocked: true,
    hasPurchasedChapters: true,
    color: 'yellow',
    academicStreams: ['Mathematics', 'Experimental Sciences', 'Literature']
  },
  {
    id: 'philosophy',
    name: 'Philosophy',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    illustration: '/Math.svg',
    totalLessons: 40,
    completedLessons: 0,
    isUnlocked: false,
    hasPurchasedChapters: false,
    color: 'purple',
    academicStreams: ['Literature', 'Philosophy']
  },
  {
    id: 'french',
    name: 'French',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    illustration: '/illustrations/french-language.svg',
    totalLessons: 55,
    completedLessons: 0,
    isUnlocked: false,
    hasPurchasedChapters: false,
    color: 'yellow',
    academicStreams: ['Mathematics', 'Experimental Sciences', 'Literature']
  },
  {
    id: 'islamic-studies',
    name: 'Islamic Studies',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    illustration: '/illustrations/islamic-mosque.svg',
    totalLessons: 35,
    completedLessons: 0,
    isUnlocked: false,
    hasPurchasedChapters: false,
    color: 'purple',
    academicStreams: ['Mathematics', 'Experimental Sciences', 'Literature']
  },
  {
    id: 'tamazight',
    name: 'Tamazight',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    illustration: '/illustrations/tamazight-culture.svg',
    totalLessons: 30,
    completedLessons: 0,
    isUnlocked: false,
    hasPurchasedChapters: false,
    color: 'blue',
    academicStreams: ['Mathematics', 'Experimental Sciences', 'Literature']
  },
  {
    id: 'arabic',
    name: 'Arabic',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    illustration: '/illustrations/arabic-calligraphy.svg',
    totalLessons: 70,
    completedLessons: 0,
    isUnlocked: false,
    hasPurchasedChapters: false,
    color: 'yellow',
    academicStreams: ['Mathematics', 'Experimental Sciences', 'Literature']
  }
]

export const MOCK_MODULES_DATA: ModulesPageData = {
  userProfile: MOCK_USER_PROFILE,
  modules: MOCK_MODULES
}