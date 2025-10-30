import { BaseApi } from "./base";
import type {
  ApiResponse,
  LessonProgress,
  ChapterProgress,
  ModuleProgress,
  ProgressSummary,
} from "@/types/api";

/**
 * Progress API class that handles all progress tracking functionality
 * Extends BaseApi to inherit common HTTP methods and token management
 */
export class ProgressApi extends BaseApi {
  // ===========================================
  // LESSON PROGRESS
  // ===========================================

  /**
   * Get progress for a specific lesson
   * @param lessonId - The ID of the lesson
   * @returns Promise with lesson progress data
   */
  static async getLessonProgress(
    lessonId: string
  ): Promise<ApiResponse<LessonProgress>> {
    return this.get<LessonProgress>(`/progress/lesson/${lessonId}/progress`, {
      requiresAuth: true,
    });
  }

  /**
   * Update progress for a specific lesson
   * @param lessonId - The ID of the lesson
   * @param progressData - The progress data to update
   * @returns Promise with updated progress data
   */
  static async updateLessonProgress(
    lessonId: string,
    progressData: {
      is_completed?: boolean;
      is_unlocked?: boolean;
      time_spent?: number;
    }
  ): Promise<ApiResponse<LessonProgress>> {
    return this.put<LessonProgress>(
      `/progress/lesson/${lessonId}/progress/update`,
      progressData,
      { requiresAuth: true }
    );
  }

  /**
   * Get progress for all lessons in a chapter
   * @param chapterId - The ID of the chapter
   * @returns Promise with list of lesson progress
   */
  static async getChapterLessonProgress(
    chapterId: string
  ): Promise<ApiResponse<LessonProgress[]>> {
    return this.get<LessonProgress[]>(
      `/progress/chapter/${chapterId}/lessons/progress`,
      { requiresAuth: true }
    );
  }

  // ===========================================
  // CHAPTER PROGRESS
  // ===========================================

  /**
   * Get progress for a specific chapter
   * @param chapterId - The ID of the chapter
   * @returns Promise with chapter progress data
   */
  static async getChapterProgress(
    chapterId: string
  ): Promise<ApiResponse<ChapterProgress>> {
    return this.get<ChapterProgress>(
      `/progress/chapter/${chapterId}/progress`,
      { requiresAuth: true }
    );
  }

  /**
   * Update progress for a specific chapter
   * @param chapterId - The ID of the chapter
   * @param progressData - The progress data to update
   * @returns Promise with updated progress data
   */
  static async updateChapterProgress(
    chapterId: string,
    progressData: {
      is_completed?: boolean;
      completion_percentage?: number;
    }
  ): Promise<ApiResponse<ChapterProgress>> {
    return this.put<ChapterProgress>(
      `/progress/chapter/${chapterId}/progress/update`,
      progressData,
      { requiresAuth: true }
    );
  }

  // ===========================================
  // MODULE PROGRESS
  // ===========================================

  /**
   * Get progress for a specific module
   * @param moduleId - The ID of the module
   * @returns Promise with module progress data
   */
  static async getModuleProgress(
    moduleId: string
  ): Promise<ApiResponse<ModuleProgress>> {
    return this.get<ModuleProgress>(`/progress/module/${moduleId}/progress`, {
      requiresAuth: true,
    });
  }

  // ===========================================
  // PROGRESS SUMMARY
  // ===========================================

  /**
   * Get overall progress summary for the current student
   * @returns Promise with progress summary data
   */
  static async getProgressSummary(): Promise<ApiResponse<ProgressSummary>> {
    return this.get<ProgressSummary>("/progress/summary", {
      requiresAuth: true,
    });
  }
}

