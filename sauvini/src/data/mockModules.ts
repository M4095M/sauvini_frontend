import type { Module, UserProfile, ModulesPageData, Chapter, Lesson, AcademicStream, Exam, ExamsPageData, ExamSubmission, Exercise, ExercisesPageData } from "@/types/modules"

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
    isUnlocked: false,
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

const ADVANCED_FUNCTIONS_LESSONS: Lesson[] = [
  {
    id: "lesson_004",
    title: "Logarithmic Functions",
    description: "Understanding logarithmic functions and their properties",
    image: "/placeholder.svg?height=200&width=300",
    duration: 40,
    isCompleted: false,
    isUnlocked: false,
    order: 1,
    academicStreams: ["Mathematics"],
  },
  {
    id: "lesson_005",
    title: "Exponential Functions",
    description: "Master exponential functions and their applications",
    image: "/placeholder.svg?height=200&width=300",
    duration: 45,
    isCompleted: false,
    isUnlocked: false,
    order: 2,
    academicStreams: ["Mathematics"],
  },
  {
    id: "lesson_006",
    title: "Trigonometric Functions",
    description: "Learn trigonometric functions and their graphs",
    image: "/placeholder.svg?height=200&width=300",
    duration: 50,
    isCompleted: false,
    isUnlocked: false,
    order: 3,
    academicStreams: ["Mathematics"],
  },
  {
    id: "lesson_007",
    title: "Function Transformations",
    description: "Understanding how to transform and manipulate functions",
    image: "/placeholder.svg?height=200&width=300",
    duration: 35,
    isCompleted: false,
    isUnlocked: false,
    order: 4,
    academicStreams: ["Mathematics"],
  },
]

const GEOMETRY_LESSONS: Lesson[] = [
  {
    id: "lesson_008",
    title: "Coordinate Geometry",
    description: "Master coordinate geometry and analytical methods",
    image: "/placeholder.svg?height=200&width=300",
    duration: 45,
    isCompleted: false,
    isUnlocked: true,
    order: 1,
    academicStreams: ["Mathematics", "Experimental Sciences"],
  },
  {
    id: "lesson_009",
    title: "Vector Geometry",
    description: "Learn vector operations and geometric applications",
    image: "/placeholder.svg?height=200&width=300",
    duration: 40,
    isCompleted: false,
    isUnlocked: false,
    order: 2,
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
    isUnlocked: true,
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
    lessons: ADVANCED_FUNCTIONS_LESSONS,
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
  {
    id: "chapter_003",
    title: "Geometry & Vectors",
    description: "Master coordinate geometry and vector operations",
    image: "/placeholder.svg?height=200&width=300",
    moduleId: "mathematics",
    lessons: GEOMETRY_LESSONS,
    prerequisites: [],
    price: 2000,
    isPurchased: true,
    isCompleted: false,
    isUnlocked: true,
    order: 3,
    academicStreams: ["Mathematics", "Experimental Sciences"],
    totalLessons: 2,
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

export const mockModulesPageData = MOCK_MODULES_DATA

export function filterModulesByStream(modules: Module[], stream: AcademicStream): Module[] {
  return modules.filter((module) => module.academicStreams.includes(stream))
}

export function filterChaptersByStream(chapters: Chapter[], stream: AcademicStream): Chapter[] {
  return chapters.filter((chapter) => chapter.academicStreams.includes(stream))
}

export function filterLessonsByStream(lessons: Lesson[], stream: AcademicStream): Lesson[] {
  return lessons.filter((lesson) => lesson.academicStreams.includes(stream))
}

export const MOCK_EXAMS: Exam[] = [
  {
    id: "exam_001",
    title: "Calculus Fundamentals Final Exam",
    description: "Test your understanding of derivatives and basic integration",
    chapterId: "chapter_001",
    moduleId: "mathematics",
    status: "failed",
    totalQuestions: 20,
    duration: 60,
    passingScore: 70,
    attempts: 2,
    maxAttempts: 3,
    submissions: [],
    isUnlocked: true,
    createdAt: new Date("2024-01-15"),
    moduleColor: "yellow",
    moduleName: "Mathematics",
    chapterName: "Calculus Fundamentals",
    chapterImage: "/geo.svg"
  },
  {
    id: "exam_002",
    title: "Advanced Functions Assessment",
    description: "Comprehensive test on logarithmic, exponential and trigonometric functions",
    chapterId: "chapter_002",
    moduleId: "mathematics",
    status: "new",
    totalQuestions: 25,
    duration: 75,
    passingScore: 75,
    attempts: 0,
    maxAttempts: 3,
    submissions: [],
    isUnlocked: true,
    createdAt: new Date("2024-01-20"),
    moduleColor: "yellow",
    moduleName: "Mathematics",
    chapterName: "Advanced Functions",
    chapterImage: "/placeholder.svg"
  },
  {
    id: "exam_003",
    title: "Geometry & Vectors Exam",
    description: "Test your knowledge of coordinate geometry and vector operations",
    chapterId: "chapter_003",
    moduleId: "mathematics",
    status: "passed",
    totalQuestions: 18,
    duration: 50,
    passingScore: 70,
    attempts: 1,
    maxAttempts: 3,
    submissions: [],
    isUnlocked: true,
    createdAt: new Date("2024-01-25"),
    moduleColor: "yellow",
    moduleName: "Mathematics",
    chapterName: "Geometry & Vectors",
    chapterImage: "/placeholder.svg"
  },
  {
    id: "exam_004",
    title: "Physics Mechanics Exam",
    description: "Comprehensive assessment of mechanics principles",
    chapterId: "chapter_004",
    moduleId: "physics",
    status: "new",
    totalQuestions: 22,
    duration: 65,
    passingScore: 75,
    attempts: 0,
    maxAttempts: 3,
    submissions: [],
    isUnlocked: true,
    createdAt: new Date("2024-02-01"),
    moduleColor: "purple",
    moduleName: "Physics",
    chapterName: "Mechanics",
    chapterImage: "/placeholder.svg"
  },
  {
    id: "exam_005",
    title: "Biology Cell Structure",
    description: "Test on cellular biology and organelle functions",
    chapterId: "chapter_005",
    moduleId: "natural-sciences",
    status: "submitted",
    totalQuestions: 15,
    duration: 45,
    passingScore: 70,
    attempts: 1,
    maxAttempts: 3,
    submissions: [],
    isUnlocked: true,
    createdAt: new Date("2024-02-05"),
    moduleColor: "blue",
    moduleName: "Natural Sciences",
    chapterName: "Cell Biology",
    chapterImage: "/placeholder.svg"
  }
]

export const MOCK_EXAMS_DATA: ExamsPageData = {
  userProfile: MOCK_USER_PROFILE,
  exams: MOCK_EXAMS,
  modules: MOCK_MODULES,
}

export const MOCK_EXAM_SUBMISSIONS: ExamSubmission[] = [
  {
    id: "submission_001",
    examId: "exam_001",
    studentId: "user_001",
    submittedAt: new Date("2024-01-20T10:30:00"),
    grade: 12,
    status: "failed",
    solutionPdfUrl: "/sample-solution.pdf",
    studentNotes: "I had trouble with the integration by parts question. I explained my reasoning in the steps.",
    professorNotes:
      "Good understanding of basic concepts but needs improvement in integration techniques. Review chapter 3 examples.",
    professorReviewPdfUrl: "/professor-review-001.pdf",
  },
  {
    id: "submission_002",
    examId: "exam_001",
    studentId: "user_001",
    submittedAt: new Date("2024-01-25T14:15:00"),
    status: "submitted",
    solutionPdfUrl: "/sample-solution-2.pdf",
    studentNotes: "Resubmitting after practicing more on derivatives.",
  },
  {
    id: "submission_003",
    examId: "exam_003",
    studentId: "user_001",
    submittedAt: new Date("2024-01-28T09:45:00"),
    grade: 16,
    status: "passed",
    solutionPdfUrl: "/sample-solution-3.pdf",
    studentNotes: "Feeling confident about vectors; Q4 might have an arithmetic slip.",
    professorNotes: "Excellent work! Clear understanding of geometric principles and vector calculations.",
  },
]

export const MOCK_EXERCISES: Exercise[] = [
  {
    id: "exercise_001",
    title: "Introduction to Derivatives",
    description: "Practice problems on basic derivative calculations",
    lessonId: "lesson_001",
    chapterId: "chapter_001",
    moduleId: "mathematics",
    status: "graded",
    totalMarks: 20,
    exercisePdfUrl: "/exercise-derivatives.pdf",
    submission: {
      id: "exercise_submission_001",
      exerciseId: "exercise_001",
      studentId: "user_001",
      submittedAt: new Date("2024-01-22T15:30:00"),
      grade: 18,
      status: "graded",
      solutionPdfUrl: "/student-solution-001.pdf",
      studentNotes: "I found question 3 challenging but managed to solve it using the chain rule.",
      professorNotes: "Excellent work! Very clear presentation of solutions. Only minor calculation error in question 2.",
      professorReviewPdfUrl: "/professor-exercise-review-001.pdf"
    },
    isUnlocked: true,
    createdAt: new Date("2024-01-15"),
    moduleColor: "yellow",
    moduleName: "Mathematics",
    chapterName: "Calculus Fundamentals",
    lessonName: "Introduction to Derivatives"
  },
  {
    id: "exercise_002",
    title: "Chain Rule Applications",
    description: "Advanced practice on chain rule for composite functions",
    lessonId: "lesson_002",
    chapterId: "chapter_001", 
    moduleId: "mathematics",
    status: "submitted",
    totalMarks: 25,
    exercisePdfUrl: "/exercise-chain-rule.pdf",
    submission: {
      id: "exercise_submission_002",
      exerciseId: "exercise_002",
      studentId: "user_001",
      submittedAt: new Date("2024-01-25T10:15:00"),
      status: "submitted",
      solutionPdfUrl: "/student-solution-002.pdf",
      studentNotes: "I struggled with the last two problems, but I think I got the method right."
    },
    isUnlocked: true,
    createdAt: new Date("2024-01-20"),
    moduleColor: "yellow",
    moduleName: "Mathematics",
    chapterName: "Calculus Fundamentals",
    lessonName: "Chain Rule Applications"
  },
  {
    id: "exercise_003",
    title: "Coordinate Geometry",
    description: "Practice problems on coordinate geometry methods",
    lessonId: "lesson_008",
    chapterId: "chapter_003",
    moduleId: "mathematics",
    status: "new",
    totalMarks: 15,
    exercisePdfUrl: "/exercise-coordinate-geometry.pdf",
    isUnlocked: true,
    createdAt: new Date("2024-01-28"),
    moduleColor: "yellow",
    moduleName: "Mathematics",
    chapterName: "Geometry & Vectors",
    lessonName: "Coordinate Geometry"
  },
  {
    id: "exercise_004",
    title: "Integration Techniques",
    description: "Advanced integration practice problems",
    lessonId: "lesson_003",
    chapterId: "chapter_001",
    moduleId: "mathematics",
    status: "new",
    totalMarks: 30,
    exercisePdfUrl: "/exercise-integration.pdf",
    isUnlocked: true,
    createdAt: new Date("2024-02-01"),
    moduleColor: "yellow",
    moduleName: "Mathematics",
    chapterName: "Calculus Fundamentals",
    lessonName: "Integration Techniques"
  }
]

export const MOCK_EXERCISES_DATA: ExercisesPageData = {
  userProfile: MOCK_USER_PROFILE,
  exercises: MOCK_EXERCISES,
  modules: MOCK_MODULES,
}

// Quiz mocks 
export type QuizQuestion = {
  id: string
  leadIn: string
  options: string[]
  type: "single" | "multiple"
  correct: number[] // indices of correct options
  image?: string
}

export const MOCK_QUIZZES: Record<string, { threshold: number; questions: QuizQuestion[] }> = {
  lesson_001: {
    threshold: 70,
    questions: [
      {
        id: "q1",
        leadIn: "Which of the following are basic derivative rules?",
        options: ["Product rule", "Quotient rule", "Loop rule", "Chain rule"],
        type: "multiple",
        correct: [0, 1, 3],
      },
      {
        id: "q2",
        leadIn: "The derivative of sin(x) is:",
        options: ["cos(x)", "-sin(x)", "sin(x) + cos(x)", "tan(x)"],
        type: "single",
        correct: [0],
      },
    ],
  },
  lesson_002: {
    threshold: 75,
    questions: [
      {
        id: "q1",
        leadIn: "Chain rule is used when:",
        options: [
          "A function is a composition of two functions",
          "A function is linear",
          "You add two functions",
          "You multiply two functions",
        ],
        type: "single",
        correct: [0],
      },
    ],
  },
  lesson_008: {
    threshold: 70,
    questions: [
      {
        id: "q1",
        leadIn: "Which of the following lie on the line y = 2x + 1?",
        options: ["(0, 1)", "(1, 2)", "(2, 5)", "(-1, -1)"],
        type: "multiple",
        correct: [0, 2],
      },
    ],
  },
}

// Find lesson + parents by lessonId
export function findLessonContext(lessonId: string) {
  for (const module of MOCK_MODULES) {
    for (const chapter of module.chapters) {
      const lesson = chapter.lessons.find((l) => l.id === lessonId)
      if (lesson) return { module, chapter, lesson }
    }
  }
  return { module: undefined, chapter: undefined, lesson: undefined }
}

// Next lesson inside the same chapter (if any)
export function getNextLessonId(lessonId: string): string | null {
  const ctx = findLessonContext(lessonId)
  if (!ctx.chapter || !ctx.lesson) return null
  const idx = ctx.chapter.lessons.findIndex((l) => l.id === lessonId)
  if (idx < 0) return null
  const next = ctx.chapter.lessons[idx + 1]
  return next ? next.id : null
}
