export interface Student {
  id: string
  name: string
  avatar: string
  level: number
}

export interface ExamSubmission {
  id: string
  student: Student
  moduleName: string
  chapterName: string
  submittedAt: string
  status: "waiting" | "corrected"
  grade?: number
  maxGrade: number
  submissionFileUrl: string
  correctionFileUrl?: string
  professorNotes?: string
}

export interface ExamFilter {
  chapter: string
  status: string
}
