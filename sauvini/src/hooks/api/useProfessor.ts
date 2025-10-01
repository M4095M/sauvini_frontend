import { useState, useCallback } from 'react';
import { ProfessorApi } from '@/api/professor';
import type { PaginationRequest } from '@/types/api';

/**
 * Custom hook for professor operations
 * Provides state management and error handling for all professor-related API calls
 */
export function useProfessor() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  // ===========================================
  // PROFILE MANAGEMENT
  // ===========================================

  const getProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ProfessorApi.getProfile();
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch profile');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (profileData: {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    wilaya?: string;
    exp_school_years?: number;
    exp_off_school?: boolean;
    exp_online?: boolean;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ProfessorApi.updateProfile(profileData);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to update profile');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfilePicture = useCallback(async (profilePicture: File) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ProfessorApi.updateProfilePicture(profilePicture);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to update profile picture');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCV = useCallback(async (cvFile: File) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ProfessorApi.updateCV(cvFile);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to update CV');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (passwordData: {
    current_password: string;
    new_password: string;
  }): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await ProfessorApi.changePassword(passwordData);
      if (response.success) {
        return true;
      } else {
        setError(response.message || 'Failed to change password');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // ===========================================
  // STUDENT MANAGEMENT
  // ===========================================

  const getEnrolledStudents = useCallback(async (
    pagination?: PaginationRequest,
    filters?: {
      course_id?: string;
      module_id?: string;
      progress_status?: 'not_started' | 'in_progress' | 'completed';
    }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ProfessorApi.getEnrolledStudents(pagination, filters);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch enrolled students');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getStudentProgress = useCallback(async (studentId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ProfessorApi.getStudentProgress(studentId);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch student progress');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessageToStudent = useCallback(async (studentId: string, messageData: {
    subject: string;
    content: string;
    priority?: 'low' | 'normal' | 'high';
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ProfessorApi.sendMessageToStudent(studentId, messageData);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to send message');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ===========================================
  // COURSE AND CONTENT MANAGEMENT
  // ===========================================

  const getCourses = useCallback(async (pagination?: PaginationRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ProfessorApi.getCourses(pagination);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch courses');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCourse = useCallback(async (courseData: {
    title: string;
    description: string;
    category: string;
    difficulty_level: 'beginner' | 'intermediate' | 'advanced';
    estimated_duration_hours: number;
    prerequisites?: string[];
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ProfessorApi.createCourse(courseData);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to create course');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCourse = useCallback(async (courseId: string, updateData: {
    title?: string;
    description?: string;
    category?: string;
    difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
    estimated_duration_hours?: number;
    prerequisites?: string[];
    status?: 'draft' | 'published' | 'archived';
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ProfessorApi.updateCourse(courseId, updateData);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to update course');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCourse = useCallback(async (courseId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await ProfessorApi.deleteCourse(courseId);
      if (response.success) {
        return true;
      } else {
        setError(response.message || 'Failed to delete course');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // ===========================================
  // LESSON MANAGEMENT
  // ===========================================

  const getCourseLessons = useCallback(async (courseId: string, pagination?: PaginationRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ProfessorApi.getCourseLessons(courseId, pagination);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch course lessons');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createLesson = useCallback(async (courseId: string, lessonData: {
    title: string;
    description: string;
    content: string;
    order: number;
    duration_minutes: number;
    content_type: 'video' | 'text' | 'interactive';
    video_url?: string;
    resources?: Array<{
      title: string;
      url: string;
      type: 'pdf' | 'link' | 'download';
    }>;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ProfessorApi.createLesson(courseId, lessonData);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to create lesson');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLesson = useCallback(async (lessonId: string, updateData: {
    title?: string;
    description?: string;
    content?: string;
    order?: number;
    duration_minutes?: number;
    content_type?: 'video' | 'text' | 'interactive';
    video_url?: string;
    is_published?: boolean;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ProfessorApi.updateLesson(lessonId, updateData);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to update lesson');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteLesson = useCallback(async (lessonId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await ProfessorApi.deleteLesson(lessonId);
      if (response.success) {
        return true;
      } else {
        setError(response.message || 'Failed to delete lesson');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // ===========================================
  // QUIZ AND ASSESSMENT MANAGEMENT
  // ===========================================

  const createQuiz = useCallback(async (lessonId: string, quizData: {
    title: string;
    description: string;
    time_limit_minutes?: number;
    passing_score: number;
    max_attempts?: number;
    questions: Array<{
      question: string;
      type: 'multiple_choice' | 'true_false' | 'short_answer';
      options?: string[];
      correct_answer: string | number;
      points: number;
      explanation?: string;
    }>;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ProfessorApi.createQuiz(lessonId, quizData);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to create quiz');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getQuizResults = useCallback(async (quizId: string, pagination?: PaginationRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ProfessorApi.getQuizResults(quizId, pagination);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch quiz results');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ===========================================
  // ANALYTICS AND REPORTING
  // ===========================================

  const getTeachingAnalytics = useCallback(async (period: 'week' | 'month' | 'quarter' | 'year' = 'month') => {
    setLoading(true);
    setError(null);
    try {
      const response = await ProfessorApi.getTeachingAnalytics(period);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch teaching analytics');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const exportCourseData = useCallback(async (courseId: string, format: 'csv' | 'xlsx' | 'pdf' = 'csv') => {
    setLoading(true);
    setError(null);
    try {
      const response = await ProfessorApi.exportCourseData(courseId, format);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to export course data');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // State
    loading,
    error,
    
    // Actions
    clearError,
    
    // Profile Management
    getProfile,
    updateProfile,
    updateProfilePicture,
    updateCV,
    changePassword,
    
    // Student Management
    getEnrolledStudents,
    getStudentProgress,
    sendMessageToStudent,
    
    // Course and Content Management
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    
    // Lesson Management
    getCourseLessons,
    createLesson,
    updateLesson,
    deleteLesson,
    
    // Quiz and Assessment Management
    createQuiz,
    getQuizResults,
    
    // Analytics and Reporting
    getTeachingAnalytics,
    exportCourseData,
  };
}