export type FormErrors<T> = {
  [K in keyof T]?: string;
};

/**
 * Base API response structure that matches Rust backend ApiResponse
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  request_id: string;
  timestamp: string;
  duration_ms?: number;
}

/**
 * Token pair structure that matches Rust backend TokenPair
 */
export interface TokenPair {
  access_token: string;
  refresh_token: string;
  expires_in: number; // in seconds, not timestamp
  token_type: string; // "Bearer"
}

/**
 * JWT Claims structure that matches Rust backend Claims
 */
export interface Claims {
  sub: string; // user ID
  email: string;
  role: string; // "admin" | "professor" | "student"
  iat: number; // issued at timestamp
  exp: number; // expiration timestamp
  token_type: string; // "access" | "refresh"
  jti: string; // JWT ID
}

/**
 * Admin model that matches Django backend Admin serializer
 */
export interface Admin {
  id?: string; // RecordId as string
  first_name?: string;
  last_name?: string;
  email: string;
  wilaya?: string;
  phone_number?: string;
  profile_picture_path?: string;
  email_verified?: boolean;
  password?: string; // Optional for responses
  created_at?: string;
  updated_at?: string;
}

/**
 * Student model that matches Rust backend Student
 */
export interface Student {
  id?: any; // RecordId as string
  first_name: string;
  last_name: string;
  wilaya: string;
  phone_number: string;
  academic_stream: string;
  email: string;
  password?: string; // Optional for responses
  profile_picture_path?: string;
  email_verified: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Professor model that matches Rust backend Professor
 */
export interface Professor {
  id?: string; // RecordId as string
  first_name: string;
  last_name: string;
  wilaya: string;
  phone_number: string;
  email: string;
  gender: string;
  date_of_birth: string;
  exp_school: boolean;
  exp_school_years?: number;
  exp_off_school: boolean;
  exp_online: boolean;
  cv_path: string;
  profile_picture_path?: string;
  email_verified: boolean;
  status: string; // "new" | "approved" | "rejected"
  password?: string; // Optional for responses
  created_at?: string;
  updated_at?: string;
}

/**
 * User union type for all possible user types
 */
export type User = Admin | Student | Professor;

/**
 * User role type that matches backend roles
 */
export type UserRole = "admin" | "professor" | "student";

/**
 * Login request structure that matches Rust backend LoginRequest
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login response structure that matches Rust backend LoginResponse<T>
 */
export interface LoginResponse<T> {
  token: TokenPair;
  user: T;
}

/**
 * Student registration data that matches Rust backend RegisterStudentRequest
 */
export interface RegisterStudentData {
  first_name: string;
  last_name: string;
  wilaya: string;
  phone_number: string;
  academic_stream: string;
  email: string;
  password: string;
  password_confirm: string;
}

/**
 * Professor registration data that matches Rust backend RegisterProfessorRequest
 */
export interface RegisterProfessorData {
  first_name: string;
  last_name: string;
  wilaya: string;
  phone_number: string;
  email: string;
  gender: string;
  date_of_birth: string;
  exp_school: boolean;
  exp_school_years?: number;
  exp_off_school: boolean;
  exp_online: boolean;
  password: string;
  password_confirm: string;
}

/**
 * Password reset request data
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * Password reset confirm data that matches backend ResetPasswordConfirmRequest
 */
export interface ResetPasswordConfirmRequest {
  token: string;
  new_password: string;
}

/**
 * Email verification request data
 */
export interface EmailVerificationRequest {
  token: string;
}

/**
 * Professor approve/reject request that matches backend ApproveRejectProfessorRequest
 */
export interface ApproveRejectProfessorRequest {
  id: string;
}

/**
 * Pagination request that matches backend PaginationRequest
 */
export interface PaginationRequest {
  page?: number;
  limit?: number;
}

/**
 * Configuration options for API requests
 */
export interface ApiRequestConfig {
  /** Whether this request requires authentication (default: true) */
  requiresAuth?: boolean;
  /** Skip automatic token refresh for this request */
  skipAuthRefresh?: boolean;
  /** Skip authentication entirely for this request (for login/register) */
  skipAuth?: boolean;
  /** Additional headers to include in the request */
  headers?: Record<string, string>;
  /** Request timeout in milliseconds */
  timeout?: number;
}

/**
 * Standardized API error structure
 */
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: unknown;
  data?: unknown; // Full response data for special error handling
}

/**
 * Service error types that match Rust backend ServiceError
 */
export type ServiceError =
  | { type: "NotFound"; message: string }
  | { type: "Unauthorized"; message: string }
  | { type: "ConflictError"; message: string }
  | { type: "Unknown"; message: string }
  | { type: "RepositoryError"; message: string };

/**
 * User context for middleware (matches backend UserContext)
 */
export interface UserContext {
  user_id: string;
  email: string;
  role: UserRole;
}

// ===========================================
// COURSE-RELATED TYPES
// ===========================================

/**
 * Academic stream model
 */
export interface AcademicStream {
  id: string;
  name: string;
  name_ar: string;
}

/**
 * Module model
 */
export interface Module {
  id: string;
  custom_id?: string;
  name: string;
  description: string;
  image_path?: string;
  color: string;
  academic_streams: AcademicStream[];
  created_at: string;
  updated_at: string;
}

/**
 * Chapter model
 */
export interface Chapter {
  id: string;
  name: string;
  description: string;
  price: number;
  module: string; // Module ID
  academic_streams: AcademicStream[];
}

/**
 * Lesson model
 */
export interface Lesson {
  id: string;
  title: string;
  description: string;
  image?: string;
  duration: number;
  order: number;
  video_url?: string;
  pdf_url?: string;
  exercise_total_mark: number;
  exercise_total_xp: number;
  academic_streams: AcademicStream[];
  chapter: string; // Chapter ID
  created_at: string;
  updated_at: string;
}

/**
 * Module enrollment model
 */
export interface ModuleEnrollment {
  id: string;
  module: Module;
  student_name: string;
  enrolled_at: string;
  is_active: boolean;
}

// ===========================================
// PROGRESS-RELATED TYPES
// ===========================================

/**
 * Lesson progress model
 */
export interface LessonProgress {
  id: string;
  lesson: Lesson;
  student_name: string;
  is_completed: boolean;
  is_unlocked: boolean;
  time_spent: number;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Chapter progress model
 */
export interface ChapterProgress {
  id: string;
  chapter: Chapter;
  student_name: string;
  is_completed: boolean;
  completion_percentage: number;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Module progress model
 */
export interface ModuleProgress {
  id: string;
  module: Module;
  student_name: string;
  is_completed: boolean;
  completion_percentage: number;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Progress summary model
 */
export interface ProgressSummary {
  lessons: {
    total: number;
    completed: number;
    completion_rate: number;
    total_time_spent: number;
  };
  chapters: {
    total: number;
    completed: number;
    completion_rate: number;
    avg_completion: number;
  };
  modules: {
    total: number;
    completed: number;
    completion_rate: number;
    avg_completion: number;
  };
}
