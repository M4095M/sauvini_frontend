import { BaseApi } from './base';
import type { ApiResponse } from '@/types/api';

// Import your existing module types - adjust these imports based on your actual types
// import type { Module, Lesson, Chapter } from '@/types/modules';

/**
 * Example types for lessons API (replace with your actual types)
 * These demonstrate how to structure API response types
 */
export interface Module {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  chaptersCount: number;
  lessonsCount: number;
  isCompleted: boolean;
  progress: number; // 0-100
  createdAt: string;
  updatedAt: string;
}

export interface Chapter {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  order: number;
  lessonsCount: number;
  isCompleted: boolean;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  chapterId: string;
  title: string;
  description: string;
  content: string;
  videoUrl?: string;
  duration?: number; // in minutes
  order: number;
  isCompleted: boolean;
  canAccess: boolean; // Based on prerequisites
  createdAt: string;
  updatedAt: string;
}

export interface LessonProgress {
  lessonId: string;
  userId: string;
  isCompleted: boolean;
  progress: number; // 0-100
  timeSpent: number; // in minutes
  lastAccessedAt: string;
}

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit?: number; // in minutes
  passingScore: number; // 0-100
  maxAttempts?: number;
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[]; // For multiple choice
  correctAnswer: string | number;
  points: number;
  explanation?: string;
}

/**
 * LessonsApi class handles all learning content related API calls
 * This demonstrates how to create specialized API classes that inherit from BaseApi
 * 
 * Features:
 * - Module management (listing, details)
 * - Chapter navigation
 * - Lesson content access
 * - Progress tracking
 * - Quiz functionality
 * - Automatic authentication handling via BaseApi
 */
export class LessonsApi extends BaseApi {
  
  // ===========================================
  // MODULE METHODS
  // ===========================================

  /**
   * Get all available modules for the current user
   * @returns Promise resolving to array of modules
   */
  static async getModules(): Promise<ApiResponse<Module[]>> {
    try {
      return await this.get<Module[]>('/modules', {
        requiresAuth: true, // This endpoint requires authentication
      });
    } catch (error) {
      console.error('Failed to fetch modules:', error);
      throw error;
    }
  }

  /**
   * Get detailed information about a specific module
   * @param moduleId - The ID of the module to fetch
   * @returns Promise resolving to module details
   */
  static async getModule(moduleId: string): Promise<ApiResponse<Module>> {
    try {
      return await this.get<Module>(`/modules/${moduleId}`, {
        requiresAuth: true,
      });
    } catch (error) {
      console.error(`Failed to fetch module ${moduleId}:`, error);
      throw error;
    }
  }

  /**
   * Get user's progress for a specific module
   * @param moduleId - The ID of the module
   * @returns Promise resolving to progress data
   */
  static async getModuleProgress(moduleId: string): Promise<ApiResponse<{ progress: number; completedLessons: number; totalLessons: number }>> {
    try {
      return await this.get<{ progress: number; completedLessons: number; totalLessons: number }>(
        `/modules/${moduleId}/progress`,
        { requiresAuth: true }
      );
    } catch (error) {
      console.error(`Failed to fetch module progress for ${moduleId}:`, error);
      throw error;
    }
  }

  // ===========================================
  // CHAPTER METHODS
  // ===========================================

  /**
   * Get all chapters in a specific module
   * @param moduleId - The ID of the module
   * @returns Promise resolving to array of chapters
   */
  static async getChapters(moduleId: string): Promise<ApiResponse<Chapter[]>> {
    try {
      return await this.get<Chapter[]>(`/modules/${moduleId}/chapters`, {
        requiresAuth: true,
      });
    } catch (error) {
      console.error(`Failed to fetch chapters for module ${moduleId}:`, error);
      throw error;
    }
  }

  /**
   * Get detailed information about a specific chapter
   * @param chapterId - The ID of the chapter to fetch
   * @returns Promise resolving to chapter details
   */
  static async getChapter(chapterId: string): Promise<ApiResponse<Chapter>> {
    try {
      return await this.get<Chapter>(`/chapters/${chapterId}`, {
        requiresAuth: true,
      });
    } catch (error) {
      console.error(`Failed to fetch chapter ${chapterId}:`, error);
      throw error;
    }
  }

  // ===========================================
  // LESSON METHODS
  // ===========================================

  /**
   * Get all lessons in a specific chapter
   * @param chapterId - The ID of the chapter
   * @returns Promise resolving to array of lessons
   */
  static async getLessons(chapterId: string): Promise<ApiResponse<Lesson[]>> {
    try {
      return await this.get<Lesson[]>(`/chapters/${chapterId}/lessons`, {
        requiresAuth: true,
      });
    } catch (error) {
      console.error(`Failed to fetch lessons for chapter ${chapterId}:`, error);
      throw error;
    }
  }

  /**
   * Get detailed information about a specific lesson
   * @param lessonId - The ID of the lesson to fetch
   * @returns Promise resolving to lesson details with content
   */
  static async getLesson(lessonId: string): Promise<ApiResponse<Lesson>> {
    try {
      return await this.get<Lesson>(`/lessons/${lessonId}`, {
        requiresAuth: true,
        timeout: 10000, // 10 second timeout for content-heavy requests
      });
    } catch (error) {
      console.error(`Failed to fetch lesson ${lessonId}:`, error);
      throw error;
    }
  }

  /**
   * Mark a lesson as completed
   * @param lessonId - The ID of the lesson to mark complete
   * @returns Promise resolving to success status
   */
  static async markLessonComplete(lessonId: string): Promise<ApiResponse<{ success: boolean; progress: LessonProgress }>> {
    try {
      return await this.post<{ success: boolean; progress: LessonProgress }>(
        `/lessons/${lessonId}/complete`,
        {}, // Empty body
        { requiresAuth: true }
      );
    } catch (error) {
      console.error(`Failed to mark lesson ${lessonId} as complete:`, error);
      throw error;
    }
  }

  /**
   * Update lesson progress (for tracking time spent, etc.)
   * @param lessonId - The ID of the lesson
   * @param progressData - Progress data to update
   * @returns Promise resolving to updated progress
   */
  static async updateLessonProgress(
    lessonId: string,
    progressData: { timeSpent?: number; progress?: number }
  ): Promise<ApiResponse<LessonProgress>> {
    try {
      return await this.put<LessonProgress>(
        `/lessons/${lessonId}/progress`,
        progressData,
        { requiresAuth: true }
      );
    } catch (error) {
      console.error(`Failed to update progress for lesson ${lessonId}:`, error);
      throw error;
    }
  }

  // ===========================================
  // QUIZ METHODS
  // ===========================================

  /**
   * Get quiz for a specific lesson
   * @param lessonId - The ID of the lesson
   * @returns Promise resolving to quiz data
   */
  static async getLessonQuiz(lessonId: string): Promise<ApiResponse<Quiz>> {
    try {
      return await this.get<Quiz>(`/lessons/${lessonId}/quiz`, {
        requiresAuth: true,
      });
    } catch (error) {
      console.error(`Failed to fetch quiz for lesson ${lessonId}:`, error);
      throw error;
    }
  }

  /**
   * Submit quiz answers
   * @param quizId - The ID of the quiz
   * @param answers - User's answers to quiz questions
   * @returns Promise resolving to quiz results
   */
  static async submitQuizAnswers(
    quizId: string,
    answers: Record<string, string | number>
  ): Promise<ApiResponse<{
    score: number;
    passed: boolean;
    correctAnswers: Record<string, string | number>;
    explanations: Record<string, string>;
  }>> {
    try {
      return await this.post<{
        score: number;
        passed: boolean;
        correctAnswers: Record<string, string | number>;
        explanations: Record<string, string>;
      }>(
        `/quizzes/${quizId}/submit`,
        { answers },
        { requiresAuth: true }
      );
    } catch (error) {
      console.error(`Failed to submit quiz ${quizId}:`, error);
      throw error;
    }
  }

  // ===========================================
  // SEARCH AND FILTER METHODS
  // ===========================================

  /**
   * Search for lessons across all modules
   * @param query - Search query
   * @param filters - Optional filters
   * @returns Promise resolving to search results
   */
  static async searchLessons(
    query: string,
    filters?: {
      moduleId?: string;
      chapterId?: string;
      completed?: boolean;
      difficulty?: 'beginner' | 'intermediate' | 'advanced';
    }
  ): Promise<ApiResponse<{
    lessons: Lesson[];
    total: number;
    page: number;
    limit: number;
  }>> {
    try {
      const searchParams = new URLSearchParams({ query });
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, String(value));
          }
        });
      }

      return await this.get<{
        lessons: Lesson[];
        total: number;
        page: number;
        limit: number;
      }>(`/lessons/search?${searchParams.toString()}`, {
        requiresAuth: true,
      });
    } catch (error) {
      console.error('Failed to search lessons:', error);
      throw error;
    }
  }

  // ===========================================
  // UTILITY METHODS
  // ===========================================

  /**
   * Get overall learning progress for current user
   * @returns Promise resolving to overall progress data
   */
  static async getOverallProgress(): Promise<ApiResponse<{
    totalModules: number;
    completedModules: number;
    totalLessons: number;
    completedLessons: number;
    totalTimeSpent: number;
    averageScore: number;
  }>> {
    try {
      return await this.get<{
        totalModules: number;
        completedModules: number;
        totalLessons: number;
        completedLessons: number;
        totalTimeSpent: number;
        averageScore: number;
      }>('/progress/overall', {
        requiresAuth: true,
      });
    } catch (error) {
      console.error('Failed to fetch overall progress:', error);
      throw error;
    }
  }

  /**
   * Get recommended lessons based on user progress
   * @param limit - Maximum number of recommendations to return
   * @returns Promise resolving to recommended lessons
   */
  static async getRecommendedLessons(limit: number = 5): Promise<ApiResponse<Lesson[]>> {
    try {
      return await this.get<Lesson[]>(`/lessons/recommended?limit=${limit}`, {
        requiresAuth: true,
      });
    } catch (error) {
      console.error('Failed to fetch recommended lessons:', error);
      throw error;
    }
  }
}