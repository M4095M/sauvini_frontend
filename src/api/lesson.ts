/**
 * Lesson API Client
 * Handles all lesson-related API calls
 */

import { BaseApi } from "./base";
import type { ApiResponse } from "@/types/api";

// ============================================
// Types
// ============================================

export interface Lesson {
  id?: string;
  title: string;
  description: string;
  image?: string;
  duration: number;
  order: number;
  video_url?: string;
  pdf_url?: string;
  exercise_total_mark?: number;
  exercise_total_xp?: number;
  academic_streams?: Array<{
    id: string;
    name: string;
    labelKey: string;
  }>;
  created_at?: string;
  updated_at?: string;
}

export interface LessonWithRelations {
  id?: string;
  title: string;
  description: string;
  image?: string;
  duration: number;
  order: number;
  video_url?: string;
  pdf_url?: string;
  video_file_id?: string;
  pdf_file_id?: string;
  chapter_id?: string;
  chapter_title?: string;
  stream_ids?: string[];
  progress?: {
    is_completed: boolean;
    is_unlocked: boolean;
    time_spent: number;
    completed_at?: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface LessonProgress {
  id?: string;
  lesson_id: string;
  student_id: string;
  is_completed: boolean;
  time_spent: number;
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateLessonRequest {
  title: string;
  description: string;
  image?: string;
  duration: number;
  order: number;
  video_url?: string;
  pdf_url?: string;
  chapter_id: string;
  stream_ids: string[];
}

export interface UpdateLessonRequest {
  id: string;
  title: string;
  description: string;
  image?: string;
  duration: number;
  order: number;
  video_url?: string;
  pdf_url?: string;
}

export interface UpdateProgressRequest {
  is_completed: boolean;
  time_spent: number;
}

// ============================================
// Public API (No Auth Required)
// ============================================

/**
 * Get a single lesson by ID
 */
export const getLesson = async (
  lessonId: string
): Promise<ApiResponse<LessonWithRelations>> => {
  return await BaseApi.get<LessonWithRelations>(`/courses/lesson/${lessonId}`, {
    requiresAuth: false,
  });
};

/**
 * Get all lessons for a chapter
 */
export const getLessonsByChapter = async (
  chapterId: string
): Promise<LessonWithRelations[]> => {
  const response = await BaseApi.get<LessonWithRelations[]>(
    `/courses/chapter/${chapterId}/lessons`,
    {
      requiresAuth: false,
    }
  );
  return response.data || [];
};

export interface CreateLessonRequest {
  chapter_id: string;
  title: string;
  description: string;
  image?: string;
  duration?: number;
  order?: number;
  video_url?: string;
  pdf_url?: string;
  exercise_total_mark?: number;
  exercise_total_xp?: number;
  academic_streams?: string[];
}

export const createLesson = async (
  lessonData: CreateLessonRequest
): Promise<Lesson> => {
  const response = await BaseApi.post<Lesson>(
    `/courses/lesson/create`,
    lessonData,
    {
      requiresAuth: false, // Temporarily set to false for testing
    }
  );
  return response.data;
};

export const updateLesson = async (
  lessonId: string,
  lessonData: Partial<CreateLessonRequest>
): Promise<Lesson> => {
  const response = await BaseApi.put<Lesson>(
    `/courses/lesson/${lessonId}/update`,
    lessonData,
    {
      requiresAuth: false, // Temporarily set to false for testing
    }
  );
  return response.data;
};

export const deleteLesson = async (lessonId: string): Promise<void> => {
  await BaseApi.delete(`/courses/lesson/${lessonId}/delete`, {
    requiresAuth: false, // Temporarily set to false for testing
  });
};

// ============================================
// Student API (Auth Required)
// ============================================

/**
 * Update lesson progress
 */
export const updateLessonProgress = async (
  lessonId: string,
  data: UpdateProgressRequest
): Promise<LessonProgress> => {
  const response = await BaseApi.post<LessonProgress>(
    `/lessons/${lessonId}/progress`,
    data,
    {
      requiresAuth: true,
    }
  );
  return response.data;
};

/**
 * Get student's progress for all lessons
 */
export const getStudentProgress = async (
  studentId: string
): Promise<LessonProgress[]> => {
  const response = await BaseApi.get<LessonProgress[]>(
    `/lessons/progress/student/${studentId}`,
    {
      requiresAuth: true,
    }
  );
  return response.data || [];
};

/**
 * Get student's progress for a specific chapter
 */
export const getChapterProgress = async (
  chapterId: string,
  studentId: string
): Promise<LessonProgress[]> => {
  const response = await BaseApi.get<LessonProgress[]>(
    `/lessons/progress/chapter/${chapterId}/student/${studentId}`,
    {
      requiresAuth: true,
    }
  );
  return response.data || [];
};

// ============================================
// Professor API (Auth Required)
// ============================================

// ============================================
// Utility Functions
// ============================================

/**
 * Format duration in minutes to readable string
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
};

/**
 * Calculate completion percentage for a chapter
 */
export const calculateChapterCompletion = (
  progress: LessonProgress[]
): number => {
  if (progress.length === 0) return 0;
  const completed = progress.filter((p) => p.is_completed).length;
  return Math.round((completed / progress.length) * 100);
};

/**
 * Get total time spent on a chapter
 */
export const getTotalTimeSpent = (progress: LessonProgress[]): number => {
  return progress.reduce((total, p) => total + p.time_spent, 0);
};

/**
 * Check if lesson is accessible based on stream
 */
export const isLessonAccessible = (
  lesson: LessonWithRelations,
  userStreamIds: string[]
): boolean => {
  if (!lesson.stream_ids || lesson.stream_ids.length === 0) return true;
  return lesson.stream_ids.some((streamId) => userStreamIds.includes(streamId));
};

// ============================================
// React Query Hooks (Optional)
// ============================================

/**
 * Example usage with React Query:
 *
 * import { useQuery, useMutation } from '@tanstack/react-query';
 *
 * // Get lessons by chapter
 * const { data: lessons } = useQuery({
 *   queryKey: ['lessons', 'chapter', chapterId],
 *   queryFn: () => getLessonsByChapter(chapterId)
 * });
 *
 * // Update progress
 * const updateProgress = useMutation({
 *   mutationFn: ({ lessonId, data }) => updateLessonProgress(lessonId, data),
 *   onSuccess: () => {
 *     queryClient.invalidateQueries(['progress']);
 *   }
 * });
 *
 * // Create lesson (Professor)
 * const createLessonMutation = useMutation({
 *   mutationFn: createLesson,
 *   onSuccess: () => {
 *     queryClient.invalidateQueries(['lessons']);
 *   }
 * });
 */

const LessonApi = {
  getLesson,
  getLessonsByChapter,
  updateLessonProgress,
  getStudentProgress,
  getChapterProgress,
  createLesson,
  updateLesson,
  deleteLesson,
  formatDuration,
  calculateChapterCompletion,
  getTotalTimeSpent,
  isLessonAccessible,
};

export default LessonApi;
