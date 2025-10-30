import { BaseApi } from "./base";
import type {
  ApiResponse,
  Module,
  Chapter,
  Lesson,
  AcademicStream,
  ModuleEnrollment,
} from "@/types/api";

/**
 * Courses API class that handles all course-related functionality
 * Extends BaseApi to inherit common HTTP methods and token management
 */
export class CoursesApi extends BaseApi {
  // ===========================================
  // MODULE MANAGEMENT
  // ===========================================

  /**
   * Get all available modules
   * @returns Promise with list of modules
   */
  static async getModules(): Promise<ApiResponse<Module[]>> {
    return this.get<Module[]>("/courses/module", { requiresAuth: false });
  }

  /**
   * Get a specific module by ID
   * @param moduleId - The ID of the module to fetch
   * @returns Promise with module data
   */
  static async getModuleById(moduleId: string): Promise<ApiResponse<Module>> {
    return this.get<Module>(`/courses/module/${moduleId}`, {
      requiresAuth: false,
    });
  }

  // ===========================================
  // CHAPTER MANAGEMENT
  // ===========================================

  /**
   * Get all chapters for a specific module
   * @param moduleId - The ID of the module
   * @returns Promise with list of chapters
   */
  static async getChaptersByModule(
    moduleId: string
  ): Promise<ApiResponse<Chapter[]>> {
    return this.get<Chapter[]>(`/courses/module/${moduleId}/chapters`, {
      requiresAuth: false,
    });
  }

  /**
   * Get a specific chapter by ID
   * @param chapterId - The ID of the chapter to fetch
   * @returns Promise with chapter data
   */
  static async getChapterById(
    chapterId: string
  ): Promise<ApiResponse<Chapter>> {
    return this.get<Chapter>(`/courses/chapter/${chapterId}`, {
      requiresAuth: false,
    });
  }

  // ===========================================
  // LESSON MANAGEMENT
  // ===========================================

  /**
   * Get all lessons for a specific chapter
   * @param chapterId - The ID of the chapter
   * @returns Promise with list of lessons
   */
  static async getLessonsByChapter(
    chapterId: string
  ): Promise<ApiResponse<Lesson[]>> {
    return this.get<Lesson[]>(`/courses/chapter/${chapterId}/lessons`, {
      requiresAuth: false,
    });
  }

  /**
   * Get a specific lesson by ID
   * @param lessonId - The ID of the lesson to fetch
   * @returns Promise with lesson data
   */
  static async getLessonById(lessonId: string): Promise<ApiResponse<Lesson>> {
    return this.get<Lesson>(`/courses/lesson/${lessonId}`, {
      requiresAuth: false,
    });
  }

  // ===========================================
  // ENROLLMENT MANAGEMENT
  // ===========================================

  /**
   * Enroll in a module
   * @param moduleId - The ID of the module to enroll in
   * @returns Promise with enrollment data
   */
  static async enrollInModule(
    moduleId: string
  ): Promise<ApiResponse<ModuleEnrollment>> {
    return this.post<ModuleEnrollment>(
      `/courses/module/${moduleId}/enroll`,
      {},
      { requiresAuth: true }
    );
  }

  /**
   * Unenroll from a module
   * @param moduleId - The ID of the module to unenroll from
   * @returns Promise with success message
   */
  static async unenrollFromModule(
    moduleId: string
  ): Promise<ApiResponse<{ message: string }>> {
    return this.delete<{ message: string }>(
      `/courses/module/${moduleId}/unenroll`,
      { requiresAuth: true }
    );
  }

  /**
   * Get all enrolled modules for the current student
   * @returns Promise with list of enrollments
   */
  static async getEnrolledModules(): Promise<ApiResponse<ModuleEnrollment[]>> {
    return this.get<ModuleEnrollment[]>("/courses/enrollments", {
      requiresAuth: true,
    });
  }

  /**
   * Check enrollment status for a specific module
   * @param moduleId - The ID of the module to check
   * @returns Promise with enrollment status
   */
  static async checkEnrollmentStatus(
    moduleId: string
  ): Promise<ApiResponse<{ is_enrolled: boolean; module_id: string }>> {
    return this.get<{ is_enrolled: boolean; module_id: string }>(
      `/courses/module/${moduleId}/enrollment-status`,
      { requiresAuth: true }
    );
  }

  // ===========================================
  // ACADEMIC STREAMS
  // ===========================================

  /**
   * Get all available academic streams
   * @returns Promise with list of academic streams
   */
  static async getAcademicStreams(): Promise<ApiResponse<AcademicStream[]>> {
    return this.get<AcademicStream[]>("/courses/academic-streams", {
      requiresAuth: false,
    });
  }
}

