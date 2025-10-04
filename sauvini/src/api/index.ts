/**
 * API Module Exports
 *
 * This file provides convenient access to all API classes and types.
 * Import from here to get consistent, typed access to your API layer.
 *
 * Example usage:
 * ```typescript
 * import { AuthApi, LessonsApi, BaseApi } from '@/api';
 * import type { ApiResponse, User, TokenPair } from '@/api';
 * ```
 */

// ===========================================
// API CLASSES
// ===========================================

export { BaseApi } from "./base";
export { AuthApi } from "./auth";
export { LessonsApi } from "./lessons";
export { ModulesApi } from "./modules";
export { ChaptersApi } from "./chapters";

// ===========================================
// API TYPES
// ===========================================

// Re-export all API types for convenience
export type {
  ApiResponse,
  TokenPair,
  Claims,
  User,
  Student,
  Professor,
  Admin,
  UserRole,
  LoginRequest,
  LoginResponse,
  RegisterStudentData,
  RegisterProfessorData,
  ForgotPasswordRequest,
  ResetPasswordConfirmRequest,
  EmailVerificationRequest,
  ApproveRejectProfessorRequest,
  ApiRequestConfig,
  ApiError,
  ServiceError,
  UserContext,
} from "../types/api";

// Re-export lesson-related types
export type {
  Module,
  Chapter,
  Lesson,
  LessonProgress,
  Quiz,
  QuizQuestion,
} from "./lessons";

// ===========================================
// API UTILITIES
// ===========================================

// Import the classes for utility functions
import { BaseApi } from "./base";
import { AuthApi } from "./auth";
import type { UserRole } from "../types/api";

/**
 * Utility functions for API usage
 */
export const ApiUtils = {
  /**
   * Check if user is authenticated
   * @returns True if user has valid authentication
   */
  isAuthenticated: (): boolean => BaseApi.isAuthenticated(),

  /**
   * Get current user role from token
   * @returns User role or null
   */
  getCurrentUserRole: (): UserRole | null => BaseApi.getCurrentUserRole(),

  /**
   * Check if user has specific role
   * @param role Role to check
   * @returns True if user has the role
   */
  hasRole: (role: UserRole): boolean => BaseApi.hasRole(role),

  /**
   * Clear authentication tokens and redirect to login
   */
  logout: async (): Promise<void> => {
    await AuthApi.logout();
  },

  /**
   * Execute callback only if authenticated
   * @param callback Function to execute
   */
  requiresAuth: (callback: () => void): void => BaseApi.requiresAuth(callback),
};

// ===========================================
// API CONSTANTS
// ===========================================

/**
 * Common API constants
 */
export const API_CONSTANTS = {
  /** Default request timeout in milliseconds */
  DEFAULT_TIMEOUT: 30000,

  /** Token refresh buffer time in seconds (30 seconds) */
  TOKEN_REFRESH_BUFFER: 30,

  /** localStorage key for auth tokens */
  TOKEN_STORAGE_KEY: "sauvini_auth_tokens",

  /** sessionStorage key for post-login redirect */
  REDIRECT_STORAGE_KEY: "redirect_after_login",

  /** Common HTTP status codes */
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  } as const,

  /** API endpoints that match backend routes */
  ENDPOINTS: {
    AUTH: {
      LOGIN_STUDENT: "/auth/student/login",
      LOGIN_PROFESSOR: "/auth/professor/login",
      LOGIN_ADMIN: "/auth/admin/login",
      REGISTER_STUDENT: "/auth/student/register",
      REGISTER_PROFESSOR: "/auth/professor/register",
      LOGOUT: "/auth/logout",
      REFRESH: "/auth/refresh",
      FORGOT_PASSWORD: "/auth/forgot-password",
      RESET_PASSWORD_CONFIRM: "/auth/reset-password-confirm",
      VERIFY_EMAIL: "/auth/verify-email",
      RESEND_VERIFICATION: "/auth/resend-verification",
      ADMIN_PENDING_PROFESSORS: "/auth/admin/professors/pending",
      ADMIN_APPROVE_PROFESSOR: "/auth/admin/professors/approve",
      ADMIN_REJECT_PROFESSOR: "/auth/admin/professors/reject",
    },
    LESSONS: {
      MODULES: "/modules",
      CHAPTERS: "/chapters",
      LESSONS: "/lessons",
      PROGRESS: "/progress",
      SEARCH: "/lessons/search",
      RECOMMENDED: "/lessons/recommended",
    },
  } as const,
} as const;

// ===========================================
// ERROR HANDLING UTILITIES
// ===========================================

/**
 * Utility functions for handling API errors
 */
export const ErrorHandlers = {
  /**
   * Check if error is an authentication error
   * @param error The error to check
   * @returns True if it's an auth error
   */
  isAuthError: (error: unknown): boolean => {
    if (typeof error !== "object" || error === null) return false;
    const errorObj = error as Record<string, unknown>;
    return (
      errorObj.status === 401 ||
      (typeof errorObj.message === "string" &&
        errorObj.message.includes("Authentication"))
    );
  },

  /**
   * Check if error is a network error
   * @param error The error to check
   * @returns True if it's a network error
   */
  isNetworkError: (error: unknown): boolean => {
    if (typeof error !== "object" || error === null) return false;
    const errorObj = error as Record<string, unknown>;
    return (
      typeof errorObj.message === "string" &&
      (errorObj.message.includes("fetch") ||
        errorObj.message.includes("network"))
    );
  },

  /**
   * Get user-friendly error message
   * @param error The error to process
   * @returns User-friendly error message
   */
  getUserFriendlyMessage: (error: unknown): string => {
    if (ErrorHandlers.isAuthError(error)) {
      return "Authentication required. Please log in again.";
    }

    if (ErrorHandlers.isNetworkError(error)) {
      return "Network error. Please check your connection and try again.";
    }

    if (typeof error === "object" && error !== null && "message" in error) {
      return String((error as { message: unknown }).message);
    }

    return "An unexpected error occurred. Please try again.";
  },
};

/**
 * Type guard to check if an object is an ApiError
 * @param error The object to check
 * @returns True if it's an ApiError
 */
export function isApiError(
  error: unknown
): error is import("../types/api").ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string" &&
    "status" in error &&
    typeof (error as Record<string, unknown>).status === "number"
  );
}

/**
 * Type guard to check if a response is successful
 * @param response The response to check
 * @returns True if the response indicates success
 */
export function isApiSuccess<T>(
  response: import("../types/api").ApiResponse<T>
): response is import("../types/api").ApiResponse<T> & { success: true } {
  return response.success === true;
}
