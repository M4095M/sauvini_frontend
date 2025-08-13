import type { Module, UserProfile, ModulesPageData, Chapter, Lesson, AcademicStream } from "@/types/modules"

export const MOCK_USER_PROFILE: UserProfile = {
  id: "user_001",
  name: "Lina",
  lastname: "Bensalah",
  email: "lina.bensalah@email.com",
  wilaya: "Alger",
  phoneNumber: "0555123456",
  academicStream: "Experimental Sciences",
  avatar: "/profile.png",
  level: 6,
  notificationCount: 3,
  xp: 2450,
  createdAt: new Date("2024-09-01"),
}

const SAMPLE_LESSONS: Lesson[] = [
  {
    id: "lesson_001",
    title: "Introduction to Derivatives",
    description: "Learn the basics of derivatives and their applications in calculus",
    image: "/placeholder.svg?height=200&width=300",
    duration: 45,
    isCompleted: true,
    isUnlocked: true,
    order: 1,
    academicStreams: ["Mathematics", "Experimental Sciences"],
  },
  {
    id: "lesson_002",
    title: "Chain Rule Applications",
    description: "Master the chain rule for complex composite functions",
    image: "/placeholder.svg?height=200&width=300",
    duration: 35,
    isCompleted: false,
    isUnlocked: true,
    order: 2,
    academicStreams: ["Mathematics", "Experimental Sciences"],
  },
  {
    id: "lesson_003",
    title: "Integration Techniques",
    description: "Learn various integration methods and their applications",
    image: "/placeholder.svg?height=200&width=300",
    duration: 50,
    isCompleted: false,
    isUnlocked: false,
    order: 3,
    academicStreams: ["Mathematics"],
  },
]

const SAMPLE_CHAPTERS: Chapter[] = [
  {
    id: "chapter_001",
    title: "Calculus Fundamentals",
    description: "Master the basics of differential and integral calculus",
    image: "/ChapterMath.png",
    moduleId: "mathematics",
    lessons: SAMPLE_LESSONS,
    prerequisites: [],
    price: 2500,
    isPurchased: true,
    isCompleted: false,
    isUnlocked: false,
    order: 1,
    academicStreams: ["Mathematics", "Experimental Sciences"],
    totalLessons: 3,
    completedLessons: 1,
  },
  {
    id: "chapter_002",
    title: "Advanced Functions",
    description: "Explore logarithmic, exponential and trigonometric functions",
    image: "/placeholder.svg?height=200&width=300",
    moduleId: "mathematics",
    lessons: [],
    prerequisites: ["chapter_001"],
    price: 3000,
    isPurchased: false,
    isCompleted: false,
    isUnlocked: false,
    order: 2,
    academicStreams: ["Mathematics"],
    totalLessons: 4,
    completedLessons: 0,
  },
]

export const MOCK_MODULES: Module[] = [
  {
    id: "mathematics",
    name: "Mathematics",
    description: "Master advanced mathematics concepts for your baccalaureate exam",
    illustration: "/Math.svg",
    chapters: SAMPLE_CHAPTERS,
    totalLessons: 75,
    completedLessons: 60,
    isUnlocked: true,
    hasPurchasedChapters: true,
    color: "yellow",
    academicStreams: ["Mathematics", "Experimental Sciences"],
  },
  {
    id: "physics",
    name: "Physics",
    description: "Understand mechanics, thermodynamics, and modern physics",
    illustration: "/placeholder.svg?height=300&width=400",
    chapters: [],
    totalLessons: 80,
    completedLessons: 50,
    isUnlocked: true,
    hasPurchasedChapters: true,
    color: "purple",
    academicStreams: ["Experimental Sciences", "Math-Technique"],
  },
  {
    id: "natural-sciences",
    name: "Natural Sciences",
    description: "Explore biology, geology and environmental sciences",
    illustration: "/placeholder.svg?height=300&width=400",
    chapters: [],
    totalLessons: 65,
    completedLessons: 60,
    isUnlocked: true,
    hasPurchasedChapters: true,
    color: "blue",
    academicStreams: ["Experimental Sciences"],
  },
  {
    id: "english",
    name: "English",
    description: "Improve your English language skills and literature knowledge",
    illustration: "/placeholder.svg?height=300&width=400",
    chapters: [],
    totalLessons: 60,
    completedLessons: 45,
    isUnlocked: true,
    hasPurchasedChapters: true,
    color: "green",
    academicStreams: ["Mathematics", "Experimental Sciences", "Literature"],
  },
  {
    id: "philosophy",
    name: "Philosophy",
    description: "Develop critical thinking and explore philosophical concepts",
    illustration: "/Math.svg",
    chapters: [],
    totalLessons: 40,
    completedLessons: 0,
    isUnlocked: false,
    hasPurchasedChapters: false,
    color: "purple",
    academicStreams: ["Literature", "Philosophy"],
  },
]

export const MOCK_MODULES_DATA: ModulesPageData = {
  userProfile: MOCK_USER_PROFILE,
  modules: MOCK_MODULES,
}

export function filterModulesByStream(modules: Module[], stream: AcademicStream): Module[] {
  return modules.filter((module) => module.academicStreams.includes(stream))
}

export function filterChaptersByStream(chapters: Chapter[], stream: AcademicStream): Chapter[] {
  return chapters.filter((chapter) => chapter.academicStreams.includes(stream))
}

export function filterLessonsByStream(lessons: Lesson[], stream: AcademicStream): Lesson[] {
  return lessons.filter((lesson) => lesson.academicStreams.includes(stream))
}
