export interface UserProfile {
  id: string;
  name: string;
  lastname: string;
  email: string;
  wilaya: string;
  phoneNumber: string;
  academicStream: AcademicStream;
  avatar: string;
  level: number;
  notificationCount: number;
  xp: number;
  createdAt: Date;
  chaptersCompleted?: number;
  lessonsCompleted?: number;
  lessonsLeft?: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  image: string; // lesson illustration/thumbnail
  duration: number; // in minutes
  isCompleted: boolean;
  isUnlocked: boolean;
  order: number;
  academic_streams?: Array<{
    id: string;
    name: string;
    labelKey: string;
  }>; // lessons can target specific streams
  video_url?: string; // video URL for the lesson
  pdf_url?: string; // PDF URL for the lesson
  exercise_total_mark?: number; // total marks for exercises
  exercise_total_xp?: number; // total XP for exercises
  created_at?: string; // creation date
  updated_at?: string; // last update date
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  image: string; // chapter illustration
  moduleId: string;
  lessons: Lesson[];
  prerequisites: string[]; // chapter IDs that must be completed first
  price: number; // in DA
  isPurchased: boolean;
  isCompleted: boolean;
  isUnlocked: boolean;
  order: number;
  academicStreams: AcademicStream[]; // chapters can target specific streams
  // Progress tracking
  totalLessons: number;
  completedLessons: number;
  // For professor
  status?: {
    hasWaitingVersion: boolean;
    hasValidatedVersion: boolean;
    hasPublishedVersion: boolean;
    lastPublishedDate: string | null;
    lastModifiedDate: string;
  };
}

export interface Module {
  id: string;
  name: string;
  description: string;
  illustration: string;
  chapters: Chapter[];
  totalLessons: number;
  completedLessons: number;
  isUnlocked: boolean;
  hasPurchasedChapters: boolean;
  color: "yellow" | "blue" | "purple" | "green" | "red";
  academicStreams: AcademicStream[];
}

export interface ModulesPageData {
  userProfile: UserProfile | null; // null for non-authenticated users
  modules: Module[];
}

export interface ChaptersPageData {
  userProfile: UserProfile | null;
  module: Module;
  chapters: Chapter[];
  selectedAcademicStream: AcademicStream;
  showMyChaptersOnly: boolean;
}

export interface LessonsPageData {
  userProfile: UserProfile | null;
  chapter: Chapter;
  lessons: Lesson[];
  selectedAcademicStream?: AcademicStream; // only for non-auth users
}

export const ACADEMIC_STREAMS = [
  "Mathematics",
  "Experimental Sciences",
  "Math-Technique",
  "Literature",
] as const;

export type AcademicStream = (typeof ACADEMIC_STREAMS)[number];

export const ALGERIAN_WILAYAS = [
  "Adrar",
  "Chlef",
  "Laghouat",
  "Oum El Bouaghi",
  "Batna",
  "Béjaïa",
  "Biskra",
  "Béchar",
  "Blida",
  "Bouira",
  "Tamanrasset",
  "Tébessa",
  "Tlemcen",
  "Tiaret",
  "Tizi Ouzou",
  "Alger",
  "Djelfa",
  "Jijel",
  "Sétif",
  "Saïda",
  "Skikda",
  "Sidi Bel Abbès",
  "Annaba",
  "Guelma",
  "Constantine",
  "Médéa",
  "Mostaganem",
  "MSila",
  "Mascara",
  "Ouargla",
  "Oran",
  "El Bayadh",
  "Illizi",
  "Bordj Bou Arréridj",
  "Boumerdès",
  "El Tarf",
  "Tindouf",
  "Tissemsilt",
  "El Oued",
  "Khenchela",
  "Souk Ahras",
  "Tipaza",
  "Mila",
  "Aïn Defla",
  "Naâma",
  "Aïn Témouchent",
  "Ghardaïa",
  "Relizane",
] as const;

export type Wilaya = (typeof ALGERIAN_WILAYAS)[number];

export interface ExamSubmission {
  id: string;
  examId: string;
  studentId: string;
  submittedAt: Date;
  grade?: number; // Professor's assigned grade (0-20)
  status: "submitted" | "passed" | "failed";
  solutionPdfUrl: string; // Student's uploaded solution
  studentNotes?: string; // Student's additional notes
  professorNotes?: string; // Professor's review notes
  professorReviewPdfUrl?: string; // Optional professor review file
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  chapterId: string;
  moduleId: string;
  status: "new" | "submitted" | "failed" | "passed" | "archived";
  totalQuestions: number;
  duration: number; // in minutes
  passingScore: number; // percentage
  attempts: number; // number of attempts made
  maxAttempts: number;
  submissions: ExamSubmission[];
  isUnlocked: boolean;
  createdAt: Date;
  // For UI
  moduleColor: Module["color"];
  moduleName: string;
  chapterName: string;
  chapterImage: string;
}

export interface ExamsPageData {
  userProfile: UserProfile | null;
  exams: Exam[];
  modules: Module[]; // For filtering
}

export interface ExamDetailsPageData {
  userProfile: UserProfile | null;
  exam: Exam;
  submissions: ExamSubmission[];
}

export interface ExerciseSubmission {
  id: string;
  exerciseId: string;
  studentId: string;
  submittedAt: Date;
  grade?: number; // Professor's assigned grade (0-total marks)
  status: "corrected" | "waiting";
  solutionPdfUrl: string; // Student's uploaded solution
  studentNotes?: string; // Student's additional notes
  professorNotes?: string; // Professor's review notes
  professorReviewPdfUrl?: string; // Optional professor review file
}

export interface Exercise {
  id: string;
  title: string; // Same as lesson name
  description: string;
  lessonId: string;
  chapterId: string;
  moduleId: string;
  status: "new" | "submitted" | "graded";
  totalMarks: number;
  exercisePdfUrl: string; // The exercise PDF file
  submission?: ExerciseSubmission; // Single submission only
  isUnlocked: boolean;
  createdAt: Date;
  // For UI
  moduleColor: Module["color"];
  moduleName: string;
  chapterName: string;
  lessonName: string;
}

export interface ExercisesPageData {
  userProfile: UserProfile | null;
  exercises: Exercise[];
  modules: Module[]; // For filtering
}

export interface ExerciseDetailsPageData {
  userProfile: UserProfile | null;
  exercise: Exercise;
  submission?: ExerciseSubmission;
}

// Question types
export interface QuestionTag {
  id: string;
  name: string;
  color: "blue" | "green" | "yellow" | "red" | "purple" | "gray";
  icon?: string;
}

export interface QuestionReply {
  id: string;
  questionId: string;
  authorId: string;
  authorName: string;
  authorType: "student" | "professor" | "admin";
  content: string;
  createdAt: Date;
  isAnswer?: boolean; // true if this is the accepted answer
  likes: number;
  attachments?: string[]; // file URLs
}

export interface Question {
  id: string;
  title: string;
  content: string;
  studentId: string;
  studentName: string;
  chapterId?: string;
  moduleId?: string;
  subject?: string;
  tags: QuestionTag[];
  status: "pending" | "answered" | "closed";
  importance: "normal" | "important" | "most-important";
  createdAt: Date;
  updatedAt: Date;
  views: number;
  likes: number;
  replies: QuestionReply[];
  attachments?: string[]; // file URLs
  // For UI
  moduleColor?: Module["color"];
  moduleName?: string;
  chapterName?: string;
}

export interface QuestionsPageData {
  userProfile: UserProfile | null;
  questions: Question[];
  modules: Module[]; // For filtering
  tags: QuestionTag[]; // Available tags
}

export interface QuestionDetailsPageData {
  userProfile: UserProfile | null;
  question: Question;
  replies: QuestionReply[];
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  importance: "normal" | "important" | "most-important";
  type: "payment" | "unlock" | "quiz" | "content" | "exercise" | "general";
  isRead: boolean;
  createdAt: Date;
  icon?: string;
}
